import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { z } from 'zod';
import Property from '../models/property';
import Reservation, { IReservation, ReservationStatus } from '../models/reservation';
import { checkPropertyAvailability } from '../utils/availability';

type AuthRole = 'renter' | 'owner' | 'admin';
type AuthUser = { sub?: string; role?: AuthRole };

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid id',
});

const createBookingSchema = z.object({
    propertyId: objectIdSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    message: z.string().trim().max(1000).optional(),
});

const listBookingsQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(10),
    ownerId: objectIdSchema.optional(),
    renterId: objectIdSchema.optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'declined']).optional(),
});

const updateStatusSchema = z.object({
    status: z.enum(['confirmed', 'declined', 'cancelled', 'completed']),
});

const availabilityQuerySchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
});

const getAuthUser = (req: Request) => req.user as AuthUser | undefined;

const normalizeReservation = (reservation: any) => {
    const value = typeof reservation.toObject === 'function' ? reservation.toObject() : reservation;
    return value;
};

const validateRange = (startDate: Date, endDate: Date) => endDate > startDate;

const computeBookingUnits = (startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    switch (period) {
        case 'daily':
            return days;
        case 'weekly':
            return Math.max(1, Math.ceil(days / 7));
        case 'monthly':
            return Math.max(1, Math.ceil(days / 30));
        case 'yearly':
            return Math.max(1, Math.ceil(days / 365));
        default:
            return days;
    }
};

const canReadReservation = (user: AuthUser | undefined, reservation: IReservation) => {
    if (!user?.sub) return false;
    if (user.role === 'admin') return true;
    return String(reservation.renterId) === user.sub || String(reservation.ownerId) === user.sub;
};

const canTransitionStatus = (reservation: IReservation, user: AuthUser, nextStatus: ReservationStatus) => {
    if (!user.sub || !user.role) return false;

    const isAdmin = user.role === 'admin';
    const isOwner = String(reservation.ownerId) === user.sub;
    const isRenter = String(reservation.renterId) === user.sub;

    if (nextStatus === 'completed') {
        return isAdmin;
    }

    if (nextStatus === 'confirmed' || nextStatus === 'declined') {
        const canAct = isAdmin || isOwner;
        return canAct && reservation.status === 'pending';
    }

    if (nextStatus === 'cancelled') {
        const canAct = isAdmin || isRenter;
        return canAct && (reservation.status === 'pending' || reservation.status === 'confirmed');
    }

    return false;
};

export const createBooking = async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user?.sub || !user.role) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!['renter', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden - only renters or admins can create bookings' });
    }

    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid booking data', errors: parsed.error.issues });
    }

    const { propertyId, startDate, endDate, message } = parsed.data;
    if (!validateRange(startDate, endDate)) {
        return res.status(400).json({ message: 'endDate must be greater than startDate' });
    }

    try {
        const property = await Property.findById(propertyId).select('ownerId price');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const availability = await checkPropertyAvailability(propertyId, startDate, endDate);
        if (!availability.available) {
            return res.status(409).json({
                message: 'Property is not available for the selected dates',
                conflicts: availability.conflictingReservationIds,
            });
        }

        const units = computeBookingUnits(startDate, endDate, property.price.period);
        const totalPrice = units * property.price.amount;

        const reservation = await Reservation.create({
            renterId: new Types.ObjectId(user.sub),
            ownerId: property.ownerId,
            propertyId: property._id,
            startDate,
            endDate,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending',
            message,
        });

        return res.status(201).json({ data: normalizeReservation(reservation) });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating booking' });
    }
};

export const listBookings = async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user?.sub || !user.role) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsed = listBookingsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid query parameters', errors: parsed.error.issues });
    }

    const { page, limit, ownerId, renterId, status } = parsed.data;
    const filter: FilterQuery<IReservation> = {};

    if (user.role === 'renter') {
        filter.renterId = new Types.ObjectId(user.sub);
    } else if (user.role === 'owner') {
        filter.ownerId = new Types.ObjectId(user.sub);
    } else {
        if (ownerId) filter.ownerId = new Types.ObjectId(ownerId);
        if (renterId) filter.renterId = new Types.ObjectId(renterId);
    }

    if (status) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    try {
        const [bookings, total] = await Promise.all([
            Reservation.find(filter)
                .sort([['createdAt', -1]])
                .skip(skip)
                .limit(limit)
                .populate('propertyId', 'title village address.city address.state propertyImages')
                .populate('renterId', 'fullName email')
                .populate('ownerId', 'fullName email')
                .lean(),
            Reservation.countDocuments(filter),
        ]);

        return res.status(200).json({
            data: bookings.map(normalizeReservation),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving bookings' });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user?.sub) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid booking id', errors: parsedId.error.issues });
    }

    try {
        const reservation = await Reservation.findById(parsedId.data);
        if (!reservation) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!canReadReservation(user, reservation)) {
            return res.status(403).json({ message: 'Forbidden - you cannot view this booking' });
        }

        return res.status(200).json({ data: normalizeReservation(reservation) });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving booking' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user?.sub || !user.role) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid booking id', errors: parsedId.error.issues });
    }

    const parsedBody = updateStatusSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ message: 'Invalid status update payload', errors: parsedBody.error.issues });
    }

    try {
        const reservation = await Reservation.findById(parsedId.data);
        if (!reservation) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const nextStatus = parsedBody.data.status;
        if (!canTransitionStatus(reservation, user, nextStatus)) {
            return res.status(403).json({ message: 'Forbidden - invalid booking status transition' });
        }

        reservation.status = nextStatus;
        await reservation.save();

        return res.status(200).json({ data: normalizeReservation(reservation) });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating booking status' });
    }
};

export const checkAvailabilityForProperty = async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const parsedId = objectIdSchema.safeParse(propertyId);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid property id', errors: parsedId.error.issues });
    }

    const parsedQuery = availabilityQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
        return res.status(400).json({ message: 'Invalid availability query', errors: parsedQuery.error.issues });
    }

    const { startDate, endDate } = parsedQuery.data;
    if (!validateRange(startDate, endDate)) {
        return res.status(400).json({ message: 'endDate must be greater than startDate' });
    }

    try {
        const property = await Property.findById(propertyId).select('_id').lean();
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const result = await checkPropertyAvailability(propertyId, startDate, endDate);
        return res.status(200).json({ available: result.available });
    } catch (error) {
        return res.status(500).json({ message: 'Error checking availability' });
    }
};

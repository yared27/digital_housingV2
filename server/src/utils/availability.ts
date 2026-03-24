import { Types } from 'mongoose';
import Reservation from '../models/reservation';

export const BLOCKING_RESERVATION_STATUSES = ['pending', 'confirmed'] as const;

type AvailabilityResult = {
    available: boolean;
    conflictingReservationIds: string[];
};

export const checkPropertyAvailability = async (
    propertyId: string | Types.ObjectId,
    startDate: Date,
    endDate: Date
): Promise<AvailabilityResult> => {
    const normalizedPropertyId =
        typeof propertyId === 'string' ? new Types.ObjectId(propertyId) : propertyId;

    const conflicts = await Reservation.find({
        propertyId: normalizedPropertyId,
        status: { $in: BLOCKING_RESERVATION_STATUSES },
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
    })
        .select('_id')
        .lean();

    return {
        available: conflicts.length === 0,
        conflictingReservationIds: conflicts.map((item) => String(item._id)),
    };
};

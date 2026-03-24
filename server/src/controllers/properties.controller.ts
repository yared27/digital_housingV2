import { Request, Response } from "express";
import { FilterQuery, Types } from "mongoose";
import { z } from "zod";
import Property, { IProperty } from "../models/property";
import Reservation from "../models/reservation";

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid id",
});

const coordinatesSchema = z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
    ]),
});

const addressSchema = z.object({
    street: z.string().trim().max(120).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    zipCode: z.string().trim().max(20).optional(),
    coordinates: coordinatesSchema.optional(),
});

const priceSchema = z.object({
    amount: z.number().nonnegative(),
    period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
});

const propertyImageSchema = z.string().url();

const createPropertySchema = z.object({
    title: z.string().trim().min(5).max(120),
    description: z.string().trim().min(10).max(5000),
    village: z.string().trim().min(1).max(100),
    address: addressSchema,
    price: priceSchema,
    propertyType: z.enum(['apartment', 'house', 'room', 'studio']),
    amenities: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
    propertyImages: z.array(propertyImageSchema).max(10).default([]),
    isAvailable: z.boolean().optional().default(true),
    isVerified: z.boolean().optional(),
});

const updatePropertySchema = createPropertySchema.partial();

const imageAppendSchema = z.object({
    propertyImages: z.array(propertyImageSchema).min(1).max(10),
});

const listPropertiesQuerySchema = z.object({
    village: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    state: z.string().trim().min(1).optional(),
    propertyType: z.enum(['apartment', 'house', 'room', 'studio']).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    amenities: z.preprocess((value) => {
        if (Array.isArray(value)) {
            return value.flatMap((item) => String(item).split(',')).map((item) => item.trim()).filter(Boolean);
        }
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim()).filter(Boolean);
        }
        return undefined;
    }, z.array(z.string()).optional()),
    isAvailable: z.preprocess((value) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
        }
        return undefined;
    }, z.boolean().optional()),
    ownerId: objectIdSchema.optional(),
    sortBy: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(12),
});

const getAuthUser = (req: Request) => req.user as { sub?: string; role?: 'renter' | 'owner' | 'admin' } | undefined;

const canManageProperty = (req: Request, property: IProperty) => {
    const user = getAuthUser(req);
    if (!user?.sub) return false;
    return user.role === 'admin' || String(property.ownerId) === user.sub;
};

const buildSort = (sortBy: 'newest' | 'price_asc' | 'price_desc') => {
    switch (sortBy) {
        case 'price_asc':
            return [['price.amount', 1], ['createdAt', -1]] as [string, 1 | -1][];
        case 'price_desc':
            return [['price.amount', -1], ['createdAt', -1]] as [string, 1 | -1][];
        case 'newest':
        default:
            return [['createdAt', -1]] as [string, 1 | -1][];
    }
};

const normalizeProperty = (property: any) => {
    const value = typeof property.toObject === 'function' ? property.toObject() : property;
    return value;
};

export const createProperty = async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user?.sub || !user.role) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!['owner', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden - only owners or admins can create properties' });
    }

    const parsed = createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid property data', errors: parsed.error.issues });
    }

    const payload = {
        ...parsed.data,
        ownerId: new Types.ObjectId(user.sub),
        isVerified: user.role === 'admin' ? parsed.data.isVerified ?? false : false,
    };

    try {
        const property = await Property.create(payload);
        return res.status(201).json({ data: normalizeProperty(property) });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating property' });
    }
};

export const listProperties = async (req: Request, res: Response) => {
    const parsed = listPropertiesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid query parameters', errors: parsed.error.issues });
    }

    const { village, city, state, propertyType, minPrice, maxPrice, amenities, isAvailable, ownerId, sortBy, page, limit } = parsed.data;
    const filter: FilterQuery<IProperty> = {};

    if (village) filter.village = { $regex: village, $options: 'i' };
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (state) filter['address.state'] = { $regex: state, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (typeof isAvailable === 'boolean') filter.isAvailable = isAvailable;
    if (ownerId) filter.ownerId = new Types.ObjectId(ownerId);
    if (amenities?.length) filter.amenities = { $all: amenities };
    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
        filter['price.amount'] = {};
        if (typeof minPrice === 'number') {
            filter['price.amount'].$gte = minPrice;
        }
        if (typeof maxPrice === 'number') {
            filter['price.amount'].$lte = maxPrice;
        }
    }

    const skip = (page - 1) * limit;

    try {
        const [properties, total] = await Promise.all([
            Property.find(filter).sort(buildSort(sortBy)).skip(skip).limit(limit).lean(),
            Property.countDocuments(filter),
        ]);

        return res.status(200).json({
            data: properties.map(normalizeProperty),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving properties' });
    }
};

export const getProperty = async (req: Request, res: Response) => {
    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid property id', errors: parsedId.error.issues });
    }

    try {
        const property = await Property.findById(parsedId.data).lean();
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        return res.status(200).json({ data: normalizeProperty(property) });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving property' });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid property id', errors: parsedId.error.issues });
    }

    const parsedBody = updatePropertySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ message: 'Invalid property data', errors: parsedBody.error.issues });
    }

    try {
        const property = await Property.findById(parsedId.data);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!canManageProperty(req, property)) {
            return res.status(403).json({ message: 'Forbidden - you can only update your own properties' });
        }

        const user = getAuthUser(req);
        const updates = { ...parsedBody.data } as Record<string, unknown>;
        if (user?.role !== 'admin') {
            delete updates.isVerified;
        }
        delete updates.ownerId;

        property.set(updates);
        await property.save();

        return res.status(200).json({ data: normalizeProperty(property) });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating property' });
    }
};

export const appendPropertyImages = async (req: Request, res: Response) => {
    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid property id', errors: parsedId.error.issues });
    }

    const parsedBody = imageAppendSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ message: 'Invalid image payload', errors: parsedBody.error.issues });
    }

    try {
        const property = await Property.findById(parsedId.data);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!canManageProperty(req, property)) {
            return res.status(403).json({ message: 'Forbidden - you can only update your own properties' });
        }

        const nextImages = Array.from(new Set([...property.propertyImages, ...parsedBody.data.propertyImages]));
        if (nextImages.length > 10) {
            return res.status(400).json({ message: 'A property can have at most 10 images' });
        }

        property.propertyImages = nextImages;
        await property.save();

        return res.status(200).json({ data: normalizeProperty(property) });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating property images' });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    const parsedId = objectIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ message: 'Invalid property id', errors: parsedId.error.issues });
    }

    try {
        const property = await Property.findById(parsedId.data);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!canManageProperty(req, property)) {
            return res.status(403).json({ message: 'Forbidden - you can only delete your own properties' });
        }

        const user = getAuthUser(req);
        if (user?.role !== 'admin') {
            const now = new Date();
            const hasFutureReservations = await Reservation.exists({
                propertyId: property._id,
                status: { $in: ['pending', 'confirmed'] },
                endDate: { $gt: now },
            });

            if (hasFutureReservations) {
                return res.status(409).json({
                    message: 'Cannot delete property with active or future reservations',
                });
            }
        }

        await property.deleteOne();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting property' });
    }
};


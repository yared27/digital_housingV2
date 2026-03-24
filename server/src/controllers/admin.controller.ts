import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/user";
import Property from "../models/property";
import Reservation from "../models/reservation";

const usersQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const getAdminStats = async (_req: Request, res: Response) => {
    try {
        const [totalUsers, totalProperties, totalBookings, pendingBookings] = await Promise.all([
            User.countDocuments(),
            Property.countDocuments(),
            Reservation.countDocuments(),
            Reservation.countDocuments({ status: "pending" }),
        ]);

        return res.status(200).json({
            totalUsers,
            totalProperties,
            totalBookings,
            pendingBookings,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch admin stats" });
    }
};

export const getAdminRecent = async (_req: Request, res: Response) => {
    try {
        const [properties, bookings] = await Promise.all([
            Property.find({})
                .sort({ createdAt: -1 })
                .limit(8)
                .select("title village address.city address.state isAvailable isVerified createdAt")
                .lean(),
            Reservation.find({})
                .sort({ createdAt: -1 })
                .limit(8)
                .populate("propertyId", "title village address.city address.state")
                .populate("renterId", "fullName email")
                .select("propertyId renterId status totalPrice startDate endDate createdAt")
                .lean(),
        ]);

        return res.status(200).json({
            properties,
            bookings,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch recent admin data" });
    }
};

export const listAdminUsers = async (req: Request, res: Response) => {
    const parsed = usersQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid query parameters", errors: parsed.error.issues });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    try {
        const [users, total] = await Promise.all([
            User.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("fullName email role isAccountVerified isUserIdentityVerified createdAt avatar")
                .lean(),
            User.countDocuments(),
        ]);

        return res.status(200).json({
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

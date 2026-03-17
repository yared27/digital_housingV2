import { Request, Response } from "express";
import User from "../models/user";
import { Types } from "mongoose";
import { z } from "zod";

const updateSchema = z.object({
    fullName: z.string().optional(),
    avatar: z.string().url().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z
        .object({
            country: z.string().optional(),
            city: z.string().optional(),
            postalCode: z.string().optional(),
        })
        .optional(),
});

export const getMe =  async (req: Request, res: Response) => {
    try {
        const reqUser = req.user as any;
        const userId = reqUser?.sub ?? reqUser?.userId ?? reqUser?.id;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const user = Types.ObjectId.isValid(String(userId))
            ? await User.findById(userId)
            : await User.findOne({ googleId: String(userId) });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password: _pwd, ...userWithoutPassword } = user.toObject();
        return res.json({ user: userWithoutPassword });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateMe = async (req:Request, res:Response) => {
    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsed.error.issues });
    }

    const reqUser = req.user as any;
    const userId = reqUser?.sub ?? reqUser?.userId ?? reqUser?.id;
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    let updatedUser;
    try {
        updatedUser = Types.ObjectId.isValid(String(userId))
            ? await User.findByIdAndUpdate(
                userId,
                { $set: parsed.data },
                { new: true }
            ).select('-reports')
            : await User.findOneAndUpdate(
                { googleId: String(userId) },
                { $set: parsed.data },
                { new: true }
            ).select('-reports');
    }catch (error: any) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }   

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const { password: _pwd, ...userWithoutPassword } = updatedUser.toObject();
    return res.json({ user: userWithoutPassword });
}   

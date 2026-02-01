import User from "../models/user";
import { SignInRequest } from "../types/auth/signIn";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config()

export const signUp = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        console.log('signUp request for:', email);

        // Pre-check: avoid attempt to create if email already exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('signUp conflict - email exists:', email);
            return res.status(409).json({ message: 'An account with that email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
        const user = await User.create({
            fullName: fullName || email,
            email,
            password: hashedPassword,
        });

        // Attempt to sign token and respond. If anything after create fails, delete the created user to avoid half-created accounts.
           
        const { password: _pwd, ...userWithoutPassword } = user.toObject();
        const responseBody = { user: userWithoutPassword };
        console.log('signUp success for:', email);
        console.log('responding', { status: 201, body: responseBody });
        return res.status(201).json(responseBody);

    } catch (error: any) {
        // Handle Prisma unique constraint error (P2002)
        
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body as SignInRequest;

    // Implement sign-in logic here
    const user = await User.findOne({ email });
    if(!user?.email) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000, // 1 hour
    });
    const { password: _pwd, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });

};

export const getMe =  async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            console.error('Invalid token in getMe:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }

        const userId = payload.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password: _pwd, ...userWithoutPassword } = user.toObject();
        return res.json({ user: userWithoutPassword });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
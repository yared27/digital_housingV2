import User from "../models/user";
import { SignInRequest } from "../types/auth/signIn";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
import { z } from "zod";
import { env } from "../config/env";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { setAuthCookie, clearAuthCookies } from "../utils/cookies";
import { tr } from "zod/v4/locales";
import { clear } from "console";
dotenv.config()

const signUpSchema =  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});


const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signUp = async (req: Request, res: Response) => {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsed.error.issues });
    }
    const { firstName, lastName, email, password } = parsed.data;
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
            role: 'renter',
        });

        // Attempt to sign token and respond. If anything after create fails, delete the created user to avoid half-created accounts.
        const payload = { sub: user.id, role: user.role };
        const access = signAccessToken(payload);
        const refresh = signRefreshToken(payload);
        const { password: _pwd, ...userWithoutPassword } = user.toObject();
        const responseBody = { user: userWithoutPassword };
        console.log('signUp success for:', email);
        console.log('responding', { status: 201, body: responseBody });
        setAuthCookie(res, access, refresh);
        const { password: _pwd2, ...userWithoutPassword2 } = user.toObject();
        return res.status(201).json({ user: userWithoutPassword });

    } catch (error: any) {
        // Handle Prisma unique constraint error (P2002)
        
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const signIn = async (req: Request, res: Response) => {
    const parsed = signInSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsed.error.issues });
    }
    const { email, password } = parsed.data;
    // Implement sign-in logic here
    const user = await User.findOne({ email }).select('+password');
    if(!user?.password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = { sub: user.id, role: user.role };
    // Generate JWT token
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    setAuthCookie(res, access, refresh);
    const { password: _pwd, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword });
};

export const refreshToken = async (req: Request, res: Response) => {
    const refreshTokenCookieName = env.REFRESH_TOKEN_COOKIE || 'refreshToken';
    const refreshToken = req.cookies?.[refreshTokenCookieName];
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    const jwtSecret = env.REFRESH_TOKEN_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT secret not configured" });
    }
    try {
        const payload: any = jwt.verify(refreshToken, jwtSecret);
        const newAccessToken = signAccessToken({ sub: payload.sub, role: payload.role });
        const newRefreshToken = signRefreshToken({ sub: payload.sub, role: payload.role });
        setAuthCookie(res, newAccessToken, newRefreshToken);
        return res.status(200).json({ ok: true });
    } catch (error) {
        clearAuthCookies(res);
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}
export const logout = (req: Request, res: Response) => {
    clearAuthCookies(res);
    res.status(204).send();
}
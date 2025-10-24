import { prisma } from "../lib/prisma";
import { Prisma } from '@prisma/client';
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
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('signUp conflict - email exists:', email);
            return res.status(409).json({ message: 'An account with that email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        // Attempt to sign token and respond. If anything after create fails, delete the created user to avoid half-created accounts.
           
        const { password: _pwd, ...userWithoutPassword } = user;
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
    const user = await prisma.user.findUnique({ where: { email } });
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
    const { password: _pwd, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });

};
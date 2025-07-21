import {User} from '../models/user.js';
import { z } from 'zod';
import bcrypt from 'bcrypt'

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: "Password must contain at least one special character",
    });

const createUserSchema = z.object({
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100),
    email: z.string().email("Invalid email format"),
    phone_number: z.string().min(10).max(15),
    password: passwordSchema
});

export const createAccount = async (req, res) => {
    try {
        const parsed = createUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.errors });
        }
        const { first_name, last_name, email, phone_number, password } = req.body;
        const hash_Password = await bcrypt.hash(password,12)
        const newUser = new User({
            first_name,
            last_name,
            email,
            phone_number,
            hash_Password
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

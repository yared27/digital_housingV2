import {z} from 'zod';
import dotenv from 'dotenv';
import { Console } from 'console';
dotenv.config();

const Schema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT : z.coerce.number().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGO_URI is required'),
    JWT_SECRET: z.string().min(10),
    REFRESH_TOKEN_SECRET: z.string().min(10),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
});

const parsed = Schema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;

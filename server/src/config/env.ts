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
    REFRESH_TOKEN_COOKIE: z.string().min(10).default('refreshToken'),
    ACCESS_TOKEN_COOKIE: z.string().default('token'),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:5000/api/auth/google/callback'),
    CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

const parsed = Schema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;

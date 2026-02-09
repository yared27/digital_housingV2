import { env } from "../config/env";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
const isProd = process.env.NODE_ENV === 'production';
export const signAccessToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m', ...options });
}

export const signRefreshToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', ...options });
}


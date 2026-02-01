import { env } from "../config/env";
import jwt from "jsonwebtoken";import dotenv from 'dotenv'

dotenv.config()
export const signAccessToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h', ...options });
}

export const signRefreshToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', ...options });
}

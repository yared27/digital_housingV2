import { env } from "../config/env";
import jwt from "jsonwebtoken";

export const signAccessToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m', ...options });
}

export const signRefreshToken = (payload: object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', ...options });
}

export const verifyAccessToken = <T extends object = any>(token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & T;
}

export const verifyRefreshToken = <T extends object = any>(token: string) => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload & T;
}


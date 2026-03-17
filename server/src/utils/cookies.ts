import { Request, Response } from "express";
import { env } from "../config/env";

const isProd = env.NODE_ENV === 'production';
export const setAuthCookie = (res: Response, accessToken: string, refreshToken: string) => {
    const common = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        domain: env.COOKIE_DOMAIN || undefined,
        path: '/', // Ensure cookies are sent for all routes
    } as const;
    res.cookie(env.ACCESS_TOKEN_COOKIE, accessToken, {
        ...common,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie(env.REFRESH_TOKEN_COOKIE, refreshToken, {
        ...common,
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
} 

export const clearAuthCookies = (res: Response) => {
    const common = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        domain: env.COOKIE_DOMAIN || undefined,
        path: '/',
    } as const;

    res.clearCookie(env.ACCESS_TOKEN_COOKIE, common);
    res.clearCookie(env.REFRESH_TOKEN_COOKIE, common);
}

export const extracAccessToken = (req: Request): string | null => {
    // @ts-ignore
    const cookies = (req as Request).cookies;
    const cookieToken = cookies?.[env.ACCESS_TOKEN_COOKIE] ||
        cookies?.['access_token'] ||
        cookies?.['token'];

    if (cookieToken) {
        return cookieToken;
    }
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) return auth.slice('Bearer '.length);
    return null;
}
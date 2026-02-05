import * as jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
import { env } from "../config/env";
import { signAccessToken, signRefreshToken} from "../utils/jwt";
import { setAuthCookie, extracAccessToken } from "../utils/cookies";

dotenv.config()

export interface AuthenticatedRequest extends Request {
    user?: { sub:any
}}
// If you want strong typing for req.user, consider adding a global declaration file that extends Express.Request.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = extracAccessToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const Payload = jwt.verify(token, env.JWT_SECRET) as { sub: any, role: string };
        req.user = Payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
        
}

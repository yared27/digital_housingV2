import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { extracAccessToken } from "../utils/cookies";


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
        const payload = verifyAccessToken<{ sub?: string; role?: string }>(token);
        if (!payload.sub) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
        
}

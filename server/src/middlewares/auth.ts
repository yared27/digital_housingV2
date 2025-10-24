import * as jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'

dotenv.config()

// If you want strong typing for req.user, consider adding a global declaration file that extends Express.Request.
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token as string | undefined;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not set');
        return res.status(500).json({ message: 'Server misconfiguration' });
    }

    jwt.verify(
        token,
        secret,
        (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }

            // Assign to the typed `req.user` (global declaration in src/types/express.d.ts)
            req.user = decoded;
            next();
        }
    );
}

import { Response, NextFunction, Request } from "express";


export const requireRole = (allowed: Array<'renter' | 'owner' | 'admin'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req.user as any)?.role;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if(!allowed.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden - insufficient role" });
        }   
        next();
    };
}
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal server error' });
    
}
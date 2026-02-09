import type { JwtPayload } from 'jsonwebtoken';
import type { IUser } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      // Adjust this to match the shape you store in the token. JwtPayload is a safe default.
      user?: JwtPayload | string | { userId?: string } | { sub: string; role: 'renter' | 'owner' | 'admin' } | IUser;
    }
  }
}

export {};

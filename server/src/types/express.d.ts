import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      // Adjust this to match the shape you store in the token. JwtPayload is a safe default.
      user?: JwtPayload | string | { userId?: string };
    }
  }
}

export {};

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { setAuthCookie, clearAuthCookies } from "../utils/cookies";
import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user";
import { env } from "../config/env";

export const googleCallback = async (req:Request, res:Response) => {
  const googleUser = req.user as any;
    
    const userId = googleUser?._id ?? googleUser?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication Failed" });
    }

    const payload = { sub: String(userId), role: googleUser?.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    // res.cookie("token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000, 
    //   sameSite: "lax",             
    // });
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const refreshPayload = verifyRefreshToken(refreshToken);
    const issuedAt = typeof refreshPayload.iat === "number"
      ? new Date(refreshPayload.iat * 1000)
      : new Date();
    const user = await User.findById(userId).select('+refreshTokenHash +refreshTokenIssuedAt');

    if (user) {
      user.refreshTokenHash = hash;
      user.refreshTokenIssuedAt = issuedAt;
      await user.save();
    }

    setAuthCookie(res, accessToken, refreshToken);
  const clientBase = (env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
  res.redirect(`${clientBase}/auth/callback`);
}

export const onFailure = (req:Request, res:Response) => {
  res.status(401).json({ message: "Authentication Failed" });
}

export const logout = (req:Request, res:Response) => {
  clearAuthCookies(res);
  res.status(204).send();
}
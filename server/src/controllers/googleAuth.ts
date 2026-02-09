import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { setAuthCookie, clearAuthCookies } from "../utils/cookies";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/user";


dotenv.config()
export const googleCallback = async (req:Request, res:Response) => {
    const googleUser = req.user as typeof User extends infer T ? any : any;
    
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
    setAuthCookie(res, accessToken, refreshToken);

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}`);
}

export const onFailure = (req:Request, res:Response) => {
  res.status(401).json({ message: "Authentication Failed" });
}

export const logout = (req:Request, res:Response) => {
  clearAuthCookies(res);
  res.status(204).send();
}
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
export const googleCallback = (req:Request, res:Response) => {
    const user = req.user;
    const token = jwt.sign({user}, process.env.JWT_SECRET!, {expiresIn:"1d"});
    res.json({token, user})
}
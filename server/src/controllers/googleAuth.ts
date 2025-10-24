import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { prisma } from "../lib/prisma";
import { profile } from "console";

dotenv.config()
export const googleCallback = async (req:Request, res:Response) => {
    const googleUser = req.user as any;
    const email = googleUser.emails[0].value;
    const name = googleUser.displayName;

    let user = await prisma.user .findUnique({
        where: {email: email}
    });

    if(!user){
      user = await prisma.user.create({
        data: {
          email: email,
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1] || "",
        } 
      });
    }
    const token = jwt.sign({googleUser}, process.env.JWT_SECRET!, {expiresIn:"1d"});
    res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, 
  sameSite: "lax",             
});
res.redirect("http://localhost:3000");
}


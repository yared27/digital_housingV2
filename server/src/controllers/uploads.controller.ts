import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
// @ts-ignore
import type {} from 'cloudinary';
import {env} from "../config/env";
import dotenv from "dotenv";
dotenv.config();
import { requireAuth,AuthenticatedRequest } from "../middlewares/auth";

export const signCloudinarySignature = async (req:AuthenticatedRequest, res:any) => {
    const {folder = "avatars", public_id} = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);
    const pid = public_id || `${folder}/${(req.user as any).sub }`;
    const params = {timestamp, folder: pid, public_id: pid};
    const signature = cloudinary.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET);
    res.json({ signature, timestamp, folder, public_id: pid});   
}


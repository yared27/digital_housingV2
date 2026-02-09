import express from "express";
import { requireAuth } from "../middlewares/auth";
import { signCloudinarySignature } from "../controllers/uploads.controller";
const router = express.Router();


router.post('/sign',requireAuth, signCloudinarySignature);
export default router;
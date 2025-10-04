import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import { googleCallback } from "../controllers/authController.js";


const router = express.Router();

router.get('/google', passport.authenticate('google', { scope:["profile", "email"]}));
router.get('/google/callback', passport.authenticate("google", { failureRedirect:"/"}), googleCallback);

export default router;
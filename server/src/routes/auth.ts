import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import { googleCallback } from "../controllers/googleAuth";
import {signIn, signUp} from "../controllers/auth";

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope:["profile", "email"]}));
router.get('/google/callback', passport.authenticate("google", { failureRedirect:"/"}), googleCallback);
router.post('/signUp',signUp);
router.post('/signIn',signIn);
export default router;
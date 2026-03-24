import express from "express"
import passport from "passport"
import { googleCallback } from "../controllers/googleAuth";
import { signIn, signUp, refreshToken, logout } from "../controllers/auth";
import { requireAuth } from "../middlewares/auth";
import { getMe } from "../controllers/users.controller";

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope:["profile", "email"], prompt: "select_account", session: false }));
router.get('/google/callback', passport.authenticate("google", { failureRedirect:"api/auth/failure", session: false }), googleCallback);
router.get('/me', requireAuth, getMe);
router.post('/signUp',signUp);
router.post('/signIn',signIn);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
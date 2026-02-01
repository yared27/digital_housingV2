import express from "express"
import passport from "passport"
import { googleCallback } from "../controllers/googleAuth";
import { signIn, signUp, getMe } from "../controllers/auth";

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope:["profile", "email"], prompt: "select_account", session: false }));
router.get('/google/callback', passport.authenticate("google", { failureRedirect:"api/auth/failure", session: false }), googleCallback);
router.post('/signUp',signUp);
router.post('/signIn',signIn);
router.get('/me', getMe);

export default router;
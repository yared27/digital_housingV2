import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

// Load env (index.ts also loads dotenv, but keep this for safety during direct imports)
dotenv.config();

// Debug: print presence/length of Google env vars (do not print secrets)
const cid = process.env.GOOGLE_CLIENT_ID || "";
const csecret = process.env.GOOGLE_CLIENT_SECRET || "";
const curl = process.env.GOOGLE_REDIRECT_URI || "";
// console.debug('[google] GOOGLE_CLIENT_ID present:', cid.length > 0 ? 'yes' : 'no', 'length=', cid.length);
// console.debug('[google] GOOGLE_CLIENT_SECRET present:', csecret.length > 0 ? 'yes' : 'no', 'length=', csecret.length);
// console.debug('[google] GOOGLE_REDIRECT_URI present:', curl.length > 0 ? 'yes' : 'no', 'value=', curl);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.length);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET?.length);
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);


passport.use(new GoogleStrategy({
    clientID: cid,
    clientSecret: csecret,
    callbackURL: curl,
},  (_accessToken, _refreshToken, profile, done) => {
    // Keep the verification simple for now; the token exchange happens inside the strategy.
    return done(null, profile);

}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});
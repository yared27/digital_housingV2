import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {env} from "../config/env";
import { IUser } from '../models/user';

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env.CLIENT_URL}/auth/google/callback`,
},  async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) {
            return done(new Error('No email found in Google profile'));
        }
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                fullName: profile.displayName,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
                isVerified: true,
            });
        }
        return done(null, user);
    } catch (error) {
       return done(error);
    }
}));

export default passport;
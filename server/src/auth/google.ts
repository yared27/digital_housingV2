import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID!,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL : "/auth/google/callback",
    },

    function (accessToken:any, refreshToken:any,profile: any,done: any ){
        // here we can find or create the user in your database

        return done(null, profile);
    }

)
)

passport.serializeUser((user:any, done) =>{
    done(null, user);
})

passport.deserializeUser((obj:any,done)=>{
    done(null,obj)
})
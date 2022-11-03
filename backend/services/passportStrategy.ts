import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import "dotenv/config";
import Settings from "../models/Settings";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;

passport.serializeUser(function (user: any, done) {
    return done(null, user);
});

passport.deserializeUser(function (user: any, done) {
    return done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
        passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        // console.log("access token", accessToken);
        // console.log('refresh', refreshToken)
        await Settings.collection.drop();
        await new Settings({ refreshToken }).save();
        return done(null, profile);
    }
));




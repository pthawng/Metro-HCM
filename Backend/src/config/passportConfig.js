import 'dotenv/config';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/user.model.js';

/**
 * Passport Configuration
 */

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Check if user exists with same email but different provider
                    if (profile.emails?.[0]?.value) {
                         const userWithEmail = await User.findOne({ email: profile.emails[0].value });
                         if (userWithEmail) {
                             user = userWithEmail;
                             if (!user.googleId) {
                                 user.googleId = profile.id;
                                 await user.save();
                             }
                         }
                    }

                    if (!user) {
                        user = new User({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0]?.value || null,
                            signupType: "google", 
                            role: "user",
                        });
                        await user.save();
                    }
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Serialization logic if needed for sessions
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
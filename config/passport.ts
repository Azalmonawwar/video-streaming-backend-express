// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../db/models/user.model.ts";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({
        provider: "google",
        providerId: profile.id,
      });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          provider: "google",
          providerId: profile.id,
        });
      }

      done(null, user);
    },
  ),
);

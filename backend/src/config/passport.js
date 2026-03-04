const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const config = require("../config");

module.exports = function (passport) {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth not configured - skipping passport initialization");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const googleId = profile.id;
          const name = profile.displayName;

          let user = db.prepare("SELECT * FROM users WHERE google_id = ? OR email = ?").get(googleId, email);

          if (user) {
            if (!user.google_id) {
              db.prepare(
                "UPDATE users SET google_id = ?, is_verified = 1, auth_provider = 'google' WHERE id = ?"
              ).run(googleId, user.id);
              user.google_id = googleId;
              user.is_verified = 1;
              user.auth_provider = 'google';
            }
          } else {
            const result = db.prepare(
              "INSERT INTO users (name, email, password, is_verified, auth_provider, google_id) VALUES (?, ?, NULL, 1, 'google', ?)"
            ).run(name, email, googleId);
            
            user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
          }

          const token = jwt.sign(
            { id: user.id, email: user.email },
            config.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return done(null, { user, token });
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((userObj, done) => {
    done(null, userObj.user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = db.prepare("SELECT id, name, email, is_verified, auth_provider FROM users WHERE id = ?").get(id);
    done(null, user);
  });
};

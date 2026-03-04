const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const config = require("../config");

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/profile", authMiddleware, AuthController.getProfile);

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/signin" }),
    (req, res) => {
      try {
        const { user, token } = req.user;
        console.log("Google OAuth success:", user.email);
        res.redirect(
          `${config.FRONTEND_URL}/auth/google?token=${token}&user=${encodeURIComponent(
            JSON.stringify({ id: user.id, name: user.name, email: user.email })
          )}`
        );
      } catch (error) {
        console.error("Google callback error:", error);
        res.redirect(`${config.FRONTEND_URL}/signin?error=oauth_failed`);
      }
    }
  );
}

module.exports = router;

const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const config = require("./src/config");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const authRoutes = require("./src/routes/authRoutes");

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  require("./src/config/passport")(passport);
}

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  app.use(passport.initialize());
}

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API", version: "1.0" });
});

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${config.FRONTEND_URL}/signin?error=auth_failed` }),
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

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_PATH: process.env.DB_PATH || "./ecommerce.db",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

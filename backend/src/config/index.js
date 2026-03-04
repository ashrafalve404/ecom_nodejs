require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_PATH: process.env.DB_PATH || "./ecommerce.db",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
};

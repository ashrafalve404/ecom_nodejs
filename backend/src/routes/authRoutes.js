const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/profile", authMiddleware, AuthController.getProfile);

module.exports = router;

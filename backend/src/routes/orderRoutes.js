const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, OrderController.getAll);
router.get("/stats", authMiddleware, OrderController.getStats);
router.get("/:id", authMiddleware, OrderController.getById);
router.post("/", authMiddleware, OrderController.create);
router.patch("/:id", authMiddleware, OrderController.updateStatus);

module.exports = router;

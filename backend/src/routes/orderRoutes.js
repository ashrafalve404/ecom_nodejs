const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.get("/", OrderController.getAll);
router.get("/stats", OrderController.getStats);
router.get("/:id", OrderController.getById);
router.post("/", OrderController.create);
router.patch("/:id", OrderController.updateStatus);

module.exports = router;

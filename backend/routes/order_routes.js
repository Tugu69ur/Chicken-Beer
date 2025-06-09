import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../controller/orderController.js";

const router = express.Router();

// Route to create a new order
router.post("/", createOrder);

// Route to get all orders for a user
router.get("/:userId", getUserOrders);

// Route to get a specific order by ID
router.get("/order/:id", getOrderById);

export default router;

import express from "express";
import {
  order,
  getOrders,
  deleteOrder,
  updateOrder,
} from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";

const router = express.Router();

router.post("/", order); // Create order (logged-in users)
router.get("/", getOrders); // Get orders (logged-in users)
router.delete("/:id", deleteOrder); // Delete order (logged-in users/admin)
router.patch("/:id", updateOrder); // Update order (status etc.)

export default router;

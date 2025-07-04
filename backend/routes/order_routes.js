import express from "express";
import { order, getOrders, deleteOrder } from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";

const router = express.Router();

router.post("/", order); // Only logged-in users can order
router.get("/", getOrders); // Only logged-in users can view orders
router.delete("/:id", protect, authorizeRoles("client", "admin"), deleteOrder); // Only client and admin can delete

export default router;

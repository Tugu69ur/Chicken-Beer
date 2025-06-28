import express from "express";
import { order , getOrders , deleteOrder} from "../controller/orderController.js";

const router = express.Router();

router.post("/", order); // POST /api/orders/
router.get("/", getOrders); // GET /api/orders/
router.delete("/:id", deleteOrder);


export default router;

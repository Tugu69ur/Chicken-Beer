// routes/qpayRoutes.js
import express from "express";
import { handleCreateInvoice } from "../controller/qpay_controller.js";

const router = express.Router();

router.post("/create-invoice", handleCreateInvoice);

export default router;

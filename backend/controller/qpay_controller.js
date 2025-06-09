
import { createInvoice } from "../services/qpayservice.js";

export const handleCreateInvoice = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const invoice = await createInvoice({ amount, orderId });
    res.json(invoice);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

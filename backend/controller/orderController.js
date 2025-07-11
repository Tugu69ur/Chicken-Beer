import Order from "../models/orderModel.js";

export const order = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    res
      .status(201)
      .json({ success: true, message: "Order saved successfully" });
  } catch (error) {
    console.error("Order save failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New: Update order (e.g. status)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update fields sent in body (we expect at least `status` from frontend)
    Object.keys(req.body).forEach((key) => {
      order[key] = req.body[key];
    });

    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: String,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema({
  note: String,
  extraPhone: String,
  paymentMethod: String,
  personType: String,
  address: String,
  orders: [orderItemSchema],
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Bandi", orderSchema);

export default Order;

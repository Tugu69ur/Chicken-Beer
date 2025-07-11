import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    phone: String,
    entranceOrCompany: String,
    code: String,
    door: String,
    note: String,
    extraPhone: String,
    paymentMethod: String,
    personType: String,
    address: String,
    orders: Array,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "cooking", "delivering", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

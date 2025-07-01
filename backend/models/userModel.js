
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "client"],
    default: "user",
  },
  branch: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Fix for dev environments (e.g., Next.js, Vite + hot reload)
delete mongoose.connection.models['User'];
const User = mongoose.model("User", userSchema);

export default User;

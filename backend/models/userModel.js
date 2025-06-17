import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "client"],
    default: "user", // <-- default role
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Force model overwrite in dev
export default mongoose.models?.User
  ? mongoose.model("User")
  : mongoose.model("User", userSchema);

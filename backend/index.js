import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import registerRoutes from "./routes/register_routes.js";
import loginRoutes from "./routes/login_routes.js";
import menuRoutes from "./routes/menu_routes.js";
import qpayRoutes from "./routes/qpay_routes.js";
import otpRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/order_routes.js";
import branchRoutes from "./routes/branch_routes.js";
import bandiRoutes from "./routes/bandi_routes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 7000;
const app = express();

// Body parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// CORS
app.use(cors({ origin: "*" }));

// API routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/qpay", qpayRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/orderss", bandiRoutes);
app.use("/api/users", userRoutes);

// Serve React frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch all other routes and return React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

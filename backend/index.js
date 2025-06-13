import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import registerRoutes from "./routes/register_routes.js";
import loginRoutes from "./routes/login_routes.js";
import menuRoutes from "./routes/menu_routes.js";
import orderRoutes from "./routes/order_routes.js";
import qpayRoutes from "./routes/qpay_routes.js";
import otpRoutes from "./routes/authRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 7000;
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// API routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/qpay", qpayRoutes);
app.use("/api/otp", otpRoutes);

// Serve React frontend (production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import registerRoutes from "./routes/register_routes.js";
import loginRoutes from "./routes/login_routes.js";
import menuRoutes from "./routes/menu_routes.js";
import orderRoutes from "./routes/order_routes.js";
import qpayRoutes from "./routes/qpay_routes.js";
import cors from "cors";

dotenv.config();

connectDB();
const PORT = process.env.PORT || 7000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/qpay", qpayRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

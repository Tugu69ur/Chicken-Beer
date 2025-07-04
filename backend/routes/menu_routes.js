import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

import { getMenu } from "../controller/menu_controller.js";

router.route("/").get(getMenu);

export default router;

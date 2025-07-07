import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

import { getMenu , addMenu, deleteMenu, updateMenu} from "../controller/menu_controller.js";

router.route("/").get(getMenu);
router.route("/").post(addMenu);
router.route("/:id").delete(deleteMenu);

export default router;

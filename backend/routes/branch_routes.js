import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controller/branch_contoller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";

const router = express.Router();

router.post("/", createBranch);

router.get("/", getAllBranches);

router.get("/:id", getBranchById);

router.put("/:id", protect, authorizeRoles("admin", "client"), updateBranch);

router.delete("/:id", deleteBranch);

export default router;

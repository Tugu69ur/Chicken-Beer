import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from '../controller/userController.js';

const router = express.Router();

// ✅ Create a new user
router.post('/', createUser);

// ✅ Get all users
router.get('/', getAllUsers);

// ✅ Get user by ID
router.get('/:id', getUserById);

// ✅ Update user
router.put('/:id', updateUser);

// ✅ Delete user
router.delete('/:id', deleteUser);

export default router;

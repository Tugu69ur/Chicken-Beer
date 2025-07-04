import express from 'express';
import { createBandi, getAllBandis, getBandiById, updateBandi, deleteBandi } from '../controller/bandi_controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRole.js';

const router = express.Router();

// Create a new bandi
router.post('/', createBandi);

// Get all bandis
router.get('/', getAllBandis);

// Get a bandi by ID
router.get('/:id', getBandiById);

// Update a bandi
router.put('/:id', protect, authorizeRoles("admin","client"), updateBandi);

// Delete a bandi
router.delete('/:id', protect, authorizeRoles("admin","client"), deleteBandi);

export default router;

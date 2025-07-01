import express from 'express';
import { createBandi, getAllBandis, getBandiById, updateBandi, deleteBandi } from '../controller/bandi_controller.js';

const router = express.Router();

// Create a new bandi
router.post('/', createBandi);

// Get all bandis
router.get('/', getAllBandis);

// Get a bandi by ID
router.get('/:id', getBandiById);

// Update a bandi
router.put('/:id', updateBandi);

// Delete a bandi
router.delete('/:id', deleteBandi);

export default router;

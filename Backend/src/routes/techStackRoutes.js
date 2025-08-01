import express from 'express';
import { getTechStacks, createTechStack, updateTechStack, deleteTechStack } from '../controllers/techStackController.js';
import authMiddleware from '../middleware/auth.js'; // Assuming authMiddleware is needed for some routes

const router = express.Router();

router.get('/', getTechStacks);
router.post('/', authMiddleware, createTechStack);
router.put('/:id', authMiddleware, updateTechStack);
router.delete('/:id', authMiddleware, deleteTechStack);

export default router;
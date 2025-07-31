import express from 'express';
import { getTechStacks, createTechStack, updateTechStack, deleteTechStack } from '../controllers/techStackController.js';

const router = express.Router();

router.get('/', getTechStacks);
router.post('/', createTechStack);
router.put('/:id', updateTechStack);
router.delete('/:id', deleteTechStack);

export default router;
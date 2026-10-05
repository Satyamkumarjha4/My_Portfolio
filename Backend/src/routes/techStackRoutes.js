import express from 'express';
import c from '../controllers/techStackController.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { publicCache } from '../middleware/cache.js';
import { techStackSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', publicCache, c.list);
router.post('/', authMiddleware, validate(techStackSchema), c.create);
router.put('/:id', authMiddleware, validate(techStackSchema, { partial: true }), c.update);
router.delete('/:id', authMiddleware, c.remove);

export default router;

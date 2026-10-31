import express from 'express';
import c from '../controllers/achievementController.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { publishOnWrite } from '../middleware/publish.js';
import { publicCache } from '../middleware/cache.js';
import { achievementSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', publicCache, c.list);
router.post('/', authMiddleware, publishOnWrite, validate(achievementSchema), c.create);
router.put('/:id', authMiddleware, publishOnWrite, validate(achievementSchema, { partial: true }), c.update);
router.delete('/:id', authMiddleware, publishOnWrite, c.remove);

export default router;

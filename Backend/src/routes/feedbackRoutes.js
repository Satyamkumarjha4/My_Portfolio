import express from 'express';
import c from '../controllers/feedbackController.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { noStore } from '../middleware/cache.js';
import { feedbackLimiter } from '../middleware/rateLimit.js';
import { feedbackSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', authMiddleware, noStore, c.list);
router.post('/', feedbackLimiter, validate(feedbackSchema), c.create);
router.delete('/:id', authMiddleware, c.remove);

export default router;

import express from 'express';
import { getFeedbacks, createFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getFeedbacks);
router.post('/', createFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);

export default router;
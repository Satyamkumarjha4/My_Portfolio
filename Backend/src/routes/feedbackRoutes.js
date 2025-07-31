import express from 'express';
import { getFeedbacks, createFeedback, deleteFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', getFeedbacks);
router.post('/', createFeedback); // Public route
router.delete('/:id', deleteFeedback);

export default router;
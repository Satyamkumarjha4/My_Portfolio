import express from 'express';
import { getTimelineItems, createTimelineItem, updateTimelineItem, deleteTimelineItem } from '../controllers/timelineController.js';
import authMiddleware from '../middleware/auth.js'; // Assuming authMiddleware is needed for some routes

const router = express.Router();

router.get('/', getTimelineItems);
router.post('/', authMiddleware, createTimelineItem);
router.put('/:id', authMiddleware, updateTimelineItem);
router.delete('/:id', authMiddleware, deleteTimelineItem);

export default router;
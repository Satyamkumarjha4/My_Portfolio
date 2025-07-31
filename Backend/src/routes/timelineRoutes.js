import express from 'express';
import { getTimelineItems, createTimelineItem, updateTimelineItem, deleteTimelineItem } from '../controllers/timelineController.js';

const router = express.Router();

router.get('/', getTimelineItems);
router.post('/', createTimelineItem);
router.put('/:id', updateTimelineItem);
router.delete('/:id', deleteTimelineItem);

export default router;
import express from 'express';
import authMiddleware from '../middleware/auth.js'; // IGNORE
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
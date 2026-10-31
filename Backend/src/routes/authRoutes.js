import express from 'express';
import { login, me } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.get('/me', authMiddleware, me);

export default router;

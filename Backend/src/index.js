import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import techStackRoutes from './routes/techStackRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tech-stacks', techStackRoutes);
app.use('/api/timeline', timelineRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
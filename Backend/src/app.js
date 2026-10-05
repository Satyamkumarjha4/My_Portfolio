import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import projectRoutes from './routes/projectRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import techStackRoutes from './routes/techStackRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import authRoutes from './routes/authRoutes.js';
import prisma from './config/prisma.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Origins come from CORS_ORIGINS (comma separated). Trailing slashes are
// stripped because browsers send the Origin header without one.
const parseOrigins = () =>
  (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

  const allowed = parseOrigins();
  if (process.env.NODE_ENV !== 'production') allowed.push('http://localhost:5173');

  app.use(helmet());
  app.use(
    cors({
      origin: allowed,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '20kb' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/tech-stacks', techStackRoutes);
  app.use('/api/timeline', timelineRoutes);

  // Liveness + DB readiness with a hard timeout so probes never hang.
  app.get('/health', async (req, res) => {
    const started = Date.now();
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('db timeout')), 3000).unref()),
      ]);
      res.set('Cache-Control', 'no-store').status(200).json({
        status: 'ok',
        db: 'up',
        dbLatencyMs: Date.now() - started,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date(),
      });
    } catch (err) {
      logger.error({ err }, 'Health check failed');
      res.set('Cache-Control', 'no-store').status(503).json({ status: 'degraded', db: 'down', timestamp: new Date() });
    }
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp();

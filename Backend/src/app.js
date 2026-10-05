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
      allowedHeaders: ['Content-Type', 'Authorization'],
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

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });

  return app;
};

export default createApp();

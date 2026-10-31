import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Central error mapping: clients get a stable, non-revealing message;
// the real error is logged server-side.
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Payload too large' });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found' });
    if (err.code === 'P2002') return res.status(409).json({ error: 'Record already exists' });
    if (err.code === 'P2023') return res.status(400).json({ error: 'Invalid identifier' });
  }

  logger.error({ err, method: req.method, url: req.originalUrl }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
};

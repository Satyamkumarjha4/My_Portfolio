import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
    skip: () => process.env.NODE_ENV === 'test',
  });

export const loginLimiter = make(15 * 60 * 1000, 10, 'Too many login attempts, try again later');
export const feedbackLimiter = make(60 * 60 * 1000, 5, 'Too many submissions, try again later');

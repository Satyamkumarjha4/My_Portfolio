import { scheduleDeploy } from '../utils/deployHook.js';

// After a successful (2xx) content write, schedule a frontend rebuild.
export const publishOnWrite = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) scheduleDeploy();
  });
  next();
};

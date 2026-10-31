import jwt from 'jsonwebtoken';

export const TOKEN_TTL_SECONDS = 60 * 60 * 2;

export const signAdminToken = () =>
  jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_TTL_SECONDS,
  });

const authMiddleware = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (payload.role !== 'admin') throw new Error('bad role');
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;

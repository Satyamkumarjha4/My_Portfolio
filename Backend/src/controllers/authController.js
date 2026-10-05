import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { signAdminToken, TOKEN_TTL_SECONDS } from '../middleware/auth.js';

// Constant-time string comparison that tolerates different lengths.
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

export const login = async (req, res) => {
  const { id, password } = req.body ?? {};
  const { ADMIN_ID, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

  if (!ADMIN_ID || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (typeof id !== 'string' || typeof password !== 'string' || password.length > 200) {
    return res.status(400).json({ error: 'ID and password are required' });
  }

  const idOk = safeEqual(id, ADMIN_ID);
  const passOk = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!idOk || !passOk) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.status(200).json({ token: signAdminToken(), expiresIn: TOKEN_TTL_SECONDS });
};

export const me = (req, res) => {
  res.status(200).json({ ok: true });
};

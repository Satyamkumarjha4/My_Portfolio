const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization?.split('Bearer ')[1];
  const adminToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  if (!authToken || authToken !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

export default authMiddleware;
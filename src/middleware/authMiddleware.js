import jwt from 'jsonwebtoken';

export function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization?.trim();

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Accept both "Bearer <token>" and raw "<token>" to avoid client-format issues.
  let token = authHeader;
  if (/^Bearer\s+/i.test(authHeader)) {
    token = authHeader.replace(/^Bearer\s+/i, '').trim();
  }
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = user;
    next();
  })
}

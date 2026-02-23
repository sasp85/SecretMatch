export function requireAdmin (req, res, next) {
  if (req.user.id !== 1) {
    return res.status(403).send('Admin access only');
  }

  next();
}
/**
 * middleware/auth.js
 * Authentication middleware that verifies JWT tokens.
 *
 * Usage: Apply to any route that requires a logged-in user.
 * The client must send: Authorization: Bearer <token>
 *
 * On success: sets req.user = { id, email } and calls next().
 * On failure: returns 401 Unauthorized.
 */

import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  // 1. Extract the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access denied. No token provided.',
    });
  }

  // 2. Pull out the token after "Bearer "
  const token = authHeader.split(' ')[1];

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to the request for downstream use
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token.',
    });
  }
}

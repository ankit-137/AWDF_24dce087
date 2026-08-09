/**
 * middleware/contentType.js
 * Rejects POST and PUT requests that do not carry a
 * Content-Type: application/json header.
 */

export function requireJson(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type: Content-Type must be application/json',
      });
    }
  }
  next();
}

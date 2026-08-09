/**
 * middleware/logger.js
 * Logs the HTTP method, URL, and timestamp for every incoming request.
 */

export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

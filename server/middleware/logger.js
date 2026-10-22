/**
 * middleware/logger.js
 * Logs the HTTP method, URL, status code, and response time for every request.
 * Also echoes the X-Cache header (HIT / MISS) when present, making it easy
 * to verify caching behaviour directly from the server console.
 *
 * Output format:
 *   [ISO timestamp] METHOD /path  →  STATUS  Xms  [CACHE: HIT|MISS]
 */

export function requestLogger(req, res, next) {
  const start = Date.now();

  // Hook into the 'finish' event so we can log AFTER the response is sent
  // (and therefore know the status code and can read response headers).
  res.on('finish', () => {
    const duration  = Date.now() - start;
    const timestamp = new Date().toISOString();
    const xCache    = res.getHeader('X-Cache');
    const cacheTag  = xCache ? `  [CACHE: ${xCache}]` : '';

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl}  →  ${res.statusCode}  ${duration}ms${cacheTag}`
    );
  });

  next();
}

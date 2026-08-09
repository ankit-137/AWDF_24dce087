/**
 * middleware/errorHandler.js
 * Global error-handling middleware — must be registered LAST in the pipeline.
 * Express recognises it as an error handler because it declares 4 parameters (err, req, res, next).
 */

export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}

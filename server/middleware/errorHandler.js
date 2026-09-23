/**
 * middleware/errorHandler.js
 * Global error-handling middleware — must be registered LAST in the pipeline.
 * Express recognises it as an error handler because it declares 4 parameters (err, req, res, next).
 *
 * Handles:
 *  - Mongoose ValidationError  → 400 with structured field-level errors
 *  - Mongoose CastError        → 400 (invalid ObjectId)
 *  - General errors            → uses err.status or defaults to 500
 */

export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  // ── Mongoose Validation Error ──────────────────────────────────────────────
  // Thrown when a document fails schema validation (e.g. missing required field)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  // ── Mongoose CastError ─────────────────────────────────────────────────────
  // Thrown when an invalid value is cast to a schema type (e.g. bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid value for field "${err.path}": ${err.value}`,
    });
  }

  // ── Generic Error ──────────────────────────────────────────────────────────
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}

/**
 * middleware/validateId.js
 * Route-specific middleware that validates the :id parameter before
 * the request reaches the controller.
 * Rules: must be a positive integer.
 */

export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: `Invalid task ID "${req.params.id}". ID must be a positive integer.`,
    });
  }
  // Attach the parsed number so controllers don't have to re-convert.
  req.taskId = id;
  next();
}

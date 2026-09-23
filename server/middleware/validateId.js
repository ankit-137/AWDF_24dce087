/**
 * middleware/validateId.js
 * Route-specific middleware that validates the :id parameter before
 * the request reaches the controller.
 * Rules: must be a valid MongoDB ObjectId (24-character hex string).
 */

import mongoose from 'mongoose';

export function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: `Invalid task ID "${req.params.id}". ID must be a valid MongoDB ObjectId.`,
    });
  }
  // Attach the id so controllers don't have to re-read req.params
  req.taskId = req.params.id;
  next();
}

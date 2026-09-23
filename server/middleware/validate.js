/**
 * middleware/validate.js
 * Server-side input validation middleware.
 *
 * Validates request bodies BEFORE they reach the database layer,
 * so malformed requests are rejected early with clear error messages.
 */

// ── Validate task input for POST (create) ───────────────────────────────────
export function validateTaskCreate(req, res, next) {
  const { title } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
  }

  // completed must be a boolean if provided
  if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean value.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

// ── Validate task input for PUT (update) ────────────────────────────────────
export function validateTaskUpdate(req, res, next) {
  const { title, completed } = req.body;
  const errors = [];

  // title is optional on update, but if provided it must be valid
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push({ field: 'title', message: 'Title must be a non-empty string.' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean value.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

// ── Validate registration input ─────────────────────────────────────────────
export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({ field: 'email', message: 'A valid email is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

// ── Validate login input ────────────────────────────────────────────────────
export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required.' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

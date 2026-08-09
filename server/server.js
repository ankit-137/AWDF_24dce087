/**
 * server.js — Entry point for the Task Management API
 *
 * Middleware pipeline order (important):
 *   1. requestLogger   — logs every request
 *   2. express.json()  — parses JSON bodies
 *   3. requireJson     — rejects POST/PUT without Content-Type: application/json
 *   4. /api/tasks      — task CRUD routes
 *   5. 404 catch-all   — for unmatched routes
 *   6. errorHandler    — global error handler (MUST be last)
 */

import express from 'express';
import { requestLogger } from './middleware/logger.js';
import { requireJson } from './middleware/contentType.js';
import { errorHandler } from './middleware/errorHandler.js';
import taskRoutes from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── 1. Request logging ─────────────────────────────────────────
app.use(requestLogger);

// ── 2. Parse JSON request bodies ───────────────────────────────
app.use(express.json());

// ── 3. Content-Type guard for POST / PUT ───────────────────────
app.use(requireJson);

// ── 4. API routes ──────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// ── 5. 404 — no route matched ──────────────────────────────────
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// ── 6. Global error handler (must be last) ─────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Management API running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/tasks');
  console.log('  GET    /api/tasks/:id');
  console.log('  POST   /api/tasks');
  console.log('  PUT    /api/tasks/:id');
  console.log('  DELETE /api/tasks/:id');
});

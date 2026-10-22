/**
 * routes/tasks.js
 * CRUD routes for the Task Management API.
 *
 * All routes are protected by the authenticate middleware (JWT required).
 * Server-side validation runs BEFORE hitting the database.
 * Each task is scoped to the authenticated user (req.user.id).
 *
 * ── In-memory caching (node-cache) ────────────────────────────────────────────
 * Strategy: Cache-aside (read-through invalidation on writes)
 *
 *   GET /tasks (list)
 *     Cache key : "tasks:<userId>"
 *     Cache HIT : return cached array immediately, skip MongoDB query.
 *     Cache MISS: query MongoDB → store result in cache → return data.
 *     TTL       : 60 seconds (configured in config/cache.js)
 *
 *   POST / PUT / DELETE
 *     After a successful write to MongoDB, delete the user's cache key so
 *     the next GET /tasks always reflects the latest data (no stale reads).
 *
 * Response headers added for observability:
 *   X-Cache : "HIT"  — data served from cache
 *   X-Cache : "MISS" — data served from MongoDB (and now cached)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import { validateId } from '../middleware/validateId.js';
import { authenticate } from '../middleware/auth.js';
import { validateTaskCreate, validateTaskUpdate } from '../middleware/validate.js';
import Task from '../models/Task.js';
import cache, { taskListKey } from '../config/cache.js';

const router = Router();

// ── Protect ALL task routes ─────────────────────────────────────────────────
router.use(authenticate);

// ── GET /tasks  → return all tasks for the logged-in user (200) ────────────
router.get('/', async (req, res, next) => {
  try {
    const cacheKey = taskListKey(req.user.id);
    const cached   = cache.get(cacheKey);

    if (cached !== undefined) {
      // ── Cache HIT ──────────────────────────────────────────────────────────
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    // ── Cache MISS: query MongoDB, then store result ────────────────────────
    const tasks = await Task.find({ user: req.user.id }).lean();
    cache.set(cacheKey, tasks);   // stored with the 60 s TTL from config

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// ── GET /tasks/:id  → return one task (200 | 400 | 404) ───────────────────
// No caching for single-task lookups — they are infrequent and require
// fine-grained invalidation that adds complexity without measurable benefit.
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.taskId, user: req.user.id });
    if (!task) {
      const err = new Error(`Task with id ${req.taskId} not found.`);
      err.status = 404;
      return next(err);
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── POST /tasks  → create a task (201 | 400) ───────────────────────────────
router.post('/', validateTaskCreate, async (req, res, next) => {
  try {
    const { title, description, completed, createdAt } = req.body;

    const task = new Task({
      title,
      description,
      completed,
      createdAt,
      user: req.user.id, // associate task with authenticated user
    });
    const saved = await task.save();

    // ── Invalidate cache so next GET /tasks fetches fresh data ──────────────
    cache.del(taskListKey(req.user.id));

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// ── PUT /tasks/:id  → update a task (200 | 400 | 404) ─────────────────────
router.put('/:id', validateId, validateTaskUpdate, async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const updated = await Task.findOneAndUpdate(
      { _id: req.taskId, user: req.user.id },
      { title, description, completed },
      { new: true, runValidators: true }
    );

    if (!updated) {
      const err = new Error(`Task with id ${req.taskId} not found.`);
      err.status = 404;
      return next(err);
    }

    // ── Invalidate cache ────────────────────────────────────────────────────
    cache.del(taskListKey(req.user.id));

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /tasks/:id  → remove a task (200 | 404) ────────────────────────
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.taskId, user: req.user.id });
    if (!deleted) {
      const err = new Error(`Task with id ${req.taskId} not found.`);
      err.status = 404;
      return next(err);
    }

    // ── Invalidate cache ────────────────────────────────────────────────────
    cache.del(taskListKey(req.user.id));

    res.status(200).json({ message: 'Task deleted successfully.', task: deleted });
  } catch (err) {
    next(err);
  }
});

export default router;

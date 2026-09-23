/**
 * routes/tasks.js
 * CRUD routes for the Task Management API.
 *
 * All routes are protected by the authenticate middleware (JWT required).
 * Server-side validation runs BEFORE hitting the database.
 * Each task is scoped to the authenticated user (req.user.id).
 */

import { Router } from 'express';
import { validateId } from '../middleware/validateId.js';
import { authenticate } from '../middleware/auth.js';
import { validateTaskCreate, validateTaskUpdate } from '../middleware/validate.js';
import Task from '../models/Task.js';

const router = Router();

// ── Protect ALL task routes ─────────────────────────────────────────────────
router.use(authenticate);

// ── GET /tasks  → return all tasks for the logged-in user (200) ────────────
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// ── GET /tasks/:id  → return one task (200 | 400 | 404) ───────────────────
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
    res.status(200).json({ message: 'Task deleted successfully.', task: deleted });
  } catch (err) {
    next(err);
  }
});

export default router;

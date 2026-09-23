/**
 * routes/tasks.js
 * CRUD routes for the Task Management API.
 *
 * Uses Mongoose model (Task) backed by MongoDB.
 * Each task: { title, description, completed, createdAt }
 */

import { Router } from 'express';
import { validateId } from '../middleware/validateId.js';
import Task from '../models/Task.js';

const router = Router();

// ── GET /tasks  → return all tasks (200) ───────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// ── GET /tasks/:id  → return one task (200 | 400 | 404) ───────────────────
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.taskId);
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
router.post('/', async (req, res, next) => {
  try {
    const { title, description, completed, createdAt } = req.body;

    const task = new Task({ title, description, completed, createdAt });
    // .save() triggers Mongoose schema validation automatically
    const saved = await task.save();

    res.status(201).json(saved);
  } catch (err) {
    next(err); // Mongoose ValidationError is caught by errorHandler
  }
});

// ── PUT /tasks/:id  → update a task (200 | 400 | 404) ─────────────────────
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    // runValidators: true ensures Mongoose schema rules are checked on update
    const updated = await Task.findByIdAndUpdate(
      req.taskId,
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
    const deleted = await Task.findByIdAndDelete(req.taskId);
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

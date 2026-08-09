/**
 * routes/tasks.js
 * CRUD routes for the Task Management API.
 *
 * In-memory store (no database):
 *   Each task: { id, title, description, status }
 *   status values: 'pending' | 'in-progress' | 'done'
 */

import { Router } from 'express';
import { validateId } from '../middleware/validateId.js';

const router = Router();

// ── In-memory data store ───────────────────────────────────────
let tasks = [];
let nextId = 1;

const VALID_STATUSES = ['pending', 'in-progress', 'done'];

// ── GET /tasks  → return all tasks (200) ───────────────────────
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

// ── GET /tasks/:id  → return one task (200 | 404) ─────────────
router.get('/:id', validateId, (req, res, next) => {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    const err = new Error(`Task with id ${req.taskId} not found.`);
    err.status = 404;
    return next(err);
  }
  res.status(200).json(task);
});

// ── POST /tasks  → create a task (201 | 400) ──────────────────
router.post('/', (req, res, next) => {
  const { title, description = '', status = 'pending' } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    const err = new Error('Field "title" is required and must be a non-empty string.');
    err.status = 400;
    return next(err);
  }

  if (!VALID_STATUSES.includes(status)) {
    const err = new Error(`Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}.`);
    err.status = 400;
    return next(err);
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: String(description).trim(),
    status,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ── PUT /tasks/:id  → update a task (200 | 400 | 404) ─────────
router.put('/:id', validateId, (req, res, next) => {
  const index = tasks.findIndex((t) => t.id === req.taskId);
  if (index === -1) {
    const err = new Error(`Task with id ${req.taskId} not found.`);
    err.status = 404;
    return next(err);
  }

  const { title, description, status } = req.body;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    const err = new Error(`Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}.`);
    err.status = 400;
    return next(err);
  }

  // Apply only the fields provided in the request body
  const updatedTask = {
    ...tasks[index],
    ...(title !== undefined && { title: String(title).trim() }),
    ...(description !== undefined && { description: String(description).trim() }),
    ...(status !== undefined && { status }),
  };

  tasks[index] = updatedTask;
  res.status(200).json(updatedTask);
});

// ── DELETE /tasks/:id  → remove a task (200 | 404) ────────────
router.delete('/:id', validateId, (req, res, next) => {
  const index = tasks.findIndex((t) => t.id === req.taskId);
  if (index === -1) {
    const err = new Error(`Task with id ${req.taskId} not found.`);
    err.status = 404;
    return next(err);
  }

  const [deleted] = tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted successfully.', task: deleted });
});

export default router;

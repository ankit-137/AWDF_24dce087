/**
 * events/taskEmitter.js
 * Singleton EventEmitter instance shared across the entire server process.
 *
 * Importing this module from multiple files always returns the SAME instance
 * because Node.js caches module exports — so emitters and listeners are
 * always in sync without any extra plumbing.
 *
 * Events emitted:
 *   'task-created'  { taskId, title, userId, userEmail, createdAt }
 */

import { EventEmitter } from 'events';

const taskEmitter = new EventEmitter();

// Safety guard: warn if more than 10 listeners are added to the same event
// (default Node.js threshold is 10; we keep it at 10 but make the intent clear)
taskEmitter.setMaxListeners(10);

export default taskEmitter;

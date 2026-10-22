/**
 * events/taskHandlers.js
 * Registers all listeners on the shared taskEmitter.
 *
 * Call registerTaskHandlers() ONCE at server startup (in server.js).
 *
 * ── Why setImmediate? ─────────────────────────────────────────────────────────
 * setImmediate() defers execution to the next iteration of the Node.js event
 * loop (the "check" phase), AFTER any I/O events and AFTER the current
 * call stack is cleared.
 *
 * Timeline visible in the console:
 *
 *   [T+0ms]  POST /api/tasks handler runs
 *   [T+1ms]  task saved to MongoDB
 *   [T+2ms]  emit('task-created') is called   ← triggers the handler schedule
 *   [T+2ms]  res.status(201).json(saved)       ← API responds to client NOW
 *   [T+3ms]  setImmediate callback fires       ← handler logs (AFTER response)
 *
 * This demonstrates that the response is sent BEFORE the event handler runs,
 * i.e. the heavy notification work does not delay the client.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import taskEmitter from './taskEmitter.js';

/**
 * Handler for the 'task-created' event.
 *
 * Payload: { taskId, title, userId, userEmail, createdAt }
 *
 * Wrapped in setImmediate so the HTTP response is dispatched first,
 * then this handler runs in the next event-loop iteration.
 */
function onTaskCreated(payload) {
  setImmediate(() => {
    const handlerTimestamp = new Date().toISOString();

    console.log('');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│             📋  TASK NOTIFICATION  [ASYNC]              │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log(`│  Event     : task-created`);
    console.log(`│  Task ID   : ${payload.taskId}`);
    console.log(`│  Title     : ${payload.title}`);
    console.log(`│  User ID   : ${payload.userId}`);
    console.log(`│  User Email: ${payload.userEmail ?? 'N/A'}`);
    console.log(`│  Task Time : ${payload.createdAt}`);
    console.log(`│  Log Time  : ${handlerTimestamp}   ← fired AFTER response`);
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('');
  });
}

/**
 * registerTaskHandlers()
 * Attach all event listeners to the shared emitter.
 * Must be called exactly once, before the Express server starts.
 */
export function registerTaskHandlers() {
  taskEmitter.on('task-created', onTaskCreated);

  console.log('[EventEmitter] Task event handlers registered.');
}

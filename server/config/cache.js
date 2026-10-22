/**
 * config/cache.js
 * Singleton node-cache instance shared across the entire server process.
 *
 * Configuration:
 *  - stdTTL  : 60 s  — cached values expire automatically after 60 seconds.
 *  - checkperiod : 90 s — background sweep that purges expired keys every 90 s.
 *  - useClones   : false — skip deep-clone on get/set for better performance
 *                  (safe here because we never mutate cached objects in-place).
 *
 * Cache key convention:
 *  "tasks:<userId>"  →  array of task documents for that user
 *
 * Import this module wherever you need cache access:
 *   import cache from '../config/cache.js';
 */

import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 60,        // 60-second TTL on every key
  checkperiod: 90,   // sweep for expired keys every 90 s
  useClones: false,  // skip deep-cloning; slight perf win
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Build a per-user cache key for the task list.
 * @param {string} userId  - MongoDB ObjectId string from req.user.id
 * @returns {string}       - e.g. "tasks:64ab12cd..."
 */
export function taskListKey(userId) {
  return `tasks:${userId}`;
}

export default cache;

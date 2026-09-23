/**
 * src/api/tasks.js
 * Centralized API layer — all fetch calls to the backend live here.
 * Every function returns the parsed JSON on success and throws on failure.
 */

const BASE = '/api/tasks';

// Helper: parse response, throw structured error on non-2xx
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    // Use backend's error message if available
    const message =
      data?.details?.[0]?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// GET /api/tasks
export async function fetchTasks() {
  const res = await fetch(BASE);
  return handleResponse(res);
}

// POST /api/tasks
export async function createTask(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

// PUT /api/tasks/:id
export async function updateTask(id, body) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

// DELETE /api/tasks/:id
export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

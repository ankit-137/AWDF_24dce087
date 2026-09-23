/**
 * src/api/auth.js
 * Centralized API layer for authentication endpoints.
 */

const BASE = '/api/auth';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message =
      data?.details?.[0]?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// POST /api/auth/register
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

// POST /api/auth/login
export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

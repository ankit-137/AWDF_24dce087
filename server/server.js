import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/logger.js';
import { requireJson } from './middleware/contentType.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { registerTaskHandlers } from './events/taskHandlers.js';

// ── Connect to MongoDB before starting the server ──────────────────────────
await connectDB();

// ── Register EventEmitter listeners before any requests arrive ─────────────
registerTaskHandlers();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow any localhost port (Vite may switch from 5173 to 5174, etc.)
app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));

app.use(requestLogger);

app.use(express.json());
//for only accepting JSON responses
app.use(requireJson);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);     // Public: register, login
app.use('/api/tasks', taskRoutes);    // Protected: requires JWT


app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Management API running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/tasks          (protected)');
  console.log('  GET    /api/tasks/:id      (protected)');
  console.log('  POST   /api/tasks          (protected)');
  console.log('  PUT    /api/tasks/:id      (protected)');
  console.log('  DELETE /api/tasks/:id      (protected)');
});

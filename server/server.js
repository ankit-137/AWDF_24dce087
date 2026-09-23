import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/logger.js';
import { requireJson } from './middleware/contentType.js';
import { errorHandler } from './middleware/errorHandler.js';
import taskRoutes from './routes/tasks.js';

// ── Connect to MongoDB before starting the server ──────────────────────────
await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from the React dev server
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(requestLogger);

app.use(express.json());
//for only accepting JSON responses
app.use(requireJson);

app.use('/api/tasks', taskRoutes);


app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Management API running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/tasks');
  console.log('  GET    /api/tasks/:id');
  console.log('  POST   /api/tasks');
  console.log('  PUT    /api/tasks/:id');
  console.log('  DELETE /api/tasks/:id');
});

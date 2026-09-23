/**
 * config/db.js
 * Establishes and exports the Mongoose connection to MongoDB.
 * Call connectDB() once at server startup.
 */

import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit with failure if DB connection fails
  }
}

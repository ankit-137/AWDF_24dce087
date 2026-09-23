/**
 * models/Task.js
 * Mongoose schema and model for the Task resource.
 *
 * Fields:
 *   title       – String, required
 *   description – String, optional (default: '')
 *   completed   – Boolean, default false
 *   createdAt   – Date, default Date.now
 *   user        – ObjectId, ref to User (set by auth middleware)
 */

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Field "title" is required and must be a non-empty string.'],
    trim: true,
    minlength: [1, 'Title cannot be empty.'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

/**
 * models/User.js
 * Mongoose schema and model for the User resource.
 *
 * Features:
 *   - Email must be unique and is stored lowercase + trimmed
 *   - Password is hashed using bcrypt before saving
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ── Pre-save hook: hash the password before saving ─────────────────────────
userSchema.pre('save', async function () {
  // Only hash if the password field was modified (or is new)
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// ── Instance method: compare a candidate password with the stored hash ─────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

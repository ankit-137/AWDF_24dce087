/**
 * routes/auth.js
 * Authentication routes: register and login.
 *
 * POST /api/auth/register  → create a new user (201)
 * POST /api/auth/login     → authenticate and return JWT (200)
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = Router();

// ── Helper: generate a signed JWT ──────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// ── POST /auth/register ────────────────────────────────────────────────────
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    // Create and save user (password is hashed by the pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/login ───────────────────────────────────────────────────────
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

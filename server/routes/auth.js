const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// ─── Helper: generate JWT ───────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user.UserID, email: user.Email, role: user.Role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── POST /api/auth/register ────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'firstName, lastName, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate email
    const [existing] = await pool.query('SELECT UserID FROM User WHERE Email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash password with bcrypt (12 salt rounds)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const normalizedRequestedRole = role === 'teacher' ? 'instructor' : role;
    const validRole = ['admin', 'instructor', 'student'].includes(normalizedRequestedRole) ? normalizedRequestedRole : 'student';
    const [result] = await pool.query(
      `INSERT INTO User (FirstName, LastName, Email, PasswordHash, Role, Department)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, passwordHash, validRole, department || null]
    );

    // Build user payload (maps instructor -> teacher for frontend compatibility)
    const frontendRole = validRole === 'instructor' ? 'teacher' : validRole;
    const user = {
      id: result.insertId,
      name: `${firstName} ${lastName}`,
      email,
      role: frontendRole,
      dbRole: validRole,
      department: department || null,
    };

    // Issue JWT
    const token = signToken({ UserID: result.insertId, Email: email, Role: validRole });

    res.status(201).json({ message: 'Registration successful.', token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Look up user
    const [rows] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Issue JWT
    const token = signToken(user);
    const frontendRole = user.Role === 'instructor' ? 'teacher' : user.Role;

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.UserID,
        name: `${user.FirstName} ${user.LastName}`,
        email: user.Email,
        role: frontendRole,
        dbRole: user.Role,
        department: user.Department,
        bio: user.Bio,
        avatar: user.AvatarURL,
        studentId: user.StudentID,
        batch: user.Batch,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ─── GET /api/auth/me  (verify token & return profile) ──────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM User WHERE UserID = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const u = rows[0];
    const frontendRole = u.Role === 'instructor' ? 'teacher' : u.Role;
    res.json({
      id: u.UserID,
      name: `${u.FirstName} ${u.LastName}`,
      email: u.Email,
      role: frontendRole,
      dbRole: u.Role,
      department: u.Department,
      bio: u.Bio,
      avatar: u.AvatarURL,
      studentId: u.StudentID,
      batch: u.Batch,
    });
  } catch (err) {
    console.error('Auth/me error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ─── Verify DB pool starts ─────────────────────────────────
require('./config/db');

// ─── Import route modules ──────────────────────────────────
const authRoutes          = require('./routes/auth');
const courseRoutes        = require('./routes/courses');
const assignmentRoutes    = require('./routes/assignments');
const timetableRoutes     = require('./routes/timetable');
const notificationRoutes  = require('./routes/notifications');
const userRoutes          = require('./routes/users');

// ─── Express app ────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// ─── Health check (public) ──────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Public auth routes (login / register) ──────────────────
app.use('/api/auth', authRoutes);


// ─── Protected API routes ───────────────────────────────────
app.use('/api/courses',       courseRoutes);
app.use('/api/assignments',   assignmentRoutes);
app.use('/api/timetable',     timetableRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users',         userRoutes);

// ─── Legacy compat: /api/login redirects to new auth ────────
app.post('/api/login', (req, res) => {
  // Forward to the new auth login route so old frontend calls still work
  res.redirect(307, '/api/auth/login');
});

// ─── 404 fallback ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
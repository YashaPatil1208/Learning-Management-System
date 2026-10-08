const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

router.use(authMiddleware);

// ─── GET /api/users — list users (admin/instructor) ─────────
router.get('/', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const roleFilter = req.query.role;
    let sql = `SELECT UserID, FirstName, LastName, Email, Role, Department,
                      StudentID, Batch, Semester, GPA, EmployeeID, Designation,
                      AvatarURL, CreatedAt
               FROM User`;
    const params = [];

    if (roleFilter) {
      sql += ' WHERE Role = ?';
      params.push(roleFilter);
    }
    sql += ' ORDER BY LastName, FirstName';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// ─── GET /api/users/students — all students (for teacher views) ─
router.get('/students', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT UserID AS id, UserID,
             FirstName, LastName,
             CONCAT(FirstName, ' ', LastName) AS name,
             Email AS email, Email,
             StudentID AS studentId, StudentID,
             Batch AS batch, Batch,
             Semester AS semester, Semester,
             GPA AS gpa, GPA,
             AvatarURL AS avatar, AvatarURL
      FROM User
      WHERE Role = 'student'
      ORDER BY LastName, FirstName
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /users/students error:', err);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
});

// ─── GET /api/users/profile — own profile ───────────────────
router.get('/profile', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT UserID, FirstName, LastName, Email, Role, Department,
              Phone, Bio, AvatarURL, Github, LinkedIn,
              StudentID, Batch, Semester, GPA, EmployeeID, Designation, CreatedAt
       FROM User WHERE UserID = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /users/profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// ─── PUT /api/users/profile — update own profile ────────────
router.put('/profile', async (req, res) => {
  try {
    const { phone, bio, github, linkedin } = req.body;
    await pool.query(
      `UPDATE User SET Phone = ?, Bio = ?, Github = ?, LinkedIn = ? WHERE UserID = ?`,
      [phone || null, bio || null, github || null, linkedin || null, req.user.id]
    );
    res.json({ message: 'Profile updated.' });
  } catch (err) {
    console.error('PUT /users/profile error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;

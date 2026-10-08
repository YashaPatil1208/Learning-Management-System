const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// All course routes require authentication
router.use(authMiddleware);

// ─── GET /api/courses — list all courses ────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*,
             c.CourseID AS id,
             c.Code AS code,
             c.Name AS name,
             c.Description AS description,
             c.Color AS color,
             c.Batch AS batch,
             c.Credits AS credits,
             c.Semester AS semester,
             c.InstructorID AS teacherId,
             CONCAT(u.FirstName, ' ', u.LastName) AS InstructorName,
             CONCAT(u.FirstName, ' ', u.LastName) AS teacherName
      FROM Course c
      LEFT JOIN User u ON c.InstructorID = u.UserID
      ORDER BY c.Code
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses.' });
  }
});

// ─── GET /api/courses/:id — single course with resources ────
router.get('/:id', async (req, res) => {
  try {
    const [courseRows] = await pool.query(`
      SELECT c.*,
             CONCAT(u.FirstName, ' ', u.LastName) AS InstructorName
      FROM Course c
      LEFT JOIN User u ON c.InstructorID = u.UserID
      WHERE c.CourseID = ?
    `, [req.params.id]);

    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const [resources] = await pool.query(
      'SELECT * FROM Resource WHERE CourseID = ? ORDER BY UploadDate DESC',
      [req.params.id]
    );

    res.json({ ...courseRows[0], resources });
  } catch (err) {
    console.error('GET /courses/:id error:', err);
    res.status(500).json({ message: 'Failed to fetch course.' });
  }
});

// ─── POST /api/courses — create course (instructor/admin) ───
router.post('/', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const { code, name, description, batch, credits, semester, color } = req.body;
    const instructorId = req.user.role === 'instructor' ? req.user.id : (req.body.instructorId || req.user.id);

    const [result] = await pool.query(
      `INSERT INTO Course (Code, Name, Description, InstructorID, Batch, Credits, Semester, Color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, name, description || null, instructorId, batch || null, credits || 3, semester || null, color || 'indigo']
    );

    res.status(201).json({ message: 'Course created.', courseId: result.insertId });
  } catch (err) {
    console.error('POST /courses error:', err);
    res.status(500).json({ message: 'Failed to create course.' });
  }
});

// ─── GET /api/courses/:id/enrollments — enrolled students ───
router.get('/:id/enrollments', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, CONCAT(u.FirstName, ' ', u.LastName) AS StudentName,
             u.Email, u.StudentID AS StudentCode, u.Batch
      FROM Enrollment e
      JOIN User u ON e.StudentID = u.UserID
      WHERE e.CourseID = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error('GET /courses/:id/enrollments error:', err);
    res.status(500).json({ message: 'Failed to fetch enrollments.' });
  }
});

module.exports = router;

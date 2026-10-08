const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

router.use(authMiddleware);

// ─── GET /api/assignments — list assignments ────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*,
             a.AssignmentID AS id,
             a.CourseID AS courseId,
             a.Title AS title,
             a.Description AS description,
             a.DueDate AS dueDate,
             a.MaxMarks AS maxMarks,
             a.Type AS type,
             a.RequiresGithub AS requiresGithub,
             a.Batch AS batch,
             c.Code AS courseCode, c.Code AS CourseCode,
             c.Name AS courseName, c.Name AS CourseName
      FROM Assignment a
      JOIN Course c ON a.CourseID = c.CourseID
      ORDER BY a.DueDate DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /assignments error:', err);
    res.status(500).json({ message: 'Failed to fetch assignments.' });
  }
});

// ─── POST /api/assignments — create (instructor/admin) ──────
router.post('/', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxMarks, type, requiresGithub, batch } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Assignment (CourseID, Title, Description, DueDate, MaxMarks, Type, RequiresGithub, Batch)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [courseId, title, description, dueDate, maxMarks || 100, type || 'document', requiresGithub || false, batch || null]
    );
    res.status(201).json({ message: 'Assignment created.', assignmentId: result.insertId });
  } catch (err) {
    console.error('POST /assignments error:', err);
    res.status(500).json({ message: 'Failed to create assignment.' });
  }
});

// ─── GET /api/assignments/:id/submissions — list submissions ─
router.get('/:id/submissions', rbac('admin', 'instructor'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, CONCAT(u.FirstName, ' ', u.LastName) AS StudentName, u.StudentID AS StudentCode
      FROM Submission s
      JOIN User u ON s.StudentID = u.UserID
      WHERE s.AssignmentID = ?
      ORDER BY s.SubmittedAt DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error('GET /assignments/:id/submissions error:', err);
    res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
});

// ─── POST /api/assignments/:id/submit — student submission ──
router.post('/:id/submit', rbac('student'), async (req, res) => {
  try {
    const { githubUrl, fileUrl } = req.body;
    const assignmentId = req.params.id;
    const studentId = req.user.id;

    // Check if assignment exists
    const [asgn] = await pool.query('SELECT * FROM Assignment WHERE AssignmentID = ?', [assignmentId]);
    if (asgn.length === 0) return res.status(404).json({ message: 'Assignment not found.' });

    const isLate = new Date() > new Date(asgn[0].DueDate);

    // Upsert submission
    await pool.query(`
      INSERT INTO Submission (AssignmentID, StudentID, SubmittedAt, Status, GithubURL, FileURL, IsLate)
      VALUES (?, ?, NOW(), 'submitted', ?, ?, ?)
      ON DUPLICATE KEY UPDATE SubmittedAt = NOW(), Status = 'submitted', GithubURL = VALUES(GithubURL), FileURL = VALUES(FileURL), IsLate = VALUES(IsLate)
    `, [assignmentId, studentId, githubUrl || null, fileUrl || null, isLate]);

    res.json({ message: 'Submission recorded.' });
  } catch (err) {
    console.error('POST /assignments/:id/submit error:', err);
    res.status(500).json({ message: 'Failed to submit assignment.' });
  }
});

module.exports = router;

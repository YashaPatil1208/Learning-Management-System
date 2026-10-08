const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// ─── GET /api/timetable — class sessions ────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cs.SessionID AS id, cs.SessionID,
             cs.CourseID AS courseId, cs.CourseID,
             cs.DayOfWeek AS dayOfWeek, cs.DayOfWeek,
             cs.StartTime AS startTime, cs.StartTime,
             cs.EndTime AS endTime, cs.EndTime,
             cs.RoomLocation AS room, cs.RoomLocation AS Room, cs.RoomLocation,
             cs.Type AS type, cs.Type,
             c.Code AS courseCode, c.Code AS CourseCode,
             c.Name AS courseName, c.Name AS CourseName,
             c.Color AS color, c.Color
      FROM ClassSession cs
      JOIN Course c ON cs.CourseID = c.CourseID
      ORDER BY FIELD(cs.DayOfWeek, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
               cs.StartTime
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /timetable error:', err);
    res.status(500).json({ message: 'Failed to fetch timetable.' });
  }
});

module.exports = router;

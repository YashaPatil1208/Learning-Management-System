const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// ─── GET /api/notifications — user's notifications ──────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT NotificationID AS id, NotificationID,
              Type AS type, Type,
              Title AS title, Title,
              Message AS message, Message,
              Link AS link, Link,
              IsRead AS isRead, (IsRead = 1) AS read, IsRead,
              CreatedAt AS createdAt, CreatedAt
       FROM Notification
       WHERE UserID = ?
       ORDER BY CreatedAt DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /notifications error:', err);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// ─── GET /api/notifications/announcements — general announcements ──
router.get('/announcements', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.AnnouncementID AS id, a.AnnouncementID,
             a.CourseID AS courseId, a.CourseID,
             a.Title AS title, a.Title,
             a.Body AS body, a.Body AS message, a.Body,
             a.CreatedAt AS createdAt, a.CreatedAt,
             CONCAT(u.FirstName, ' ', u.LastName) AS authorName
      FROM Announcement a
      LEFT JOIN User u ON a.AuthorID = u.UserID
      ORDER BY a.CreatedAt DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /announcements error:', err);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

// ─── POST /api/notifications — create notification ──────────
router.post('/', async (req, res) => {
  try {
    const { userId, type, title, message, link } = req.body;
    const targetUser = userId || req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Notification (UserID, Type, Title, Message, Link)
       VALUES (?, ?, ?, ?, ?)`,
      [targetUser, type || 'General', title || null, message, link || null]
    );
    res.status(201).json({ message: 'Notification created.', id: result.insertId });
  } catch (err) {
    console.error('POST /notifications error:', err);
    res.status(500).json({ message: 'Failed to create notification.' });
  }
});

// ─── PATCH /api/notifications/:id/read — mark as read ───────
router.patch('/:id/read', async (req, res) => {
  try {
    await pool.query(
      'UPDATE Notification SET IsRead = TRUE WHERE NotificationID = ? AND UserID = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error('PATCH /notifications/:id/read error:', err);
    res.status(500).json({ message: 'Failed to update notification.' });
  }
});

module.exports = router;

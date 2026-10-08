/**
 * ──────────────────────────────────────────────────────────────
 * LMS Seed Script
 * ──────────────────────────────────────────────────────────────
 * Drops all tables, recreates the schema, and populates with
 * realistic demo data.  All passwords are hashed with bcrypt.
 *
 * Usage:   node seed.js
 * ──────────────────────────────────────────────────────────────
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SALT_ROUNDS = 12;

async function seed() {
  console.log('🌱 Starting LMS database seed...\n');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    multipleStatements: true,
  });

  // ─── 1. Run schema.sql ──────────────────────────────────
  console.log('📄 Executing schema.sql ...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  let schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Drop existing tables in reverse FK order
  const DROP_SQL = `
    USE lms;
    SET FOREIGN_KEY_CHECKS = 0;
    DROP TABLE IF EXISTS Answer, Question, Announcement, Notification,
                         Resource, Grade, Attendance, ClassSession,
                         Submission, Assignment, Enrollment, Course, User;
    SET FOREIGN_KEY_CHECKS = 1;
  `;
  await conn.query(DROP_SQL);
  console.log('   ✓ Old tables dropped');

  await conn.query(schemaSql);
  console.log('   ✓ Schema created\n');

  await conn.query('USE lms');

  // ─── 2. Hash passwords ─────────────────────────────────
  console.log('🔐 Hashing passwords with bcrypt (12 rounds) ...');
  const demoPassword = await bcrypt.hash('password123', SALT_ROUNDS);
  console.log('   ✓ Done\n');

  // ─── 3. Insert Users ───────────────────────────────────
  console.log('👤 Inserting users ...');
  const users = [
    // Admin
    ['Admin', 'User', 'admin@example.com', demoPassword, 'admin', 'Computer Science', '+91 98765 00000', 'System administrator.', null, null, null, null, null, null, null, 'ADM001', 'System Admin'],
    // Instructors
    ['Rajiv', 'Mehta', 'r.mehta@university.edu', demoPassword, 'instructor', 'Computer Science', '+91 98765 11111', 'Professor with 15+ years of experience in DBMS and Systems Programming.', null, 'github.com/rajivmehta', 'linkedin.com/in/rajivmehta', null, null, null, null, 'EMP001', 'Professor'],
    ['Priya', 'Nair', 'p.nair@university.edu', demoPassword, 'instructor', 'Computer Science', '+91 98765 22222', 'Specializes in Machine Learning and Data Science.', null, null, 'linkedin.com/in/priyanair', null, null, null, null, 'EMP002', 'Associate Professor'],
    ['Arjun', 'Patel', 'a.patel@university.edu', demoPassword, 'instructor', 'Computer Science', '+91 98765 33333', 'Expert in Algorithms and Competitive Programming.', null, 'github.com/arjunpatel', null, null, null, null, null, 'EMP003', 'Assistant Professor'],
    // Students
    ['Aanya', 'Sharma', 'aanya.sharma@university.edu', demoPassword, 'student', 'Computer Science', '+91 98765 43210', 'Passionate about AI and full-stack development.', null, 'github.com/aanyasharma', 'linkedin.com/in/aanyasharma', 'CS2023001', 'CS-2023-A', 5, 8.7, null, null],
    ['Rohan', 'Verma', 'rohan.v@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023002', 'CS-2023-A', 5, 7.9, null, null],
    ['Sneha', 'Iyer', 'sneha.i@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023003', 'CS-2023-A', 5, 8.2, null, null],
    ['Karan', 'Singh', 'karan.s@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023004', 'CS-2023-B', 5, 9.1, null, null],
    ['Nisha', 'Gupta', 'nisha.g@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023005', 'CS-2023-B', 5, 7.5, null, null],
    ['Amit', 'Kumar', 'amit.k@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023006', 'CS-2023-A', 5, 8.0, null, null],
    ['Pooja', 'Desai', 'pooja.d@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023007', 'CS-2023-B', 5, 9.4, null, null],
    ['Rahul', 'Joshi', 'rahul.j@university.edu', demoPassword, 'student', 'Computer Science', null, null, null, null, null, 'CS2023008', 'CS-2023-A', 5, 7.6, null, null],
  ];

  for (const u of users) {
    await conn.query(
      `INSERT INTO User (FirstName, LastName, Email, PasswordHash, Role, Department, Phone, Bio, AvatarURL, Github, LinkedIn, StudentID, Batch, Semester, GPA, EmployeeID, Designation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, u
    );
  }
  console.log(`   ✓ ${users.length} users inserted\n`);

  // ─── 4. Insert Courses ─────────────────────────────────
  console.log('📚 Inserting courses ...');
  const courseData = [
    ['CS501', 'Database Management Systems', 'Comprehensive study of RDBMS concepts, SQL, normalization, transactions, and NoSQL databases.', 2, 'CS-2023-A', 4, 5, 'indigo', 42, 8],
    ['CS502', 'Machine Learning', 'Introduction to ML algorithms, supervised/unsupervised learning, neural networks.', 3, 'CS-2023-A', 4, 5, 'sky', 38, 4],
    ['CS503', 'Algorithm Design & Analysis', 'Advanced algorithm design paradigms, complexity analysis, graph algorithms, DP.', 4, 'CS-2023-A', 4, 5, 'emerald', 40, 3],
    ['CS504', 'Computer Networks', 'OSI model, TCP/IP protocols, routing algorithms, network security, socket programming.', 2, 'CS-2023-A', 3, 5, 'amber', 36, 2],
    ['CS505', 'Software Engineering', 'SDLC methodologies, Agile, design patterns, testing strategies, DevOps.', 3, 'CS-2023-A', 3, 5, 'rose', 34, 2],
  ];

  for (const c of courseData) {
    await conn.query(
      `INSERT INTO Course (Code, Name, Description, InstructorID, Batch, Credits, Semester, Color, TotalClasses, ResourceCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, c
    );
  }
  console.log(`   ✓ ${courseData.length} courses inserted\n`);

  // ─── 5. Enrollments (students 5-12 → UserID 5-12, courses 1-5) ──
  console.log('📝 Inserting enrollments ...');
  const enrollments = [
    [5, 1, 72, 88, 'A'],  [5, 2, 58, 75, 'B+'], [5, 3, 65, 91, 'A-'],
    [5, 4, 80, 68, 'B'],  [5, 5, 45, 82, 'B+'],
    [6, 1, 60, 82, 'B+'], [6, 3, 70, 88, 'A-'],
    [7, 1, 75, 91, 'A'],  [7, 2, 82, 85, 'A'],
    [8, 1, 88, 88, 'A+'], [8, 3, 90, 93, 'A+'],
    [9, 2, 50, 65, 'B'],  [9, 4, 55, 72, 'B-'],
    [10, 1, 65, 79, 'B+'], [10, 5, 70, 80, 'B+'],
    [11, 2, 92, 93, 'A+'], [11, 3, 85, 90, 'A'],
    [12, 1, 58, 72, 'B'],  [12, 4, 62, 76, 'B'],
  ];
  for (const e of enrollments) {
    await conn.query(
      'INSERT INTO Enrollment (StudentID, CourseID, Progress, AttendancePercent, Grade) VALUES (?,?,?,?,?)', e
    );
  }
  console.log(`   ✓ ${enrollments.length} enrollments inserted\n`);

  // ─── 6. Assignments ────────────────────────────────────
  console.log('📋 Inserting assignments ...');
  const assignmentData = [
    [1, 'ER Diagram & Relational Schema Design', 'Design a complete ER diagram for a hospital management system and convert it to 3NF.', '2024-10-15', 20, 'document', false, 'CS-2023-A'],
    [1, 'SQL Queries — Advanced', 'Write 20 SQL queries with JOINs, subqueries, and window functions.', '2024-10-28', 30, 'code', true, 'CS-2023-A'],
    [2, 'Linear Regression Implementation', 'Implement linear regression from scratch using NumPy.', '2024-10-10', 25, 'code', true, 'CS-2023-A'],
    [3, 'Dynamic Programming Problems', 'Solve 5 classic DP problems with complexity analysis.', '2024-10-05', 25, 'code', true, 'CS-2023-A'],
    [4, 'Socket Programming — Chat App', 'Build a multi-client chat using Python sockets.', '2024-10-22', 30, 'code', true, 'CS-2023-A'],
    [5, 'Software Requirements Specification', 'Prepare an SRS following IEEE 830 standard.', '2024-11-05', 20, 'document', false, 'CS-2023-A'],
  ];
  for (const a of assignmentData) {
    await conn.query(
      'INSERT INTO Assignment (CourseID, Title, Description, DueDate, MaxMarks, Type, RequiresGithub, Batch) VALUES (?,?,?,?,?,?,?,?)', a
    );
  }
  console.log(`   ✓ ${assignmentData.length} assignments inserted\n`);

  // ─── 7. Submissions ───────────────────────────────────
  console.log('📤 Inserting submissions ...');
  const subs = [
    [3, 5, '2024-10-09 16:45:00', 'graded', 'github.com/aanyasharma/ml-assignment-1', null, 22, 'Excellent implementation!', false],
    [4, 5, '2024-10-06 10:22:00', 'graded', 'github.com/aanyasharma/algo-dp', null, 20, 'Good solutions, edge case missed.', true],
    [4, 6, '2024-10-04 18:00:00', 'graded', null, null, 23, 'Excellent work.', false],
    [4, 7, '2024-10-05 22:30:00', 'pending', null, null, null, null, false],
    [3, 6, '2024-10-11 09:00:00', 'pending', null, null, null, null, true],
  ];
  for (const s of subs) {
    await conn.query(
      'INSERT INTO Submission (AssignmentID, StudentID, SubmittedAt, Status, GithubURL, FileURL, Marks, Feedback, IsLate) VALUES (?,?,?,?,?,?,?,?,?)', s
    );
  }
  console.log(`   ✓ ${subs.length} submissions inserted\n`);

  // ─── 8. Timetable (ClassSession) ──────────────────────
  console.log('📅 Inserting timetable ...');
  const sessions = [
    [1,'Monday','09:00','10:00','CS Lab 1','lecture'],
    [2,'Monday','11:00','12:00','Room 204','lecture'],
    [3,'Monday','14:00','15:00','Room 101','lecture'],
    [4,'Tuesday','09:00','10:00','Room 301','lecture'],
    [5,'Tuesday','11:00','12:00','Room 202','lecture'],
    [1,'Wednesday','10:00','11:00','CS Lab 1','lecture'],
    [3,'Wednesday','14:00','15:00','Room 101','tutorial'],
    [2,'Thursday','09:00','11:00','ML Lab','lab'],
    [4,'Thursday','13:00','14:00','Room 301','tutorial'],
    [1,'Friday','10:00','11:00','CS Lab 1','lab'],
    [5,'Friday','14:00','15:00','Room 202','lecture'],
  ];
  for (const s of sessions) {
    await conn.query(
      'INSERT INTO ClassSession (CourseID, DayOfWeek, StartTime, EndTime, RoomLocation, Type) VALUES (?,?,?,?,?,?)', s
    );
  }
  console.log(`   ✓ ${sessions.length} class sessions inserted\n`);

  // ─── 9. Attendance (for Aanya — UserID 5) ─────────────
  console.log('✅ Inserting attendance records ...');
  const getDate = (daysAgo) => {
    const d = new Date(); d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };
  const attData = [
    [1,5,getDate(1),'present'], [1,5,getDate(3),'present'], [1,5,getDate(5),'absent'],
    [1,5,getDate(8),'present'], [1,5,getDate(10),'present'], [1,5,getDate(12),'late'],
    [1,5,getDate(15),'present'], [1,5,getDate(17),'present'],
    [2,5,getDate(2),'present'], [2,5,getDate(4),'absent'], [2,5,getDate(6),'absent'],
    [2,5,getDate(9),'present'], [2,5,getDate(11),'late'], [2,5,getDate(14),'present'],
    [3,5,getDate(1),'present'], [3,5,getDate(4),'present'], [3,5,getDate(7),'present'],
    [3,5,getDate(10),'present'], [3,5,getDate(13),'absent'],
    [4,5,getDate(2),'present'], [4,5,getDate(5),'absent'], [4,5,getDate(7),'absent'],
    [4,5,getDate(9),'absent'], [4,5,getDate(12),'present'],
    [5,5,getDate(3),'present'], [5,5,getDate(6),'present'], [5,5,getDate(8),'present'],
    [5,5,getDate(11),'absent'], [5,5,getDate(15),'present'],
  ];
  for (const a of attData) {
    await conn.query(
      'INSERT INTO Attendance (CourseID, StudentID, Date, Status) VALUES (?,?,?,?)', a
    );
  }
  console.log(`   ✓ ${attData.length} attendance records inserted\n`);

  // ─── 10. Grades ────────────────────────────────────────
  console.log('📊 Inserting grades ...');
  const gradeData = [
    [5,1,'Quiz','Unit 1 Quiz',18,20,'2024-08-25'],
    [5,1,'Mid-Sem','Mid-Semester Exam',62,75,'2024-09-20'],
    [5,2,'Assignment','Linear Regression',22,25,'2024-10-10'],
    [5,2,'Quiz','Unit 2 Quiz',14,20,'2024-09-05'],
    [5,2,'Mid-Sem','Mid-Semester Exam',55,75,'2024-09-20'],
    [5,3,'Assignment','DP Problems',20,25,'2024-10-06'],
    [5,3,'Quiz','Graph Quiz',17,20,'2024-09-12'],
    [5,3,'Mid-Sem','Mid-Semester Exam',68,75,'2024-09-20'],
    [5,4,'Quiz','OSI Quiz',16,20,'2024-09-08'],
    [5,4,'Mid-Sem','Mid-Semester Exam',50,75,'2024-09-20'],
    [5,5,'Quiz','SDLC Quiz',15,20,'2024-09-10'],
  ];
  for (const g of gradeData) {
    await conn.query(
      'INSERT INTO Grade (StudentID, CourseID, AssessmentType, AssessmentName, Score, MaxScore, Date) VALUES (?,?,?,?,?,?,?)', g
    );
  }
  console.log(`   ✓ ${gradeData.length} grades inserted\n`);

  // ─── 11. Notifications ────────────────────────────────
  console.log('🔔 Inserting notifications ...');
  const notifData = [
    [5,'assignment','Assignment Due Tomorrow','ER Diagram (CS501) is due on Oct 15.',false,'/student/assignments','2024-10-14 09:00:00'],
    [5,'grade','Grade Published','Linear Regression (CS502) — 22/25.',false,'/student/grades','2024-10-12 15:30:00'],
    [5,'attendance','Attendance Warning','Computer Networks (CS504) at 68%.',false,'/student/attendance','2024-10-11 10:00:00'],
    [5,'resource','New Resource Uploaded','Unit 4 — Normalization for CS501.',true,'/student/courses/1','2024-10-09 14:00:00'],
    [5,'qa','Official Answer','Prof. Mehta answered your BCNF question.',true,'/student/qa','2024-10-01 14:05:00'],
    [5,'announcement','Holiday Notice','Oct 17 cancelled for foundation day.',true,null,'2024-10-08 09:00:00'],
  ];
  for (const n of notifData) {
    await conn.query(
      'INSERT INTO Notification (UserID, Type, Title, Message, IsRead, Link, CreatedAt) VALUES (?,?,?,?,?,?,?)', n
    );
  }
  console.log(`   ✓ ${notifData.length} notifications inserted\n`);

  // ─── 12. Announcements ────────────────────────────────
  console.log('📢 Inserting announcements ...');
  const annData = [
    [1, 2, 'Project Groups Announced', 'Mini-project groups finalized. Check the spreadsheet.', '2024-10-10 10:00:00'],
    [null, 1, 'Mid-Semester Grade Release', 'Mid-semester grades are now available.', '2024-10-05 09:00:00'],
    [2, 3, 'Guest Lecture — ML Practitioner', 'Guest lecture from Google ML engineer on Oct 20.', '2024-10-08 14:00:00'],
  ];
  for (const a of annData) {
    await conn.query(
      'INSERT INTO Announcement (CourseID, AuthorID, Title, Body, CreatedAt) VALUES (?,?,?,?,?)', a
    );
  }
  console.log(`   ✓ ${annData.length} announcements inserted\n`);

  // ─── 13. Q&A ──────────────────────────────────────────
  console.log('💬 Inserting Q&A ...');
  const qData = [
    [1, 5, 'Difference between BCNF and 3NF with a real-world example?', 'Can someone explain with a practical scenario?', 12, '2024-10-01 10:30:00'],
    [1, 6, 'How does MVCC work in PostgreSQL?', 'The PostgreSQL implementation seems different from textbook.', 8, '2024-10-03 14:15:00'],
    [2, 7, 'When should I use Ridge vs Lasso regression?', 'Practical considerations for choosing one over the other?', 15, '2024-09-28 09:00:00'],
    [3, 8, 'Time complexity of Dijkstra with a priority queue?', 'Step-by-step derivation of O((V+E) log V)?', 20, '2024-09-25 11:45:00'],
  ];
  for (const q of qData) {
    await conn.query(
      'INSERT INTO Question (CourseID, AuthorID, Title, Body, Upvotes, CreatedAt) VALUES (?,?,?,?,?,?)', q
    );
  }
  const ansData = [
    [1, 2, 'In BCNF every determinant must be a candidate key — no exceptions. Example: R(Student, Subject, Teacher)...', 18, true, '2024-10-01 14:00:00'],
    [3, 3, 'Use Lasso when many features are irrelevant (drives coefficients to zero). Use Ridge when all contribute somewhat.', 22, true, '2024-09-29 10:00:00'],
  ];
  for (const a of ansData) {
    await conn.query(
      'INSERT INTO Answer (QuestionID, AuthorID, Body, Upvotes, IsOfficial, CreatedAt) VALUES (?,?,?,?,?,?)', a
    );
  }
  console.log(`   ✓ ${qData.length} questions + ${ansData.length} answers inserted\n`);

  // ─── 14. Resources ────────────────────────────────────
  console.log('📁 Inserting resources ...');
  const resData = [
    [1,'DBMS Course Syllabus 2024-25','pdf','Syllabus','2024-08-01','0.3 MB','#'],
    [1,'Unit 1 — Intro to Databases','pdf','Lecture Notes','2024-08-12','2.1 MB','#'],
    [1,'Unit 2 — ER Diagrams','pdf','Lecture Notes','2024-08-20','3.4 MB','#'],
    [1,'Unit 3 — SQL Deep Dive','pdf','Lecture Notes','2024-09-02','4.2 MB','#'],
    [1,'Unit 4 — Normalization','pptx','Lecture Notes','2024-09-15','5.8 MB','#'],
    [1,'DBMS Mid-Sem 2023 Paper','pdf','Previous Year Questions','2024-08-05','1.2 MB','#'],
    [1,'DBMS End-Sem 2023 Paper','pdf','Previous Year Questions','2024-08-05','1.5 MB','#'],
    [1,'Database System Concepts — Silberschatz','link','Reference Material','2024-08-01',null,'#'],
    [2,'ML Syllabus 2024-25','pdf','Syllabus','2024-08-01','0.4 MB','#'],
    [2,'Unit 1 — Intro to ML','pdf','Lecture Notes','2024-08-14','2.8 MB','#'],
    [2,'Unit 2 — Linear Regression','pdf','Lecture Notes','2024-08-28','3.1 MB','#'],
    [2,'Hands-on: scikit-learn Notebook','ipynb','Reference Material','2024-09-10','1.1 MB','#'],
    [3,'Algorithm Design Syllabus','pdf','Syllabus','2024-08-01','0.3 MB','#'],
    [3,'Unit 1 — Sorting & Searching','pdf','Lecture Notes','2024-08-15','2.5 MB','#'],
    [3,'Graph Algorithms Cheatsheet','pdf','Reference Material','2024-09-05','0.8 MB','#'],
    [4,'Computer Networks Syllabus','pdf','Syllabus','2024-08-01','0.4 MB','#'],
    [4,'Unit 1 — OSI Model','pptx','Lecture Notes','2024-08-18','4.1 MB','#'],
    [5,'Software Engineering Syllabus','pdf','Syllabus','2024-08-01','0.4 MB','#'],
    [5,'Agile & Scrum Guide','pdf','Reference Material','2024-09-01','2.2 MB','#'],
  ];
  for (const r of resData) {
    await conn.query(
      'INSERT INTO Resource (CourseID, Name, Type, Category, UploadDate, Size, URL) VALUES (?,?,?,?,?,?,?)', r
    );
  }
  console.log(`   ✓ ${resData.length} resources inserted\n`);

  // ─── Done ──────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════');
  console.log('🎉 Seed complete!  Demo credentials:');
  console.log('');
  console.log('   Admin:      admin@example.com         / password123');
  console.log('   Instructor: r.mehta@university.edu    / password123');
  console.log('   Student:    aanya.sharma@university.edu / password123');
  console.log('');
  console.log('   (All accounts use password: password123)');
  console.log('═══════════════════════════════════════════════');

  await conn.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

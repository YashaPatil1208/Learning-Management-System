// ============================================================
// MOCK DATA — University LMS
// Structured to mirror a real relational database schema.
// Replace imports with API calls when connecting to a backend.
// ============================================================

// ----- USERS -----
export const users = [
  {
    id: 'u1',
    name: 'Aanya Sharma',
    email: 'aanya.sharma@university.edu',
    role: 'student',
    avatar: null,
    department: 'Computer Science',
    phone: '+91 98765 43210',
    bio: 'Passionate about AI and full-stack development. Love contributing to open-source projects.',
    github: 'github.com/aanyasharma',
    linkedin: 'linkedin.com/in/aanyasharma',
    joinedAt: '2023-08-01',
  },
  {
    id: 'u2',
    name: 'Prof. Rajiv Mehta',
    email: 'r.mehta@university.edu',
    role: 'teacher',
    avatar: null,
    department: 'Computer Science',
    phone: '+91 98765 11111',
    bio: 'Professor with 15+ years of experience in DBMS and Systems Programming.',
    github: 'github.com/rajivmehta',
    linkedin: 'linkedin.com/in/rajivmehta',
    joinedAt: '2010-07-15',
  },
  {
    id: 'u3',
    name: 'Dr. Priya Nair',
    email: 'p.nair@university.edu',
    role: 'teacher',
    avatar: null,
    department: 'Computer Science',
    phone: '+91 98765 22222',
    bio: 'Specializes in Machine Learning and Data Science.',
    github: null,
    linkedin: 'linkedin.com/in/priyanair',
    joinedAt: '2015-01-10',
  },
  {
    id: 'u4',
    name: 'Prof. Arjun Patel',
    email: 'a.patel@university.edu',
    role: 'teacher',
    avatar: null,
    department: 'Computer Science',
    phone: '+91 98765 33333',
    bio: 'Expert in Algorithms and Competitive Programming.',
    github: 'github.com/arjunpatel',
    linkedin: null,
    joinedAt: '2012-06-01',
  },
];

// ----- STUDENTS -----
export const students = [
  { id: 's1', userId: 'u1', studentId: 'CS2023001', batch: 'CS-2023-A', semester: 5, gpa: 8.7 },
  { id: 's2', userId: null, studentId: 'CS2023002', batch: 'CS-2023-A', semester: 5, gpa: 7.9, name: 'Rohan Verma', email: 'rohan.v@university.edu', avatar: null },
  { id: 's3', userId: null, studentId: 'CS2023003', batch: 'CS-2023-A', semester: 5, gpa: 8.2, name: 'Sneha Iyer', email: 'sneha.i@university.edu', avatar: null },
  { id: 's4', userId: null, studentId: 'CS2023004', batch: 'CS-2023-B', semester: 5, gpa: 9.1, name: 'Karan Singh', email: 'karan.s@university.edu', avatar: null },
  { id: 's5', userId: null, studentId: 'CS2023005', batch: 'CS-2023-B', semester: 5, gpa: 7.5, name: 'Nisha Gupta', email: 'nisha.g@university.edu', avatar: null },
  { id: 's6', userId: null, studentId: 'CS2023006', batch: 'CS-2023-A', semester: 5, gpa: 8.0, name: 'Amit Kumar', email: 'amit.k@university.edu', avatar: null },
];

// ----- TEACHERS -----
export const teachers = [
  { id: 't1', userId: 'u2', employeeId: 'EMP001', department: 'CS', designation: 'Professor' },
  { id: 't2', userId: 'u3', employeeId: 'EMP002', department: 'CS', designation: 'Associate Professor' },
  { id: 't3', userId: 'u4', employeeId: 'EMP003', department: 'CS', designation: 'Assistant Professor' },
];

// ----- COURSES -----
export const courses = [
  {
    id: 'c1',
    code: 'CS501',
    name: 'Database Management Systems',
    description: 'Comprehensive study of RDBMS concepts, SQL, normalization, transactions, and NoSQL databases. Includes hands-on projects with PostgreSQL and MongoDB.',
    teacherId: 't1',
    teacherName: 'Prof. Rajiv Mehta',
    batch: 'CS-2023-A',
    credits: 4,
    semester: 5,
    color: 'indigo',
    totalClasses: 42,
    resourceCount: 18,
  },
  {
    id: 'c2',
    code: 'CS502',
    name: 'Machine Learning',
    description: 'Introduction to ML algorithms, supervised/unsupervised learning, neural networks, and practical applications using Python and scikit-learn.',
    teacherId: 't2',
    teacherName: 'Dr. Priya Nair',
    batch: 'CS-2023-A',
    credits: 4,
    semester: 5,
    color: 'sky',
    totalClasses: 38,
    resourceCount: 22,
  },
  {
    id: 'c3',
    code: 'CS503',
    name: 'Algorithm Design & Analysis',
    description: 'Advanced algorithm design paradigms, complexity analysis, graph algorithms, dynamic programming, and NP-completeness theory.',
    teacherId: 't3',
    teacherName: 'Prof. Arjun Patel',
    batch: 'CS-2023-A',
    credits: 4,
    semester: 5,
    color: 'emerald',
    totalClasses: 40,
    resourceCount: 14,
  },
  {
    id: 'c4',
    code: 'CS504',
    name: 'Computer Networks',
    description: 'OSI model, TCP/IP protocols, routing algorithms, network security, and socket programming.',
    teacherId: 't1',
    teacherName: 'Prof. Rajiv Mehta',
    batch: 'CS-2023-A',
    credits: 3,
    semester: 5,
    color: 'amber',
    totalClasses: 36,
    resourceCount: 12,
  },
  {
    id: 'c5',
    code: 'CS505',
    name: 'Software Engineering',
    description: 'SDLC methodologies, Agile, design patterns, testing strategies, DevOps, and project management.',
    teacherId: 't2',
    teacherName: 'Dr. Priya Nair',
    batch: 'CS-2023-A',
    credits: 3,
    semester: 5,
    color: 'rose',
    totalClasses: 34,
    resourceCount: 16,
  },
];

// ----- ENROLLMENTS -----
export const enrollments = [
  { id: 'e1', studentId: 's1', courseId: 'c1', progress: 72, attendancePercent: 88, grade: 'A' },
  { id: 'e2', studentId: 's1', courseId: 'c2', progress: 58, attendancePercent: 75, grade: 'B+' },
  { id: 'e3', studentId: 's1', courseId: 'c3', progress: 65, attendancePercent: 91, grade: 'A-' },
  { id: 'e4', studentId: 's1', courseId: 'c4', progress: 80, attendancePercent: 68, grade: 'B' },
  { id: 'e5', studentId: 's1', courseId: 'c5', progress: 45, attendancePercent: 82, grade: 'B+' },
];

// ----- RESOURCES -----
export const resources = [
  // CS501 — DBMS
  { id: 'r1', courseId: 'c1', name: 'DBMS Course Syllabus 2024-25', type: 'pdf', category: 'Syllabus', uploadDate: '2024-08-01', size: '0.3 MB', url: '#' },
  { id: 'r2', courseId: 'c1', name: 'Unit 1 — Intro to Databases', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-08-12', size: '2.1 MB', url: '#' },
  { id: 'r3', courseId: 'c1', name: 'Unit 2 — ER Diagrams', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-08-20', size: '3.4 MB', url: '#' },
  { id: 'r4', courseId: 'c1', name: 'Unit 3 — SQL Deep Dive', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-09-02', size: '4.2 MB', url: '#' },
  { id: 'r5', courseId: 'c1', name: 'Unit 4 — Normalization', type: 'pptx', category: 'Lecture Notes', uploadDate: '2024-09-15', size: '5.8 MB', url: '#' },
  { id: 'r6', courseId: 'c1', name: 'DBMS Mid-Sem 2023 Paper', type: 'pdf', category: 'Previous Year Questions', uploadDate: '2024-08-05', size: '1.2 MB', url: '#' },
  { id: 'r7', courseId: 'c1', name: 'DBMS End-Sem 2023 Paper', type: 'pdf', category: 'Previous Year Questions', uploadDate: '2024-08-05', size: '1.5 MB', url: '#' },
  { id: 'r8', courseId: 'c1', name: 'Database System Concepts — Silberschatz', type: 'link', category: 'Reference Material', uploadDate: '2024-08-01', size: null, url: '#' },

  // CS502 — ML
  { id: 'r9', courseId: 'c2', name: 'ML Syllabus 2024-25', type: 'pdf', category: 'Syllabus', uploadDate: '2024-08-01', size: '0.4 MB', url: '#' },
  { id: 'r10', courseId: 'c2', name: 'Unit 1 — Intro to ML', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-08-14', size: '2.8 MB', url: '#' },
  { id: 'r11', courseId: 'c2', name: 'Unit 2 — Linear Regression', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-08-28', size: '3.1 MB', url: '#' },
  { id: 'r12', courseId: 'c2', name: 'Hands-on: scikit-learn Notebook', type: 'ipynb', category: 'Reference Material', uploadDate: '2024-09-10', size: '1.1 MB', url: '#' },

  // CS503 — Algorithms
  { id: 'r13', courseId: 'c3', name: 'Algorithm Design Syllabus', type: 'pdf', category: 'Syllabus', uploadDate: '2024-08-01', size: '0.3 MB', url: '#' },
  { id: 'r14', courseId: 'c3', name: 'Unit 1 — Sorting & Searching', type: 'pdf', category: 'Lecture Notes', uploadDate: '2024-08-15', size: '2.5 MB', url: '#' },
  { id: 'r15', courseId: 'c3', name: 'Graph Algorithms Cheatsheet', type: 'pdf', category: 'Reference Material', uploadDate: '2024-09-05', size: '0.8 MB', url: '#' },

  // CS504 — Networks
  { id: 'r16', courseId: 'c4', name: 'Computer Networks Syllabus', type: 'pdf', category: 'Syllabus', uploadDate: '2024-08-01', size: '0.4 MB', url: '#' },
  { id: 'r17', courseId: 'c4', name: 'Unit 1 — OSI Model', type: 'pptx', category: 'Lecture Notes', uploadDate: '2024-08-18', size: '4.1 MB', url: '#' },

  // CS505 — SE
  { id: 'r18', courseId: 'c5', name: 'Software Engineering Syllabus', type: 'pdf', category: 'Syllabus', uploadDate: '2024-08-01', size: '0.4 MB', url: '#' },
  { id: 'r19', courseId: 'c5', name: 'Agile & Scrum Guide', type: 'pdf', category: 'Reference Material', uploadDate: '2024-09-01', size: '2.2 MB', url: '#' },
];

// ----- ASSIGNMENTS -----
export const assignments = [
  {
    id: 'a1', courseId: 'c1', courseCode: 'CS501', courseName: 'Database Management Systems',
    title: 'ER Diagram & Relational Schema Design',
    description: 'Design a complete ER diagram for a hospital management system and convert it to a normalized relational schema (up to 3NF). Document all functional dependencies.',
    dueDate: '2024-10-15', maxMarks: 20, type: 'document',
    requiresGithub: false, batch: 'CS-2023-A',
  },
  {
    id: 'a2', courseId: 'c1', courseCode: 'CS501', courseName: 'Database Management Systems',
    title: 'SQL Queries — Advanced',
    description: 'Write 20 SQL queries ranging from basic SELECT to complex JOINs, subqueries, and window functions on the provided dataset. Submit a .sql file with all queries and output screenshots.',
    dueDate: '2024-10-28', maxMarks: 30, type: 'code',
    requiresGithub: true, batch: 'CS-2023-A',
  },
  {
    id: 'a3', courseId: 'c2', courseCode: 'CS502', courseName: 'Machine Learning',
    title: 'Linear Regression Implementation',
    description: 'Implement linear regression from scratch using NumPy (no sklearn). Apply it to the Boston Housing dataset and compare results with sklearn\'s implementation. Plot residuals.',
    dueDate: '2024-10-10', maxMarks: 25, type: 'code',
    requiresGithub: true, batch: 'CS-2023-A',
  },
  {
    id: 'a4', courseId: 'c3', courseCode: 'CS503', courseName: 'Algorithm Design & Analysis',
    title: 'Dynamic Programming Problems',
    description: 'Solve 5 classic DP problems (LCS, Knapsack, Matrix Chain Multiplication, etc.) with detailed analysis. Provide time and space complexity for each.',
    dueDate: '2024-10-05', maxMarks: 25, type: 'code',
    requiresGithub: true, batch: 'CS-2023-A',
  },
  {
    id: 'a5', courseId: 'c4', courseCode: 'CS504', courseName: 'Computer Networks',
    title: 'Socket Programming — Chat App',
    description: 'Develop a multi-client chat application using Python sockets. Implement both server and client, handling concurrent connections with threading.',
    dueDate: '2024-10-22', maxMarks: 30, type: 'code',
    requiresGithub: true, batch: 'CS-2023-A',
  },
  {
    id: 'a6', courseId: 'c5', courseCode: 'CS505', courseName: 'Software Engineering',
    title: 'Software Requirements Specification',
    description: 'Prepare a comprehensive SRS document for any system of your choice following IEEE 830 standard. Include use case diagrams, functional & non-functional requirements.',
    dueDate: '2024-11-05', maxMarks: 20, type: 'document',
    requiresGithub: false, batch: 'CS-2023-A',
  },
];

// ----- SUBMISSIONS -----
export const submissions = [
  {
    id: 'sub1', assignmentId: 'a3', studentId: 's1',
    submittedAt: '2024-10-09T16:45:00', status: 'graded',
    githubUrl: 'github.com/aanyasharma/ml-assignment-1',
    fileUrl: '#', marks: 22, maxMarks: 25, feedback: 'Excellent implementation! The from-scratch approach was clean. Loss curve could be more annotated.',
    late: false,
  },
  {
    id: 'sub2', assignmentId: 'a4', studentId: 's1',
    submittedAt: '2024-10-06T10:22:00', status: 'graded',
    githubUrl: 'github.com/aanyasharma/algo-dp',
    fileUrl: '#', marks: 20, maxMarks: 25, feedback: 'Good solutions. LCS analysis was well-explained. Matrix chain had an edge case missed.',
    late: true,
  },
  {
    id: 'sub3', assignmentId: 'a1', studentId: 's1',
    submittedAt: null, status: 'pending', githubUrl: null,
    fileUrl: null, marks: null, maxMarks: 20, feedback: null, late: false,
  },
];

// ----- GRADES -----
export const grades = [
  // DBMS
  { id: 'g1', studentId: 's1', courseId: 'c1', assessmentType: 'Assignment', assessmentName: 'ER Diagram Design', score: null, maxScore: 20, date: '2024-10-15' },
  { id: 'g2', studentId: 's1', courseId: 'c1', assessmentType: 'Quiz', assessmentName: 'Unit 1 Quiz', score: 18, maxScore: 20, date: '2024-08-25' },
  { id: 'g3', studentId: 's1', courseId: 'c1', assessmentType: 'Mid-Sem', assessmentName: 'Mid-Semester Exam', score: 62, maxScore: 75, date: '2024-09-20' },
  // ML
  { id: 'g4', studentId: 's1', courseId: 'c2', assessmentType: 'Assignment', assessmentName: 'Linear Regression', score: 22, maxScore: 25, date: '2024-10-10' },
  { id: 'g5', studentId: 's1', courseId: 'c2', assessmentType: 'Quiz', assessmentName: 'Unit 2 Quiz', score: 14, maxScore: 20, date: '2024-09-05' },
  { id: 'g6', studentId: 's1', courseId: 'c2', assessmentType: 'Mid-Sem', assessmentName: 'Mid-Semester Exam', score: 55, maxScore: 75, date: '2024-09-20' },
  // Algorithms
  { id: 'g7', studentId: 's1', courseId: 'c3', assessmentType: 'Assignment', assessmentName: 'DP Problems', score: 20, maxScore: 25, date: '2024-10-06' },
  { id: 'g8', studentId: 's1', courseId: 'c3', assessmentType: 'Quiz', assessmentName: 'Graph Quiz', score: 17, maxScore: 20, date: '2024-09-12' },
  { id: 'g9', studentId: 's1', courseId: 'c3', assessmentType: 'Mid-Sem', assessmentName: 'Mid-Semester Exam', score: 68, maxScore: 75, date: '2024-09-20' },
  // Networks
  { id: 'g10', studentId: 's1', courseId: 'c4', assessmentType: 'Quiz', assessmentName: 'OSI Quiz', score: 16, maxScore: 20, date: '2024-09-08' },
  { id: 'g11', studentId: 's1', courseId: 'c4', assessmentType: 'Mid-Sem', assessmentName: 'Mid-Semester Exam', score: 50, maxScore: 75, date: '2024-09-20' },
  // SE
  { id: 'g12', studentId: 's1', courseId: 'c5', assessmentType: 'Quiz', assessmentName: 'SDLC Quiz', score: 15, maxScore: 20, date: '2024-09-10' },
];

// ----- ATTENDANCE -----
const today = new Date();
const getDate = (daysAgo) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const attendance = [
  // Course c1 - DBMS
  { id: 'att1', courseId: 'c1', studentId: 's1', date: getDate(1), status: 'present' },
  { id: 'att2', courseId: 'c1', studentId: 's1', date: getDate(3), status: 'present' },
  { id: 'att3', courseId: 'c1', studentId: 's1', date: getDate(5), status: 'absent' },
  { id: 'att4', courseId: 'c1', studentId: 's1', date: getDate(8), status: 'present' },
  { id: 'att5', courseId: 'c1', studentId: 's1', date: getDate(10), status: 'present' },
  { id: 'att6', courseId: 'c1', studentId: 's1', date: getDate(12), status: 'late' },
  { id: 'att7', courseId: 'c1', studentId: 's1', date: getDate(15), status: 'present' },
  { id: 'att8', courseId: 'c1', studentId: 's1', date: getDate(17), status: 'present' },
  // Course c2 - ML
  { id: 'att9', courseId: 'c2', studentId: 's1', date: getDate(2), status: 'present' },
  { id: 'att10', courseId: 'c2', studentId: 's1', date: getDate(4), status: 'absent' },
  { id: 'att11', courseId: 'c2', studentId: 's1', date: getDate(6), status: 'absent' },
  { id: 'att12', courseId: 'c2', studentId: 's1', date: getDate(9), status: 'present' },
  { id: 'att13', courseId: 'c2', studentId: 's1', date: getDate(11), status: 'late' },
  { id: 'att14', courseId: 'c2', studentId: 's1', date: getDate(14), status: 'present' },
  { id: 'att15', courseId: 'c2', studentId: 's1', date: getDate(16), status: 'absent' },
  { id: 'att16', courseId: 'c2', studentId: 's1', date: getDate(18), status: 'present' },
  // Course c3 - Algo
  { id: 'att17', courseId: 'c3', studentId: 's1', date: getDate(1), status: 'present' },
  { id: 'att18', courseId: 'c3', studentId: 's1', date: getDate(4), status: 'present' },
  { id: 'att19', courseId: 'c3', studentId: 's1', date: getDate(7), status: 'present' },
  { id: 'att20', courseId: 'c3', studentId: 's1', date: getDate(10), status: 'present' },
  { id: 'att21', courseId: 'c3', studentId: 's1', date: getDate(13), status: 'absent' },
  // Course c4 - Networks
  { id: 'att22', courseId: 'c4', studentId: 's1', date: getDate(2), status: 'present' },
  { id: 'att23', courseId: 'c4', studentId: 's1', date: getDate(5), status: 'absent' },
  { id: 'att24', courseId: 'c4', studentId: 's1', date: getDate(7), status: 'absent' },
  { id: 'att25', courseId: 'c4', studentId: 's1', date: getDate(9), status: 'absent' },
  { id: 'att26', courseId: 'c4', studentId: 's1', date: getDate(12), status: 'present' },
  { id: 'att27', courseId: 'c4', studentId: 's1', date: getDate(14), status: 'late' },
  { id: 'att28', courseId: 'c4', studentId: 's1', date: getDate(16), status: 'present' },
  // Course c5 - SE
  { id: 'att29', courseId: 'c5', studentId: 's1', date: getDate(3), status: 'present' },
  { id: 'att30', courseId: 'c5', studentId: 's1', date: getDate(6), status: 'present' },
  { id: 'att31', courseId: 'c5', studentId: 's1', date: getDate(8), status: 'present' },
  { id: 'att32', courseId: 'c5', studentId: 's1', date: getDate(11), status: 'absent' },
  { id: 'att33', courseId: 'c5', studentId: 's1', date: getDate(15), status: 'present' },
];

// ----- TIMETABLE -----
export const timetable = [
  { id: 'tt1', courseId: 'c1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: 'CS Lab 1', type: 'lecture' },
  { id: 'tt2', courseId: 'c2', dayOfWeek: 'Monday', startTime: '11:00', endTime: '12:00', room: 'Room 204', type: 'lecture' },
  { id: 'tt3', courseId: 'c3', dayOfWeek: 'Monday', startTime: '14:00', endTime: '15:00', room: 'Room 101', type: 'lecture' },
  { id: 'tt4', courseId: 'c4', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:00', room: 'Room 301', type: 'lecture' },
  { id: 'tt5', courseId: 'c5', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '12:00', room: 'Room 202', type: 'lecture' },
  { id: 'tt6', courseId: 'c1', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '11:00', room: 'CS Lab 1', type: 'lecture' },
  { id: 'tt7', courseId: 'c3', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '15:00', room: 'Room 101', type: 'tutorial' },
  { id: 'tt8', courseId: 'c2', dayOfWeek: 'Thursday', startTime: '09:00', endTime: '11:00', room: 'ML Lab', type: 'lab' },
  { id: 'tt9', courseId: 'c4', dayOfWeek: 'Thursday', startTime: '13:00', endTime: '14:00', room: 'Room 301', type: 'tutorial' },
  { id: 'tt10', courseId: 'c1', dayOfWeek: 'Friday', startTime: '10:00', endTime: '11:00', room: 'CS Lab 1', type: 'lab' },
  { id: 'tt11', courseId: 'c5', dayOfWeek: 'Friday', startTime: '14:00', endTime: '15:00', room: 'Room 202', type: 'lecture' },
];

// ----- QUESTIONS (Q&A) -----
export const questions = [
  {
    id: 'q1', courseId: 'c1', authorId: 's1', authorName: 'Aanya Sharma',
    title: 'Difference between BCNF and 3NF with a real-world example?',
    body: 'I understand the definitions but can someone explain with a practical database scenario where 3NF holds but BCNF doesn\'t?',
    upvotes: 12, answerCount: 3, createdAt: '2024-10-01T10:30:00', tags: ['normalization', 'BCNF', '3NF'],
  },
  {
    id: 'q2', courseId: 'c1', authorId: 's2', authorName: 'Rohan Verma',
    title: 'How does MVCC work in PostgreSQL?',
    body: 'I read about Multi-Version Concurrency Control but the PostgreSQL implementation seems different from the textbook. Can someone explain the visibility rules?',
    upvotes: 8, answerCount: 2, createdAt: '2024-10-03T14:15:00', tags: ['transactions', 'MVCC', 'PostgreSQL'],
  },
  {
    id: 'q3', courseId: 'c2', authorId: 's3', authorName: 'Sneha Iyer',
    title: 'When should I use Ridge vs Lasso regression?',
    body: 'Both handle overfitting through regularization. What are the practical considerations for choosing one over the other?',
    upvotes: 15, answerCount: 4, createdAt: '2024-09-28T09:00:00', tags: ['regression', 'regularization'],
  },
  {
    id: 'q4', courseId: 'c3', authorId: 's4', authorName: 'Karan Singh',
    title: 'Can someone explain the time complexity of Dijkstra with a priority queue?',
    body: 'The textbook says O((V+E) log V) but I\'m not sure how to derive this. Step-by-step analysis would help.',
    upvotes: 20, answerCount: 5, createdAt: '2024-09-25T11:45:00', tags: ['graph', 'Dijkstra', 'complexity'],
  },
  {
    id: 'q5', courseId: 'c1', authorId: 's5', authorName: 'Nisha Gupta',
    title: 'Deadlock prevention vs deadlock avoidance — key differences?',
    body: 'I keep mixing these up. Can someone list the differences with an example of Banker\'s algorithm?',
    upvotes: 9, answerCount: 2, createdAt: '2024-10-04T16:20:00', tags: ['transactions', 'deadlock'],
  },
];

export const answers = [
  {
    id: 'ans1', questionId: 'q1', authorId: 't1', authorName: 'Prof. Rajiv Mehta', isTeacher: true,
    body: 'Great question! In BCNF, every determinant must be a candidate key — no exceptions. In 3NF, we allow transitive dependencies if the dependent is a prime attribute (part of some candidate key). Example: Relation R(Student, Subject, Teacher) where each teacher teaches one subject, each student-subject pair has one teacher. Here {Student,Subject}→Teacher and Teacher→Subject. This is in 3NF (Teacher is a prime-like attribute) but NOT BCNF (Teacher is not a candidate key). The official answer covers this in Unit 3 notes.',
    upvotes: 18, isOfficial: true, createdAt: '2024-10-01T14:00:00',
  },
  {
    id: 'ans2', questionId: 'q3', authorId: 't2', authorName: 'Dr. Priya Nair', isTeacher: true,
    body: 'Use Lasso when you believe many features are irrelevant (it drives coefficients to exactly zero — good for feature selection). Use Ridge when you believe all features contribute somewhat but need to prevent overfitting. Ridge is differentiable everywhere making optimization easier. In practice, try Elastic Net which combines both.',
    upvotes: 22, isOfficial: true, createdAt: '2024-09-29T10:00:00',
  },
];

// ----- NOTIFICATIONS -----
export const notifications = [
  {
    id: 'n1', userId: 'u1', type: 'assignment', icon: 'FileText',
    title: 'Assignment Due Tomorrow',
    message: 'ER Diagram & Relational Schema Design (CS501) is due on Oct 15.',
    read: false, createdAt: '2024-10-14T09:00:00', link: '/student/assignments',
  },
  {
    id: 'n2', userId: 'u1', type: 'grade', icon: 'Award',
    title: 'Grade Published',
    message: 'Your grade for Linear Regression (CS502) has been published. You scored 22/25.',
    read: false, createdAt: '2024-10-12T15:30:00', link: '/student/grades',
  },
  {
    id: 'n3', userId: 'u1', type: 'attendance', icon: 'AlertCircle',
    title: 'Attendance Warning',
    message: 'Your attendance in Computer Networks (CS504) has fallen to 68%. Minimum required is 75%.',
    read: false, createdAt: '2024-10-11T10:00:00', link: '/student/attendance',
  },
  {
    id: 'n4', userId: 'u1', type: 'resource', icon: 'BookOpen',
    title: 'New Resource Uploaded',
    message: 'Unit 4 — Normalization slides have been uploaded for DBMS (CS501).',
    read: true, createdAt: '2024-10-09T14:00:00', link: '/student/courses/c1',
  },
  {
    id: 'n5', userId: 'u1', type: 'qa', icon: 'MessageSquare',
    title: 'Official Answer on Your Question',
    message: 'Prof. Rajiv Mehta answered your question about BCNF vs 3NF.',
    read: true, createdAt: '2024-10-01T14:05:00', link: '/student/qa',
  },
  {
    id: 'n6', userId: 'u1', type: 'announcement', icon: 'Megaphone',
    title: 'Holiday Notice',
    message: 'Classes on October 17 are cancelled due to university foundation day celebrations.',
    read: true, createdAt: '2024-10-08T09:00:00', link: '#',
  },
  {
    id: 'n7', userId: 'u1', type: 'grade', icon: 'Award',
    title: 'Grade Published',
    message: 'Your grade for DP Problems (CS503) has been published. You scored 20/25.',
    read: true, createdAt: '2024-10-07T12:00:00', link: '/student/grades',
  },
];

// ----- ANNOUNCEMENTS -----
export const announcements = [
  {
    id: 'ann1', courseId: 'c1', authorId: 't1', authorName: 'Prof. Rajiv Mehta',
    title: 'Project Groups Announced',
    body: 'The mini-project groups have been finalized. Please check the shared spreadsheet for your team and topic assignment.',
    createdAt: '2024-10-10T10:00:00',
  },
  {
    id: 'ann2', courseId: null, authorId: 'admin', authorName: 'Academic Office',
    title: 'Mid-Semester Grade Release',
    body: 'Mid-semester grades are now available on the portal. Please check your grade report.',
    createdAt: '2024-10-05T09:00:00',
  },
  {
    id: 'ann3', courseId: 'c2', authorId: 't2', authorName: 'Dr. Priya Nair',
    title: 'Guest Lecture — Industry ML Practitioner',
    body: 'We have a guest lecture from a senior ML engineer at Google India on Oct 20. Attendance is mandatory.',
    createdAt: '2024-10-08T14:00:00',
  },
];

// ---- Teacher-side: All students for grading ----
export const allStudentsForTeacher = [
  { studentId: 'CS2023001', name: 'Aanya Sharma', email: 'aanya.sharma@university.edu', batch: 'CS-2023-A', attendance: 76, gpa: 8.7, avatar: null },
  { studentId: 'CS2023002', name: 'Rohan Verma', email: 'rohan.v@university.edu', batch: 'CS-2023-A', attendance: 82, gpa: 7.9, avatar: null },
  { studentId: 'CS2023003', name: 'Sneha Iyer', email: 'sneha.i@university.edu', batch: 'CS-2023-A', attendance: 91, gpa: 8.2, avatar: null },
  { studentId: 'CS2023004', name: 'Karan Singh', email: 'karan.s@university.edu', batch: 'CS-2023-B', attendance: 88, gpa: 9.1, avatar: null },
  { studentId: 'CS2023005', name: 'Nisha Gupta', email: 'nisha.g@university.edu', batch: 'CS-2023-B', attendance: 65, gpa: 7.5, avatar: null },
  { studentId: 'CS2023006', name: 'Amit Kumar', email: 'amit.k@university.edu', batch: 'CS-2023-A', attendance: 79, gpa: 8.0, avatar: null },
  { studentId: 'CS2023007', name: 'Pooja Desai', email: 'pooja.d@university.edu', batch: 'CS-2023-B', attendance: 93, gpa: 9.4, avatar: null },
  { studentId: 'CS2023008', name: 'Rahul Joshi', email: 'rahul.j@university.edu', batch: 'CS-2023-A', attendance: 72, gpa: 7.6, avatar: null },
];

// Teacher grading submissions view
export const teacherSubmissions = [
  { id: 'ts1', assignmentId: 'a4', assignmentTitle: 'Dynamic Programming Problems', courseCode: 'CS503',
    studentId: 'CS2023001', studentName: 'Aanya Sharma', submittedAt: '2024-10-06T10:22:00',
    status: 'graded', marks: 20, maxMarks: 25, late: true, feedback: 'Good solutions, edge case missed.' },
  { id: 'ts2', assignmentId: 'a4', assignmentTitle: 'Dynamic Programming Problems', courseCode: 'CS503',
    studentId: 'CS2023002', studentName: 'Rohan Verma', submittedAt: '2024-10-04T18:00:00',
    status: 'graded', marks: 23, maxMarks: 25, late: false, feedback: 'Excellent work.' },
  { id: 'ts3', assignmentId: 'a4', assignmentTitle: 'Dynamic Programming Problems', courseCode: 'CS503',
    studentId: 'CS2023003', studentName: 'Sneha Iyer', submittedAt: '2024-10-05T22:30:00',
    status: 'pending', marks: null, maxMarks: 25, late: false, feedback: null },
  { id: 'ts4', assignmentId: 'a4', assignmentTitle: 'Dynamic Programming Problems', courseCode: 'CS503',
    studentId: 'CS2023004', studentName: 'Karan Singh', submittedAt: null,
    status: 'missing', marks: null, maxMarks: 25, late: false, feedback: null },
  { id: 'ts5', assignmentId: 'a3', assignmentTitle: 'Linear Regression Implementation', courseCode: 'CS502',
    studentId: 'CS2023001', studentName: 'Aanya Sharma', submittedAt: '2024-10-09T16:45:00',
    status: 'graded', marks: 22, maxMarks: 25, late: false, feedback: 'Clean implementation.' },
  { id: 'ts6', assignmentId: 'a3', assignmentTitle: 'Linear Regression Implementation', courseCode: 'CS502',
    studentId: 'CS2023002', studentName: 'Rohan Verma', submittedAt: '2024-10-11T09:00:00',
    status: 'pending', marks: null, maxMarks: 25, late: true, feedback: null },
];

// Classroom attendance (for teacher)
export const classAttendance = [
  { studentId: 'CS2023001', name: 'Aanya Sharma', status: 'present' },
  { studentId: 'CS2023002', name: 'Rohan Verma', status: 'present' },
  { studentId: 'CS2023003', name: 'Sneha Iyer', status: 'absent' },
  { studentId: 'CS2023004', name: 'Karan Singh', status: 'late' },
  { studentId: 'CS2023005', name: 'Nisha Gupta', status: 'present' },
  { studentId: 'CS2023006', name: 'Amit Kumar', status: 'absent' },
  { studentId: 'CS2023007', name: 'Pooja Desai', status: 'present' },
  { studentId: 'CS2023008', name: 'Rahul Joshi', status: 'present' },
];

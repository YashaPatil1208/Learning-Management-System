-- ============================================================
-- LMS Database Schema  —  MySQL 8+
-- Run:  mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS lms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lms;

-- ─── 1. Users ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS User (
  UserID        INT AUTO_INCREMENT PRIMARY KEY,
  FirstName     VARCHAR(100)  NOT NULL,
  LastName      VARCHAR(100)  NOT NULL,
  Email         VARCHAR(255)  NOT NULL UNIQUE,
  PasswordHash  VARCHAR(255)  NOT NULL,
  Role          ENUM('admin','instructor','student') NOT NULL DEFAULT 'student',
  Department    VARCHAR(100),
  Phone         VARCHAR(20),
  Bio           TEXT,
  AvatarURL     VARCHAR(500),
  Github        VARCHAR(255),
  LinkedIn      VARCHAR(255),
  StudentID     VARCHAR(50)   UNIQUE,          -- NULL for non-students
  Batch         VARCHAR(50),
  Semester      TINYINT UNSIGNED,
  GPA           DECIMAL(3,1),
  EmployeeID    VARCHAR(50)   UNIQUE,          -- NULL for non-instructors
  Designation   VARCHAR(100),
  CreatedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_role (Role),
  INDEX idx_user_email (Email)
) ENGINE=InnoDB;

-- ─── 2. Courses ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Course (
  CourseID      INT AUTO_INCREMENT PRIMARY KEY,
  Code          VARCHAR(20)   NOT NULL UNIQUE,
  Name          VARCHAR(255)  NOT NULL,
  Description   TEXT,
  InstructorID  INT,
  Batch         VARCHAR(50),
  Credits       TINYINT UNSIGNED DEFAULT 3,
  Semester      TINYINT UNSIGNED,
  Color         VARCHAR(20)   DEFAULT 'indigo',
  TotalClasses  INT           DEFAULT 0,
  ResourceCount INT           DEFAULT 0,
  CreatedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (InstructorID) REFERENCES User(UserID) ON DELETE SET NULL,
  INDEX idx_course_instructor (InstructorID)
) ENGINE=InnoDB;

-- ─── 3. Enrollments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Enrollment (
  EnrollmentID      INT AUTO_INCREMENT PRIMARY KEY,
  StudentID         INT NOT NULL,
  CourseID          INT NOT NULL,
  Progress          TINYINT UNSIGNED DEFAULT 0,
  AttendancePercent TINYINT UNSIGNED DEFAULT 0,
  Grade             VARCHAR(5),
  EnrolledAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_enrollment (StudentID, CourseID),
  FOREIGN KEY (StudentID) REFERENCES User(UserID) ON DELETE CASCADE,
  FOREIGN KEY (CourseID)  REFERENCES Course(CourseID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 4. Assignments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Assignment (
  AssignmentID   INT AUTO_INCREMENT PRIMARY KEY,
  CourseID       INT NOT NULL,
  Title          VARCHAR(255)  NOT NULL,
  Description    TEXT,
  DueDate        DATE,
  MaxMarks       INT           DEFAULT 100,
  Type           ENUM('code','document','quiz') DEFAULT 'document',
  RequiresGithub BOOLEAN       DEFAULT FALSE,
  Batch          VARCHAR(50),
  CreatedAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 5. Submissions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Submission (
  SubmissionID  INT AUTO_INCREMENT PRIMARY KEY,
  AssignmentID  INT NOT NULL,
  StudentID     INT NOT NULL,
  SubmittedAt   DATETIME,
  Status        ENUM('pending','submitted','graded') DEFAULT 'pending',
  GithubURL     VARCHAR(500),
  FileURL       VARCHAR(500),
  Marks         INT,
  Feedback      TEXT,
  IsLate        BOOLEAN DEFAULT FALSE,

  UNIQUE KEY uq_submission (AssignmentID, StudentID),
  FOREIGN KEY (AssignmentID) REFERENCES Assignment(AssignmentID) ON DELETE CASCADE,
  FOREIGN KEY (StudentID)    REFERENCES User(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 6. Attendance ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Attendance (
  AttendanceID  INT AUTO_INCREMENT PRIMARY KEY,
  CourseID      INT NOT NULL,
  StudentID     INT NOT NULL,
  Date          DATE NOT NULL,
  Status        ENUM('present','absent','late') NOT NULL DEFAULT 'present',

  UNIQUE KEY uq_attendance (CourseID, StudentID, Date),
  FOREIGN KEY (CourseID)  REFERENCES Course(CourseID) ON DELETE CASCADE,
  FOREIGN KEY (StudentID) REFERENCES User(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 7. Timetable (Class Sessions) ─────────────────────────
CREATE TABLE IF NOT EXISTS ClassSession (
  SessionID    INT AUTO_INCREMENT PRIMARY KEY,
  CourseID     INT NOT NULL,
  DayOfWeek    ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  StartTime    TIME NOT NULL,
  EndTime      TIME NOT NULL,
  RoomLocation VARCHAR(100),
  Type         ENUM('lecture','lab','tutorial') DEFAULT 'lecture',

  FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 8. Grades ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Grade (
  GradeID         INT AUTO_INCREMENT PRIMARY KEY,
  StudentID       INT NOT NULL,
  CourseID        INT NOT NULL,
  AssessmentType  VARCHAR(50)   NOT NULL,
  AssessmentName  VARCHAR(255)  NOT NULL,
  Score           DECIMAL(6,2),
  MaxScore        DECIMAL(6,2)  NOT NULL,
  Date            DATE,

  FOREIGN KEY (StudentID) REFERENCES User(UserID) ON DELETE CASCADE,
  FOREIGN KEY (CourseID)  REFERENCES Course(CourseID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 9. Notifications ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS Notification (
  NotificationID  INT AUTO_INCREMENT PRIMARY KEY,
  UserID          INT NOT NULL,
  Type            VARCHAR(50)   DEFAULT 'General',
  Title           VARCHAR(255),
  Message         TEXT,
  IsRead          BOOLEAN       DEFAULT FALSE,
  Link            VARCHAR(500),
  CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
  INDEX idx_notif_user (UserID)
) ENGINE=InnoDB;

-- ─── 10. Announcements ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS Announcement (
  AnnouncementID  INT AUTO_INCREMENT PRIMARY KEY,
  CourseID        INT,
  AuthorID        INT NOT NULL,
  Title           VARCHAR(255)  NOT NULL,
  Body            TEXT,
  CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (CourseID)  REFERENCES Course(CourseID) ON DELETE SET NULL,
  FOREIGN KEY (AuthorID)  REFERENCES User(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 11. Questions (Q&A) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS Question (
  QuestionID  INT AUTO_INCREMENT PRIMARY KEY,
  CourseID    INT NOT NULL,
  AuthorID    INT NOT NULL,
  Title       VARCHAR(500)  NOT NULL,
  Body        TEXT,
  Upvotes     INT DEFAULT 0,
  CreatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (CourseID)  REFERENCES Course(CourseID) ON DELETE CASCADE,
  FOREIGN KEY (AuthorID)  REFERENCES User(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 12. Answers ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Answer (
  AnswerID    INT AUTO_INCREMENT PRIMARY KEY,
  QuestionID  INT NOT NULL,
  AuthorID    INT NOT NULL,
  Body        TEXT NOT NULL,
  Upvotes     INT DEFAULT 0,
  IsOfficial  BOOLEAN DEFAULT FALSE,
  CreatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID) ON DELETE CASCADE,
  FOREIGN KEY (AuthorID)   REFERENCES User(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 13. Resources ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Resource (
  ResourceID  INT AUTO_INCREMENT PRIMARY KEY,
  CourseID    INT NOT NULL,
  Name        VARCHAR(255)  NOT NULL,
  Type        VARCHAR(20),
  Category    VARCHAR(100),
  UploadDate  DATE,
  Size        VARCHAR(20),
  URL         VARCHAR(500),

  FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
) ENGINE=InnoDB;

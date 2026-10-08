import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import Login from './pages/auth/Login';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import CourseDetails from './pages/student/CourseDetails';
import StudentAssignments from './pages/student/Assignments';
import StudentAttendance from './pages/student/Attendance';
import StudentTimetable from './pages/student/Timetable';
import StudentGrades from './pages/student/Grades';
import QnA from './pages/student/QnA';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherGrading from './pages/teacher/Grading';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherStudents from './pages/teacher/Students';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  const userRole = (currentUser.role === 'instructor' || currentUser.role === 'teacher') ? 'teacher' : (currentUser.role === 'admin' ? 'admin' : 'student');
  const targetAllowed = (allowedRole === 'instructor' || allowedRole === 'teacher') ? 'teacher' : allowedRole;

  if (targetAllowed && userRole !== targetAllowed && userRole !== 'admin') {
    return <Navigate to={`/${userRole === 'teacher' ? 'teacher' : 'student'}/dashboard`} replace />;
  }
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute allowedRole="student"><StudentCourses /></ProtectedRoute>} />
            <Route path="/student/courses/:courseId" element={<ProtectedRoute allowedRole="student"><CourseDetails /></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute allowedRole="student"><StudentAssignments /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRole="student"><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><StudentTimetable /></ProtectedRoute>} />
            <Route path="/student/grades" element={<ProtectedRoute allowedRole="student"><StudentGrades /></ProtectedRoute>} />
            <Route path="/student/qa" element={<ProtectedRoute><QnA /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/courses" element={<ProtectedRoute allowedRole="teacher"><TeacherCourses /></ProtectedRoute>} />
            <Route path="/teacher/assignments" element={<ProtectedRoute allowedRole="teacher"><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/teacher/grading" element={<ProtectedRoute allowedRole="teacher"><TeacherGrading /></ProtectedRoute>} />
            <Route path="/teacher/attendance" element={<ProtectedRoute allowedRole="teacher"><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute allowedRole="teacher"><TeacherStudents /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

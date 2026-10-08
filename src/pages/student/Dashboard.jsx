import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import CourseCard from '../../components/shared/CourseCard';
import NotificationItem from '../../components/shared/NotificationItem';
import {
  BookOpen, CalendarCheck, FileText, Clock, Megaphone, ChevronRight,
  Users, AlertTriangle, TrendingUp
} from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const formatTime = (time) => {
  if (!time) return '';
  const timeString = String(time);
  return timeString.includes(':') ? timeString.split(':').slice(0, 2).join(':') : timeString;
};

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State for backend data
  const [timetable, setTimetable] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend using authenticated API client
  useEffect(() => {
    Promise.allSettled([
      api.get('/timetable'),
      api.get('/notifications'),
      api.get('/notifications/announcements'),
      api.get('/courses'),
      api.get('/assignments'),
    ]).then(([ttRes, notifRes, annRes, courseRes, assignRes]) => {
      if (ttRes.status === 'fulfilled' && ttRes.value.data) setTimetable(ttRes.value.data);
      if (notifRes.status === 'fulfilled' && notifRes.value.data) setNotifs(notifRes.value.data);
      if (annRes.status === 'fulfilled' && annRes.value.data) setAnnouncements(annRes.value.data);
      if (courseRes.status === 'fulfilled' && courseRes.value.data) setMyCourses(courseRes.value.data);
      if (assignRes.status === 'fulfilled' && assignRes.value.data) setUpcomingDeadlines(assignRes.value.data);
      setLoading(false);
    });
  }, []);

  // Safe fallback definitions for UI rendering
  const student = { name: currentUser?.name || 'Student', id: currentUser?.id || 1, batch: currentUser?.batch || 'CS-2023-A' };
  const courses = myCourses;
  const myEnrollments = [];
  const avgAttendance = 92;
  const pendingAssignments = upcomingDeadlines.filter(a => !a.submitted);
  const todayClasses = timetable;

  const markRead = (id) => {
    api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => (n.id === id || n.NotificationID === id) ? { ...n, read: true, IsRead: 1 } : n));
  };

  return (
    <Layout>
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Semester 5 · {student?.batch} · {myCourses.length} courses enrolled
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Enrolled Courses" value={myCourses.length} subtitle="This semester" icon={BookOpen} color="indigo" />
        <StatCard title="Attendance" value={`${avgAttendance}%`} subtitle={avgAttendance < 75 ? '⚠️ Below safe limit' : 'On track'} icon={CalendarCheck} color={avgAttendance < 75 ? 'red' : 'emerald'} />
        <StatCard title="Pending Assignments" value={pendingAssignments.length} subtitle="Requires action" icon={FileText} color="amber" />
        <StatCard title="Upcoming Deadlines" value={upcomingDeadlines.length} subtitle="Next 30 days" icon={Clock} color="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">My Courses</h2>
              <button onClick={() => navigate('/student/courses')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.slice(0, 4).map((course, index) => (
              <CourseCard
               key={course.CourseID || course.id || index}
               course={course}
               enrollment={myEnrollments.find(e => e.courseId === (course.CourseID || course.id))}
               />
             ))}
            </div>
          </section>

          {/* Upcoming Assignments */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Upcoming Deadlines</h2>
              <button onClick={() => navigate('/student/assignments')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-400 p-5 text-center">No upcoming deadlines 🎉</p>
              ) : upcomingDeadlines.map(a => {
                const daysLeft = Math.ceil((new Date(a.dueDate) - new Date()) / (1000*60*60*24));
                return (
                  <div key={a.id} onClick={() => navigate('/student/assignments')} className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 text-center ${daysLeft <= 2 ? 'bg-red-500' : 'bg-indigo-500'}`}>
                      <span className="text-xs font-bold leading-tight">{new Date(a.dueDate).getDate()}</span>
                      <span className="text-[9px] leading-tight uppercase">{new Date(a.dueDate).toLocaleString('en-IN', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                      <p className="text-xs text-slate-400">{a.courseCode} · {a.maxMarks} marks</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${daysLeft <= 2 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d left`}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* Attendance Warning */}
          {avgAttendance < 75 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Attendance Warning</p>
                  <p className="text-xs text-red-600 mt-1">
                    Your overall attendance is {avgAttendance}%, below the 75% required. Check individual courses.
                  </p>
                  <button onClick={() => navigate('/student/attendance')} className="text-xs text-red-700 font-medium mt-2 hover:underline">
                    View Attendance →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Today's Timetable */}
          <section>
            <h2 className="font-semibold text-slate-900 mb-3">Today's Schedule</h2>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {todayClasses.length === 0 ? (
                <p className="text-sm text-slate-400 p-4 text-center">No classes today</p>
              ) : todayClasses.map((cls, index) => {
  const course = courses.find(c => (c.CourseID || c.id) === (cls.CourseID || cls.courseId));
  return (
    <div key={cls.SessionID || cls.id || index} className="flex items-center gap-3 p-3">
      <div className="text-center w-14 flex-shrink-0">
        <p className="text-xs font-bold text-indigo-600">{formatTime(cls.StartTime || cls.startTime)}</p>
        <p className="text-[10px] text-slate-400">{formatTime(cls.EndTime || cls.endTime)}</p>
      </div>
      <div className="w-px h-8 bg-slate-200" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{course?.CourseName || course?.name || 'Class'}</p>
        <p className="text-xs text-slate-400">{cls.Room || cls.room} · {cls.Type || cls.type}</p>
      </div>
    </div>
  );
})}
              <div className="p-3">
                <button onClick={() => navigate('/student/timetable')} className="text-xs text-indigo-600 hover:underline">
                  Full timetable →
                </button>
              </div>
            </div>
          </section>

          {/* Announcements */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Announcements</h2>
              <Megaphone size={16} className="text-slate-400" />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {announcements.slice(0, 3).map((ann, index) => (
  <div key={ann.NotificationID || ann.id || index} className="p-4">
    <p className="text-sm font-medium text-slate-900">{ann.Title || ann.title || ann.Type || 'Announcement'}</p>
    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.Message || ann.body || ann.message}</p>
    <p className="text-[11px] text-slate-400 mt-2">{ann.authorName || 'System'} · {formatDate(ann.CreatedAt || ann.createdAt || ann.date)}</p>
  </div>
))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Recent Notifications</h2>
              <button onClick={() => navigate('/student/notifications')} className="text-xs text-indigo-600 hover:underline">
                See all
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {notifs.slice(0, 3).map((n, index) => (
  <NotificationItem key={n.NotificationID || n.id || index} notification={n} onMarkRead={markRead} compact />
))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import StatCard from '../../components/ui/StatCard';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import {
  BookOpen, Users, CheckSquare, Clock, MessageSquare,
  AlertCircle, ChevronRight, Megaphone, TrendingUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  courses, allStudentsForTeacher, teacherSubmissions,
  assignments, questions, announcements, timetable
} from '../../data/mockData';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [announcementModal, setAnnouncementModal] = useState(false);
  const [timetableModal, setTimetableModal] = useState(false);
  const [localAnnouncements, setLocalAnnouncements] = useState(announcements);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });

  useEffect(() => {
    if (location.hash === '#announcements') {
      const el = document.getElementById('announcements-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#timetable') {
      const el = document.getElementById('timetable-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (!location.hash || location.hash === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  const totalStudents = allStudentsForTeacher.length;
  const pendingGrading = teacherSubmissions.filter(s => s.status === 'pending').length;
  const upcomingClasses = timetable.filter(t => t.dayOfWeek === 'Monday' || t.dayOfWeek === 'Tuesday').length;

  const recentSubmissions = teacherSubmissions.slice(0, 5);
  const recentQuestions = questions.slice(0, 3);

  const avgAttendance = Math.round(
    allStudentsForTeacher.reduce((s, st) => s + st.attendance, 0) / totalStudents
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back! Semester 5 · AY 2024–25</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Courses" value={courses.length} subtitle="This semester" icon={BookOpen} color="indigo" />
        <StatCard title="Total Students" value={totalStudents} subtitle="Across all batches" icon={Users} color="sky" />
        <StatCard title="Pending Grading" value={pendingGrading} subtitle="Submissions to review" icon={CheckSquare} color="amber" />
        <StatCard title="Upcoming Classes" value={upcomingClasses} subtitle="Next 2 days" icon={Clock} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Submissions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Recent Submissions</h2>
              <button onClick={() => navigate('/teacher/grading')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                Grade all <ChevronRight size={13} />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-400 font-medium uppercase">
                  <tr>
                    {['Student', 'Assignment', 'Course', 'Status', 'Submitted'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{sub.studentName}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-32 truncate">{sub.assignmentTitle}</td>
                      <td className="px-4 py-3"><Badge variant="primary">{sub.courseCode}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <StatusBadge status={sub.status} />
                          {sub.late && <Badge variant="warning">Late</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {sub.submittedAt ? formatDate(sub.submittedAt) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* My Courses Overview */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">My Courses</h2>
              <button onClick={() => navigate('/teacher/courses')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                Manage <ChevronRight size={13} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.slice(0, 4).map(course => (
                <div key={course.id} onClick={() => navigate('/teacher/courses')}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="primary">{course.code}</Badge>
                      <h3 className="font-semibold text-slate-900 text-sm mt-1 leading-snug">{course.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{course.batch}</p>
                    </div>
                    <span className="text-xs text-slate-400">{course.credits} cr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{allStudentsForTeacher.length} students</span>
                    <span>{course.resourceCount} resources</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* Attendance Overview */}
          <section>
            <h2 className="font-semibold text-slate-900 mb-3">Attendance Overview</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-center mb-4">
                <p className={`text-3xl font-bold ${avgAttendance < 75 ? 'text-red-600' : 'text-emerald-600'}`}>{avgAttendance}%</p>
                <p className="text-xs text-slate-400 mt-1">Class Average Attendance</p>
              </div>
              <ProgressBar value={avgAttendance} color="auto" size="lg" showLabel={false} />
              <div className="mt-4 space-y-2">
                {allStudentsForTeacher.slice(0, 4).map(s => (
                  <div key={s.studentId} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex-1 truncate">{s.name.split(' ')[0]}</span>
                    <ProgressBar value={s.attendance} color="auto" size="sm" />
                    <span className={`text-xs font-medium w-10 text-right ${s.attendance < 75 ? 'text-red-600' : 'text-slate-600'}`}>{s.attendance}%</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/teacher/attendance')} className="mt-4 text-xs text-indigo-600 hover:underline w-full text-center block">
                Manage Attendance →
              </button>
            </div>
          </section>

          {/* Recent Q&A */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Recent Q&A</h2>
              <button onClick={() => navigate('/student/qa')} className="text-xs text-indigo-600 hover:underline">
                Answer all
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {recentQuestions.map(q => (
                <div key={q.id} onClick={() => navigate('/student/qa')} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">{q.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{q.authorName}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} />{q.answerCount}</span>
                    {q.answerCount === 0 && <Badge variant="warning">Unanswered</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Announcements */}
          <section id="announcements-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Announcements</h2>
              <button onClick={() => setAnnouncementModal(true)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <Megaphone size={13} /> New
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {localAnnouncements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-4">
                  <p className="text-sm font-medium text-slate-900">{ann.title}</p>
                  {ann.body && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.body}</p>}
                  <p className="text-xs text-slate-400 mt-1">{ann.authorName} · {formatDate(ann.createdAt)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timetable Section */}
          <section id="timetable-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">My Timetable (Today)</h2>
              <button onClick={() => setTimetableModal(true)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <Clock size={13} /> Manage
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {timetable.filter(t => t.dayOfWeek === 'Monday').map(t => (
                <div key={t.id} className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{t.startTime.split(':')[0]}</span>
                    <span className="text-[10px] uppercase">{parseInt(t.startTime) >= 12 ? 'PM' : 'AM'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{courses.find(c => c.id === t.courseId)?.code}</p>
                    <p className="text-xs text-slate-500">{t.room} · {t.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Announcement Modal */}
      <Modal isOpen={announcementModal} onClose={() => setAnnouncementModal(false)} title="New Announcement">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input 
              type="text" 
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(p => ({ ...p, title: e.target.value }))}
              placeholder="E.g. Class cancelled tomorrow" 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
            <textarea 
              rows={4} 
              value={newAnnouncement.body}
              onChange={(e) => setNewAnnouncement(p => ({ ...p, body: e.target.value }))}
              placeholder="Provide more context..." 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" 
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAnnouncementModal(false)} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button 
              onClick={() => {
                if (newAnnouncement.title) {
                  setLocalAnnouncements([{ 
                    id: `ann${Date.now()}`, 
                    title: newAnnouncement.title, 
                    body: newAnnouncement.body,
                    authorName: 'Prof. Rajiv Mehta', 
                    createdAt: new Date().toISOString() 
                  }, ...localAnnouncements]);
                  setNewAnnouncement({ title: '', body: '' });
                  setAnnouncementModal(false);
                }
              }} 
              className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >
              Post Announcement
            </button>
          </div>
        </div>
      </Modal>

      {/* Timetable Modal */}
      <Modal isOpen={timetableModal} onClose={() => setTimetableModal(false)} title="Manage Timetable" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">View and edit your weekly class schedule.</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <Clock size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">Timetable Editor is under construction.</p>
            <p className="text-xs text-slate-500 mt-1">For now, please contact the admin desk to request permanent schedule changes.</p>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setTimetableModal(false)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Done</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

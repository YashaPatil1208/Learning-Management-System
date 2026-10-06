import Layout from '../../components/layout/Layout';
import ProgressBar from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/Badge';
import { attendance, courses, enrollments, students } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown } from 'lucide-react';

export default function Attendance() {
  const { currentUser } = useAuth();
  const student = students.find(s => s.userId === currentUser?.id);
  const myEnrollments = enrollments.filter(e => e.studentId === student?.id);
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));

  const myAttendance = attendance.filter(a => a.studentId === student?.id);

  const getCourseStats = (courseId) => {
    const records = myAttendance.filter(a => a.courseId === courseId);
    const present = records.filter(a => a.status === 'present').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const late = records.filter(a => a.status === 'late').length;
    const total = records.length;
    const pct = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { present, absent, late, total, pct, records };
  };

  const overallPct = Math.round(
    myEnrollments.reduce((sum, e) => sum + e.attendancePercent, 0) / (myEnrollments.length || 1)
  );

  const totalPresent = myAttendance.filter(a => a.status === 'present').length;
  const totalAbsent = myAttendance.filter(a => a.status === 'absent').length;
  const totalLate = myAttendance.filter(a => a.status === 'late').length;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track your attendance across all courses</p>
      </div>

      {/* Warning */}
      {overallPct < 75 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Attendance Below Required Threshold</p>
            <p className="text-sm text-red-600 mt-1">
              Your overall attendance is <strong>{overallPct}%</strong>. Minimum required is <strong>75%</strong>.
              You may be debarred from exams if this is not improved. Please consult your academic advisor.
            </p>
          </div>
        </div>
      )}

      {/* Overall stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className={`bg-white rounded-xl border p-5 text-center ${overallPct < 75 ? 'border-red-200' : 'border-emerald-200'}`}>
          <p className={`text-3xl font-bold ${overallPct < 75 ? 'text-red-600' : 'text-emerald-600'}`}>{overallPct}%</p>
          <p className="text-xs text-slate-500 mt-1">Overall Attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600 flex items-center justify-center gap-2">
            <CheckCircle size={24} /> {totalPresent}
          </p>
          <p className="text-xs text-slate-500 mt-1">Classes Present</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-red-500 flex items-center justify-center gap-2">
            <XCircle size={24} /> {totalAbsent}
          </p>
          <p className="text-xs text-slate-500 mt-1">Classes Absent</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500 flex items-center justify-center gap-2">
            <Clock size={24} /> {totalLate}
          </p>
          <p className="text-xs text-slate-500 mt-1">Classes Late</p>
        </div>
      </div>

      {/* Per-course */}
      <h2 className="font-semibold text-slate-900 mb-4">Attendance by Course</h2>
      <div className="space-y-4">
        {myCourses.map(course => {
          const stats = getCourseStats(course.id);
          const warn = stats.pct < 75;
          return (
            <div key={course.id} className={`bg-white rounded-xl border p-5 ${warn ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{course.code}</span>
                    {warn && <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><AlertTriangle size={11} /> Low Attendance</span>}
                  </div>
                  <h3 className="font-semibold text-slate-900">{course.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{course.teacherName}</p>
                </div>
                <div className={`text-2xl font-bold px-4 py-2 rounded-xl ${warn ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                  {stats.pct}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <ProgressBar value={stats.pct} color="auto" size="lg" />
                {warn && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <TrendingDown size={11} /> Need {Math.ceil(stats.total * 0.75) - (stats.present + Math.floor(stats.late * 0.5))} more classes to reach 75%
                  </p>
                )}
              </div>

              {/* Stats row */}
              <div className="flex gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle size={14} /> {stats.present} Present
                </span>
                <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                  <XCircle size={14} /> {stats.absent} Absent
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                  <Clock size={14} /> {stats.late} Late
                </span>
                <span className="ml-auto text-xs text-slate-400">{stats.total} total classes</span>
              </div>

              {/* Recent records */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500 mb-2">Recent Records</p>
                <div className="flex flex-wrap gap-2">
                  {stats.records.slice(0, 12).map(r => (
                    <div
                      key={r.id}
                      title={`${r.date} — ${r.status}`}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-default ${
                        r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {new Date(r.date).getDate()}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Each cell = one class day · Hover to see date</p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

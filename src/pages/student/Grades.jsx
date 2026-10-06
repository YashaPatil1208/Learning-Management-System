import Layout from '../../components/layout/Layout';
import ProgressBar from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { grades, courses, enrollments, students } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Award, TrendingUp } from 'lucide-react';

const getLetterGrade = (pct) => {
  if (pct === null || pct === undefined) return '—';
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 75) return 'A-';
  if (pct >= 70) return 'B+';
  if (pct >= 65) return 'B';
  if (pct >= 60) return 'B-';
  if (pct >= 55) return 'C+';
  if (pct >= 50) return 'C';
  return 'F';
};

const gradeVariant = (pct) => {
  if (pct === null) return 'default';
  if (pct >= 75) return 'success';
  if (pct >= 50) return 'warning';
  return 'danger';
};

export default function Grades() {
  const { currentUser } = useAuth();
  const student = students.find(s => s.userId === currentUser?.id);
  const myEnrollments = enrollments.filter(e => e.studentId === student?.id);
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));
  const myGrades = grades.filter(g => g.studentId === student?.id);

  const getCourseGrades = (courseId) => myGrades.filter(g => g.courseId === courseId);

  const getCourseTotal = (courseId) => {
    const cg = getCourseGrades(courseId).filter(g => g.score !== null);
    if (cg.length === 0) return null;
    const score = cg.reduce((s, g) => s + g.score, 0);
    const max = cg.reduce((s, g) => s + g.maxScore, 0);
    return { score, max, pct: Math.round((score / max) * 100) };
  };

  // Overall GPA-like
  const totals = myCourses.map(c => getCourseTotal(c.id)).filter(Boolean);
  const overallPct = totals.length > 0
    ? Math.round(totals.reduce((s, t) => s + t.pct, 0) / totals.length)
    : null;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Grades</h1>
        <p className="text-sm text-slate-500 mt-0.5">Semester 5 academic performance</p>
      </div>

      {/* Overall card */}
      {overallPct !== null && (
        <div className="mb-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white flex items-center gap-6">
          <div>
            <p className="text-sm opacity-80">Overall Performance</p>
            <p className="text-5xl font-bold mt-1">{overallPct}%</p>
            <p className="text-sm opacity-80 mt-1">Grade: <span className="font-bold">{getLetterGrade(overallPct)}</span></p>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              {myCourses.slice(0, 4).map(c => {
                const total = getCourseTotal(c.id);
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-xs opacity-70 w-16 truncate">{c.code}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-1.5">
                      <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${total?.pct ?? 0}%` }} />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">{total?.pct ?? '?'}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Award size={48} className="opacity-20" />
        </div>
      )}

      {/* Per-course grade tables */}
      <div className="space-y-6">
        {myCourses.map(course => {
          const cg = getCourseGrades(course.id);
          const total = getCourseTotal(course.id);
          return (
            <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Course header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-indigo-600">{course.code}</span>
                    {total && <Badge variant={gradeVariant(total.pct)}>{getLetterGrade(total.pct)}</Badge>}
                  </div>
                  <h3 className="font-semibold text-slate-900">{course.name}</h3>
                </div>
                {total && (
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{total.score}/{total.max}</p>
                    <p className="text-sm text-slate-400">{total.pct}%</p>
                  </div>
                )}
              </div>
              {/* Grades table */}
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-400 font-medium uppercase tracking-wide">
                  <tr>
                    {['Assessment', 'Type', 'Score', 'Max Marks', 'Percentage', 'Grade'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cg.map(g => {
                    const pct = g.score !== null ? Math.round((g.score / g.maxScore) * 100) : null;
                    return (
                      <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-800">{g.assessmentName}</td>
                        <td className="px-5 py-3">
                          <Badge variant={g.assessmentType === 'Mid-Sem' ? 'warning' : g.assessmentType === 'Quiz' ? 'sky' : 'primary'}>
                            {g.assessmentType}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 font-semibold">{g.score ?? <span className="text-slate-300">—</span>}</td>
                        <td className="px-5 py-3 text-slate-400">{g.maxScore}</td>
                        <td className="px-5 py-3">
                          {pct !== null ? (
                            <div className="flex items-center gap-2 min-w-24">
                              <ProgressBar value={pct} color="auto" size="sm" />
                              <span className="text-xs text-slate-600 w-10 flex-shrink-0">{pct}%</span>
                            </div>
                          ) : <span className="text-slate-300 text-xs">Pending</span>}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={gradeVariant(pct)}>{getLetterGrade(pct)}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import TabBar from '../../components/ui/TabBar';
import ProgressBar from '../../components/ui/ProgressBar';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import ResourceItem from '../../components/shared/ResourceItem';
import AssignmentCard from '../../components/shared/AssignmentCard';
import Modal from '../../components/ui/Modal';
import {
  courses, enrollments, resources, assignments, submissions,
  grades, questions, answers, students
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, User, Users, BookOpen, Calendar, MessageSquare,
  ThumbsUp, Send, Plus, CheckCircle
} from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: BookOpen },
  { key: 'resources', label: 'Resources', icon: BookOpen },
  { key: 'assignments', label: 'Assignments', icon: Calendar },
  { key: 'qa', label: 'Q&A', icon: MessageSquare },
  { key: 'grades', label: 'Grades', icon: CheckCircle },
];

const RESOURCE_CATEGORIES = ['Syllabus', 'Lecture Notes', 'Previous Year Questions', 'Reference Material'];

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState('overview');
  const [submitModal, setSubmitModal] = useState(null);
  const [submitData, setSubmitData] = useState({ githubUrl: '', file: null, note: '' });
  const [submitted, setSubmitted] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const student = students.find(s => s.userId === currentUser?.id);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === student?.id);
  const courseResources = resources.filter(r => r.courseId === courseId);
  const courseAssignments = assignments.filter(a => a.courseId === courseId);
  const courseGrades = grades.filter(g => g.courseId === courseId && g.studentId === student?.id);
  const courseQuestions = questions.filter(q => q.courseId === courseId);

  if (!course) return (
    <Layout>
      <div className="text-center py-20">
        <p className="text-slate-400">Course not found.</p>
        <button onClick={() => navigate('/student/courses')} className="mt-4 text-indigo-600 hover:underline text-sm">← Back to courses</button>
      </div>
    </Layout>
  );

  const getSubmission = (assignmentId) => submissions.find(s => s.assignmentId === assignmentId && s.studentId === student?.id);

  const colorAccentMap = {
    indigo: 'bg-indigo-600',
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitModal(null);
      setSubmitted(false);
      setSubmitData({ githubUrl: '', file: null, note: '' });
    }, 2000);
  };

  const totalScore = courseGrades.reduce((sum, g) => sum + (g.score || 0), 0);
  const totalMax = courseGrades.reduce((sum, g) => sum + g.maxScore, 0);
  const gradePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : null;

  return (
    <Layout>
      {/* Back button */}
      <button
        onClick={() => navigate('/student/courses')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className={`h-2 ${colorAccentMap[course.color] || 'bg-indigo-600'} w-full`} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">{course.code}</Badge>
                <Badge variant="default">{course.batch}</Badge>
                <Badge variant="default">{course.credits} Credits</Badge>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{course.name}</h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <User size={14} /> {course.teacherName}
              </p>
              <p className="text-sm text-slate-600 mt-3 max-w-2xl leading-relaxed">{course.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-2xl font-bold text-indigo-600">{enrollment?.progress ?? 0}%</p>
                <p className="text-xs text-slate-500 mt-1">Progress</p>
              </div>
              <div className={`text-center p-4 rounded-xl border ${(enrollment?.attendancePercent ?? 0) < 75 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <p className={`text-2xl font-bold ${(enrollment?.attendancePercent ?? 0) < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {enrollment?.attendancePercent ?? 0}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Attendance</p>
              </div>
            </div>
          </div>
        </div>
        <TabBar
          tabs={TABS.map(t => ({
            ...t,
            count: t.key === 'resources' ? courseResources.length
              : t.key === 'assignments' ? courseAssignments.length
              : t.key === 'qa' ? courseQuestions.length
              : t.key === 'grades' ? courseGrades.filter(g => g.score !== null).length
              : undefined
          }))}
          activeTab={tab}
          onTabChange={setTab}
        />
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Course Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Overall Progress</span>
                  <span className="font-medium text-indigo-600">{enrollment?.progress ?? 0}%</span>
                </div>
                <ProgressBar value={enrollment?.progress ?? 0} color="indigo" size="lg" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Attendance</span>
                  <span className={`font-medium ${(enrollment?.attendancePercent ?? 0) < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {enrollment?.attendancePercent ?? 0}%
                  </span>
                </div>
                <ProgressBar value={enrollment?.attendancePercent ?? 0} color="auto" size="lg" />
              </div>
              {gradePercent !== null && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Grade Score</span>
                    <span className="font-medium text-slate-700">{gradePercent}%</span>
                  </div>
                  <ProgressBar value={gradePercent} color="auto" size="lg" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Resources', value: courseResources.length },
                { label: 'Assignments', value: courseAssignments.length },
                { label: 'Questions', value: courseQuestions.length },
                { label: 'Grades Recorded', value: courseGrades.filter(g => g.score !== null).length },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES */}
      {tab === 'resources' && (
        <div className="space-y-5">
          {RESOURCE_CATEGORIES.map(cat => {
            const catResources = courseResources.filter(r => r.category === cat);
            if (catResources.length === 0) return null;
            return (
              <div key={cat} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-1">{cat}</h3>
                <p className="text-xs text-slate-400 mb-4">{catResources.length} item{catResources.length !== 1 ? 's' : ''}</p>
                <div className="divide-y divide-slate-100">
                  {catResources.map(r => <ResourceItem key={r.id} resource={r} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ASSIGNMENTS */}
      {tab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courseAssignments.map(a => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              submission={getSubmission(a.id)}
              onSubmit={(a) => setSubmitModal(a)}
            />
          ))}
        </div>
      )}

      {/* Q&A */}
      {tab === 'qa' && (
        <div className="space-y-4">
          {courseQuestions.map(q => {
            const qAnswers = answers.filter(a => a.questionId === q.id);
            const officialAns = qAnswers.find(a => a.isOfficial);
            return (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {q.authorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{q.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{q.authorName} · {new Date(q.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{q.body}</p>
                    <div className="flex gap-3 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {q.upvotes}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {q.answerCount} answers</span>
                    </div>
                    {officialAns && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">✓ Official Answer by {officialAns.authorName}</p>
                        <p className="text-xs text-emerald-700 line-clamp-3">{officialAns.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GRADES */}
      {tab === 'grades' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Grade Record</h3>
            {gradePercent !== null && (
              <p className="text-sm text-slate-500 mt-1">
                Total: <span className="font-semibold text-indigo-600">{totalScore}/{totalMax}</span> ({gradePercent}%)
              </p>
            )}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 font-medium uppercase tracking-wide">
              <tr>
                {['Assessment', 'Type', 'Score', 'Max', '%', 'Grade'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseGrades.map(g => {
                const pct = g.score !== null ? Math.round((g.score / g.maxScore) * 100) : null;
                const grade = pct === null ? '—' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'F';
                return (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-800">{g.assessmentName}</td>
                    <td className="px-5 py-3"><Badge variant="primary">{g.assessmentType}</Badge></td>
                    <td className="px-5 py-3">{g.score ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-400">{g.maxScore}</td>
                    <td className="px-5 py-3">
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={pct} color="auto" size="sm" />
                          <span className="text-xs text-slate-600 w-10">{pct}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={pct >= 80 ? 'success' : pct >= 60 ? 'warning' : pct !== null ? 'danger' : 'default'}>
                        {grade}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Assignment Modal */}
      <Modal isOpen={!!submitModal} onClose={() => { setSubmitModal(null); setSubmitted(false); }} title={`Submit: ${submitModal?.title}`} size="md">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-900">Assignment Submitted!</p>
            <p className="text-sm text-slate-500 mt-1">Your submission has been recorded.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, ZIP up to 50MB</p>
              </div>
            </div>
            {submitModal?.requiresGithub && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub Repository URL</label>
                <input
                  type="url"
                  value={submitData.githubUrl}
                  onChange={(e) => setSubmitData(p => ({ ...p, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (optional)</label>
              <textarea
                rows={3}
                value={submitData.note}
                onChange={(e) => setSubmitData(p => ({ ...p, note: e.target.value }))}
                placeholder="Any notes for the grader..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSubmitModal(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Send size={15} /> Submit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

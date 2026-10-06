import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import AssignmentCard from '../../components/shared/AssignmentCard';
import Modal from '../../components/ui/Modal';
import { assignments, submissions, students, courses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Send, Filter } from 'lucide-react';

const FILTERS = ['All', 'Upcoming', 'Submitted', 'Overdue', 'Graded'];

export default function Assignments() {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [submitModal, setSubmitModal] = useState(null);
  const [submitData, setSubmitData] = useState({ githubUrl: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const student = students.find(s => s.userId === currentUser?.id);

  const getSubmission = (assignmentId) =>
    submissions.find(s => s.assignmentId === assignmentId && s.studentId === student?.id);

  const getStatus = (assignment) => {
    const sub = getSubmission(assignment.id);
    if (!sub) return new Date(assignment.dueDate) < new Date() ? 'overdue' : 'pending';
    return sub.status;
  };

  const filterMap = {
    'All': () => true,
    'Upcoming': (a) => ['pending'].includes(getStatus(a)) && new Date(a.dueDate) >= new Date(),
    'Submitted': (a) => getStatus(a) === 'submitted',
    'Overdue': (a) => getStatus(a) === 'overdue',
    'Graded': (a) => getStatus(a) === 'graded',
  };

  const filtered = assignments.filter(filterMap[activeFilter] || (() => true));

  const counts = {
    Upcoming: assignments.filter(filterMap['Upcoming']).length,
    Submitted: assignments.filter(filterMap['Submitted']).length,
    Overdue: assignments.filter(filterMap['Overdue']).length,
    Graded: assignments.filter(filterMap['Graded']).length,
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitModal(null); setSubmitted(false); setSubmitData({ githubUrl: '', note: '' }); }, 2000);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Assignments</h1>
        <p className="text-sm text-slate-500 mt-0.5">{assignments.length} total assignments this semester</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Upcoming', count: counts.Upcoming, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Submitted', count: counts.Submitted, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Overdue', count: counts.Overdue, color: 'text-red-600 bg-red-50 border-red-100' },
          { label: 'Graded', count: counts.Graded, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setActiveFilter(s.label)}
            className={`${s.color} border rounded-xl p-4 text-left hover:shadow-sm transition-all ${activeFilter === s.label ? 'ring-2 ring-offset-1 ring-current' : ''}`}
          >
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {f} {f !== 'All' && counts[f] !== undefined ? `(${counts[f]})` : ''}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p>No {activeFilter.toLowerCase()} assignments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(a => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              submission={getSubmission(a.id)}
              onSubmit={(a) => setSubmitModal(a)}
            />
          ))}
        </div>
      )}

      {/* Submit Modal */}
      <Modal isOpen={!!submitModal} onClose={() => { setSubmitModal(null); setSubmitted(false); }} title={`Submit: ${submitModal?.title}`}>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  GitHub Repository URL <span className="text-red-500">*</span>
                </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes for Grader</label>
              <textarea
                rows={3}
                value={submitData.note}
                onChange={(e) => setSubmitData(p => ({ ...p, note: e.target.value }))}
                placeholder="Any notes..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSubmitModal(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Send size={15} /> Submit Assignment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

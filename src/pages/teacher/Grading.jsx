import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { teacherSubmissions } from '../../data/mockData';
import { Filter, Search, CheckCircle, Clock } from 'lucide-react';

export default function GradingDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeModal, setGradeModal] = useState(null);

  const filtered = teacherSubmissions.filter(sub => {
    const matchSearch = sub.studentName.toLowerCase().includes(search.toLowerCase()) || 
                        sub.assignmentTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = teacherSubmissions.filter(s => s.status === 'pending').length;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Grading Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">{pendingCount} submissions need your review</p>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or assignment..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 capitalize"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="graded">Graded</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-400 font-medium uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Student</th>
              <th className="px-5 py-3 text-left">Assignment</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Marks</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{sub.studentName}</p>
                  <p className="text-xs text-slate-500">{sub.studentId}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{sub.assignmentTitle}</p>
                  <p className="text-xs text-slate-500">{sub.courseCode}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={sub.status} />
                    {sub.late && <Badge variant="warning">Late</Badge>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {sub.marks !== null ? (
                    <span className="font-medium text-slate-900">{sub.marks} / {sub.maxMarks}</span>
                  ) : (
                    <span className="text-slate-400">— / {sub.maxMarks}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => setGradeModal(sub)}
                    className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-400">No submissions to show</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!gradeModal} onClose={() => setGradeModal(null)} title={`Grade Submission`} size="md">
        {gradeModal && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">{gradeModal.studentName} ({gradeModal.studentId})</p>
              <p className="text-xs text-slate-500 mt-1">{gradeModal.assignmentTitle} · {gradeModal.courseCode}</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div className="flex justify-between text-slate-500 mb-2">
                    <span>Submitted On</span>
                    <span className="font-medium text-slate-800">{gradeModal.submittedAt ? new Date(gradeModal.submittedAt).toLocaleString() : 'Not submitted'}</span>
                </div>
                {gradeModal.late && (
                    <div className="flex items-center gap-1.5 text-amber-600 mb-2">
                        <Clock size={14} /> <span className="font-medium text-xs">Late Submission</span>
                    </div>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Marks (out of {gradeModal.maxMarks})</label>
              <input type="number" defaultValue={gradeModal.marks || ''} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Feedback</label>
              <textarea rows={3} defaultValue={gradeModal.feedback || ''} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" placeholder="Provide constructive feedback..."></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setGradeModal(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={() => setGradeModal(null)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <CheckCircle size={15} /> Save Grade
              </button>
            </div>
          </div>
        )}
      </Modal>

    </Layout>
  );
}

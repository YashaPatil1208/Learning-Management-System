import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { assignments, courses, teacherSubmissions } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { FileText, Plus, Search, Calendar, Users, Send } from 'lucide-react';

export default function TeacherAssignments() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [createModal, setCreateModal] = useState(false);
  
  const myCourses = courses.filter(c => c.teacherId === currentUser?.id);
  const myAssignments = assignments.filter(a => myCourses.some(c => c.id === a.courseId));

  const filtered = myAssignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'all' || a.courseId === courseFilter;
    return matchSearch && matchCourse;
  });

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assignment Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{myAssignments.length} total assignments created</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700"
        >
          <option value="all">All Courses</option>
          {myCourses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-400 font-medium uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Assignment</th>
              <th className="px-5 py-3 text-left">Course</th>
              <th className="px-5 py-3 text-left">Due Date</th>
              <th className="px-5 py-3 text-left">Submissions</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(a => {
              const subs = teacherSubmissions.filter(s => s.assignmentId === a.id);
              const graded = subs.filter(s => s.status === 'graded').length;
              return (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm truncate">{a.description}</p>
                  </td>
                  <td className="px-5 py-4"><Badge variant="primary">{a.courseCode}</Badge></td>
                  <td className="px-5 py-4 text-slate-600">{new Date(a.dueDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{subs.length}</span>
                      <span className="text-xs text-slate-400">({graded} graded)</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
               <tr>
                 <td colSpan="5" className="px-5 py-8 text-center text-slate-400">No assignments found</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Assignment" size="lg">
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                    <option value="">Select course...</option>
                    {myCourses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                    <option value="CS-2023-A">CS-2023-A</option>
                    <option value="CS-2023-B">CS-2023-B</option>
                  </select>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignment Title</label>
              <input type="text" placeholder="e.g. Mid-term Project" className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea rows={3} placeholder="Detailed instructions..." className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Marks</label>
                  <input type="number" placeholder="100" className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="githubReq" className="rounded text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="githubReq" className="text-sm text-slate-700">Require GitHub repository link</label>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setCreateModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Send size={15} /> Publish
              </button>
            </div>
        </div>
      </Modal>
    </Layout>
  );
}

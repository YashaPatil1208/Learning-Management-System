import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProgressBar from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { allStudentsForTeacher } from '../../data/mockData';
import { Search, Filter, Mail, ExternalLink } from 'lucide-react';

export default function StudentManagement() {
  const [search, setSearch] = useState('');
  
  const filteredStudents = allStudentsForTeacher.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">{allStudentsForTeacher.length} students across your courses</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={15} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 font-medium uppercase tracking-wide border-b border-slate-200">
            <tr>
              <th className="px-5 py-4 text-left">Student</th>
              <th className="px-5 py-4 text-left">Batch</th>
              <th className="px-5 py-4 text-left">Attendance</th>
              <th className="px-5 py-4 text-left">GPA</th>
              <th className="px-5 py-4 text-right">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((s) => (
              <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><Badge variant="default">{s.batch}</Badge></td>
                <td className="px-5 py-4 w-48">
                  <div className="flex items-center gap-3">
                    <ProgressBar value={s.attendance} color="auto" size="sm" />
                    <span className={`text-xs font-medium ${s.attendance < 75 ? 'text-red-600' : 'text-slate-600'}`}>{s.attendance}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-800">{s.gpa}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <a href={`mailto:${s.email}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Mail size={16} />
                  </a>
                  <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-1">
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-400">No students found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

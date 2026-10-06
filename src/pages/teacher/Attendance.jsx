import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { classAttendance, courses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TeacherAttendance() {
  const { currentUser } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('c1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState(classAttendance);
  const [saved, setSaved] = useState(false);

  const myCourses = courses.filter(c => c.teacherId === currentUser?.id);

  const markAll = (status) => {
    setAttendanceState(prev => prev.map(s => ({ ...s, status })));
  };

  const updateStudent = (id, status) => {
    setAttendanceState(prev => prev.map(s => s.studentId === id ? { ...s, status } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mark Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Record daily class attendance</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Save size={16} /> Save Register
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle size={18} /> Attendance recorded successfully for {selectedDate}!
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {myCourses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="CS-2023-A">CS-2023-A</option>
              <option value="CS-2023-B">CS-2023-B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" 
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-slate-700 mr-2">Quick Mark:</span>
        <button onClick={() => markAll('present')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium border border-emerald-200 transition-colors">Mark All Present</button>
        <button onClick={() => markAll('absent')} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium border border-red-200 transition-colors">Mark All Absent</button>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 font-medium uppercase tracking-wide border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-left w-16">No.</th>
              <th className="px-5 py-3 text-left">Student ID</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendanceState.map((student, i) => (
              <tr key={student.studentId} className="hover:bg-slate-50/50">
                <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-slate-700">{student.studentId}</td>
                <td className="px-5 py-3 font-medium text-slate-900">{student.name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => updateStudent(student.studentId, 'present')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${student.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <CheckCircle size={14} /> Present
                    </button>
                    <button 
                      onClick={() => updateStudent(student.studentId, 'absent')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${student.status === 'absent' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <XCircle size={14} /> Absent
                    </button>
                    <button 
                      onClick={() => updateStudent(student.studentId, 'late')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${student.status === 'late' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <Clock size={14} /> Late
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

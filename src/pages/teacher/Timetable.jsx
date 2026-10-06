import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Clock, Plus, Search } from 'lucide-react';
import { timetable, courses } from '../../data/mockData';

export default function TeacherTimetable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Timetable</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your weekly class schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Add Class
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left w-32">Time</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="px-6 py-4 text-left min-w-[200px]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(time => (
                <tr key={time} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-400 border-r border-slate-100">
                    {time} {parseInt(time) >= 12 ? 'PM' : 'AM'}
                  </td>
                  {daysOfWeek.map(day => {
                    const classEntry = timetable.find(t => 
                      t.dayOfWeek === day && 
                      t.startTime === time && 
                      (courses.find(c => c.id === t.courseId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
                    );

                    return (
                      <td key={`${day}-${time}`} className="p-3 border-r border-slate-100 last:border-r-0">
                        {classEntry ? (
                          <div className="bg-indigo-50 border border-indigo-100/50 rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="primary">{courses.find(c => c.id === classEntry.courseId)?.code}</Badge>
                              <span className="text-[10px] uppercase font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded">
                                {classEntry.type}
                              </span>
                            </div>
                            <p className="font-medium text-slate-900 text-sm leading-tight mb-1">
                              {courses.find(c => c.id === classEntry.courseId)?.name}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={12} /> {classEntry.room}
                            </p>
                          </div>
                        ) : (
                          <div className="h-full w-full min-h-[80px] rounded-lg border-2 border-dashed border-transparent group-hover:border-slate-200 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button onClick={() => setIsModalOpen(true)} className="text-xs font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                              <Plus size={14} /> Add
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage Schedule" size="md">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">Add a new class to your weekly timetable.</p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Day</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Time</label>
              <input type="time" className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Room / Location</label>
            <input type="text" placeholder="e.g. Room 302, Building A" className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Save Class</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

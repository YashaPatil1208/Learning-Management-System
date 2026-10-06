import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/shared/CourseCard';
import { courses } from '../../data/mockData';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TeacherCourses() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  
  // Assuming a teacher sees only their own courses
  const myCourses = courses.filter(c => 
    c.teacherId === currentUser?.id && 
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{myCourses.length} courses assigned to you</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 w-56 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {myCourses.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No courses found matching "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {myCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              // For teacher, maybe enrollment progress isn't directly applicable,
              // but we pass dummy/empty data or you could adapt CourseCard to handle teacher view differently
              enrollment={{ progress: 100, attendancePercent: 100 }}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

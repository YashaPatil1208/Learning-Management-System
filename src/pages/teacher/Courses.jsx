import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/shared/CourseCard';
import { courses as mockCourses } from '../../data/mockData';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function TeacherCourses() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    api.get('/courses')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourseList(res.data);
        } else {
          setCourseList(mockCourses);
        }
      })
      .catch(() => setCourseList(mockCourses));
  }, []);

  const activeCourses = courseList.length > 0 ? courseList : mockCourses;

  // Filter courses for this teacher or show courses matching query
  const myCourses = activeCourses.filter(c => {
    const q = search.toLowerCase();
    const name = (c.name || c.Name || '').toLowerCase();
    const code = (c.code || c.Code || '').toLowerCase();
    const matchesSearch = name.includes(q) || code.includes(q);

    // If teacher ID is specified, check against current user ID or email or show all if instructor
    const isTeacherCourse =
      !c.teacherId ||
      c.teacherId === currentUser?.id ||
      c.InstructorID === currentUser?.id ||
      c.teacherName === currentUser?.name ||
      activeCourses.length <= 5; // Show available courses

    return matchesSearch && isTeacherCourse;
  });

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
          {myCourses.map((course, idx) => (
            <CourseCard
              key={course.id || course.CourseID || idx}
              course={course}
              enrollment={{ progress: 100, attendancePercent: 100 }}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

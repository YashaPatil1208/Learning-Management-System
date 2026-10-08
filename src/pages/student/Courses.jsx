import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/shared/CourseCard';
import { courses as mockCourses, enrollments as mockEnrollments, students } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudentCourses() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    api.get('/courses')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCoursesList(res.data);
        } else {
          setCoursesList(mockCourses);
        }
      })
      .catch(() => setCoursesList(mockCourses));
  }, []);

  const student = students.find(s => s.userId === currentUser?.id || s.studentId === currentUser?.studentId);
  const myEnrollments = mockEnrollments.filter(e => e.studentId === student?.id || e.studentId === 's1');

  const activeCourses = coursesList.length > 0 ? coursesList : mockCourses;
  const filteredCourses = activeCourses.filter(c => {
    const q = search.toLowerCase();
    const name = (c.name || c.Name || '').toLowerCase();
    const code = (c.code || c.Code || '').toLowerCase();
    return name.includes(q) || code.includes(q);
  });

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filteredCourses.length} courses · Semester 5</p>
        </div>
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
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No courses found matching "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              enrollment={myEnrollments.find(e => e.courseId === course.id)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

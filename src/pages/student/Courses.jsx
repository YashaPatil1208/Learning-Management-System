import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/shared/CourseCard';
import { courses, enrollments, students } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function StudentCourses() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const student = students.find(s => s.userId === currentUser?.id);
  const myEnrollments = enrollments.filter(e => e.studentId === student?.id);
  const myCourses = courses.filter(c =>
    myEnrollments.some(e => e.courseId === c.id) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{myCourses.length} courses · Semester 5</p>
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
              enrollment={myEnrollments.find(e => e.courseId === course.id)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { BookOpen, Users, FileText, ChevronRight } from 'lucide-react';

const colorMap = {
  indigo: { border: 'border-indigo-200', accent: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700', badge: 'primary' },
  sky:    { border: 'border-sky-200',    accent: 'bg-sky-500',    light: 'bg-sky-50',    text: 'text-sky-700',    badge: 'sky' },
  emerald:{ border: 'border-emerald-200',accent: 'bg-emerald-600',light: 'bg-emerald-50',text: 'text-emerald-700',badge: 'success' },
  amber:  { border: 'border-amber-200',  accent: 'bg-amber-500',  light: 'bg-amber-50',  text: 'text-amber-700',  badge: 'warning' },
  rose:   { border: 'border-rose-200',   accent: 'bg-rose-500',   light: 'bg-rose-50',   text: 'text-rose-700',   badge: 'danger' },
};

export default function CourseCard({ course, enrollment }) {
  const navigate = useNavigate();
  const c = colorMap[course.color] || colorMap.indigo;

  return (
    <div
      onClick={() => navigate(`/student/courses/${course.id}`)}
      className={`bg-white rounded-xl border ${c.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden`}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 ${c.accent} w-full`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant={c.badge} className="mb-2">{course.code}</Badge>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
              {course.name}
            </h3>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 mt-1 flex-shrink-0 transition-colors" />
        </div>

        {/* Teacher */}
        <p className="text-xs text-slate-500 mb-4">{course.teacherName}</p>

        {/* Progress */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className="font-medium text-slate-700">{enrollment?.progress ?? 0}%</span>
            </div>
            <ProgressBar value={enrollment?.progress ?? 0} color="indigo" size="md" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Attendance</span>
              <span className={`font-medium ${(enrollment?.attendancePercent ?? 0) < 75 ? 'text-red-600' : 'text-slate-700'}`}>
                {enrollment?.attendancePercent ?? 0}%
              </span>
            </div>
            <ProgressBar value={enrollment?.attendancePercent ?? 0} color="auto" size="md" />
          </div>
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FileText size={12} />
            {course.resourceCount} resources
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {course.credits} credits
          </span>
        </div>
      </div>
    </div>
  );
}

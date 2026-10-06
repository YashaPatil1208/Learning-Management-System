import { Calendar, Clock, GitBranch, Upload } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const isOverdue = (dueDate, status) => {
  if (status === 'graded' || status === 'submitted') return false;
  return new Date(dueDate) < new Date();
};

export default function AssignmentCard({ assignment, submission, onSubmit, onView }) {
  const status = submission
    ? submission.status
    : isOverdue(assignment.dueDate) ? 'overdue' : 'pending';

  const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {assignment.courseCode}
            </span>
            <StatusBadge status={status} />
            {submission?.late && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">Late</span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug">{assignment.title}</h3>
        </div>
        {submission?.marks !== null && submission?.marks !== undefined && (
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-indigo-600">{submission.marks}</p>
            <p className="text-xs text-slate-400">/ {assignment.maxMarks}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{assignment.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          Due: {formatDate(assignment.dueDate)}
        </span>
        {status === 'pending' && daysLeft > 0 && (
          <span className={`flex items-center gap-1 font-medium ${daysLeft <= 2 ? 'text-red-500' : 'text-amber-600'}`}>
            <Clock size={12} />
            {daysLeft === 1 ? 'Due tomorrow' : `${daysLeft} days left`}
          </span>
        )}
        <span className="ml-auto">Max: {assignment.maxMarks} marks</span>
      </div>

      {/* GitHub link */}
      {submission?.githubUrl && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 rounded-lg px-3 py-2">
          <GitBranch size={13} />
          <a href={`https://${submission.githubUrl}`} className="text-indigo-600 hover:underline truncate">
            {submission.githubUrl}
          </a>
        </div>
      )}

      {/* Feedback */}
      {submission?.feedback && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <p className="text-xs font-medium text-emerald-700 mb-1">Feedback</p>
          <p className="text-xs text-emerald-600">{submission.feedback}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {(status === 'pending' || status === 'overdue') && (
          <button
            onClick={() => onSubmit?.(assignment)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload size={13} />
            Submit Assignment
          </button>
        )}
        {(status === 'graded' || status === 'submitted') && (
          <button
            onClick={() => onView?.(assignment, submission)}
            className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            View Submission
          </button>
        )}
      </div>
    </div>
  );
}

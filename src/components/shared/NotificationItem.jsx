import { useNavigate } from 'react-router-dom';
import { Bell, Award, AlertCircle, BookOpen, MessageSquare, Megaphone, FileText } from 'lucide-react';

const iconMap = {
  assignment: FileText,
  grade: Award,
  attendance: AlertCircle,
  resource: BookOpen,
  qa: MessageSquare,
  announcement: Megaphone,
};

const colorMap = {
  assignment: 'bg-indigo-100 text-indigo-600',
  grade: 'bg-emerald-100 text-emerald-600',
  attendance: 'bg-red-100 text-red-600',
  resource: 'bg-sky-100 text-sky-600',
  qa: 'bg-purple-100 text-purple-600',
  announcement: 'bg-amber-100 text-amber-600',
};

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function NotificationItem({ notification, onMarkRead, compact = false }) {
  const navigate = useNavigate();
  const Icon = iconMap[notification.type] || Bell;
  const iconColor = colorMap[notification.type] || 'bg-slate-100 text-slate-600';

  const handleClick = () => {
    onMarkRead?.(notification.id);
    if (notification.link && notification.link !== '#') navigate(notification.link);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${
        !notification.read ? 'bg-indigo-50/40' : ''
      }`}
    >
      <div className={`p-2 rounded-lg flex-shrink-0 ${iconColor}`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
            {notification.title}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-slate-400">{formatRelativeTime(notification.createdAt)}</span>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
            )}
          </div>
        </div>
        {!compact && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
        )}
      </div>
    </div>
  );
}

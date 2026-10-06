import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import NotificationItem from '../../components/shared/NotificationItem';
import { Badge } from '../../components/ui/Badge';
import { notifications as notifData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Filter } from 'lucide-react';

const FILTERS = ['All', 'Unread', 'assignment', 'grade', 'attendance', 'resource', 'qa', 'announcement'];

export default function Notifications() {
  const { currentUser } = useAuth();
  const [notifs, setNotifs] = useState(notifData.filter(n => n.userId === currentUser?.id));
  const [filter, setFilter] = useState('All');

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        ) : filtered.map(n => (
          <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
        ))}
      </div>
    </Layout>
  );
}

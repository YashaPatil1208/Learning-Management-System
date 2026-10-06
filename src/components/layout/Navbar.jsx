import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Search, Menu, ChevronDown, Moon, Sun } from 'lucide-react';
import { notifications } from '../../data/mockData';

export default function Navbar({ onMenuClick }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 sticky top-0 z-10 transition-colors">
      {/* Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, assignments..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Semester badge */}
        <span className="hidden sm:flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800">
          Semester 5 · AY 2024–25
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate(currentUser?.role === 'teacher' ? '/student/notifications' : '/student/notifications')}
          className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          onClick={() => navigate('/student/profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
            {getInitials(currentUser?.name)}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            {currentUser?.name?.split(' ')[0]}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}

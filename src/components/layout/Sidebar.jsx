import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, FileText, FolderOpen, CalendarCheck,
  Calendar, MessageSquare, BarChart2, Bell, User, LogOut,
  GraduationCap, Users, ClipboardList, CheckSquare, Megaphone,
  X, ChevronRight
} from 'lucide-react';

const studentNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
  { label: 'My Courses', icon: BookOpen, to: '/student/courses' },
  { label: 'Assignments', icon: FileText, to: '/student/assignments' },
  { label: 'Resources', icon: FolderOpen, to: '/student/courses' },
  { label: 'Attendance', icon: CalendarCheck, to: '/student/attendance' },
  { label: 'Timetable', icon: Calendar, to: '/student/timetable' },
  { label: 'Q&A', icon: MessageSquare, to: '/student/qa' },
  { label: 'Grades', icon: BarChart2, to: '/student/grades' },
  { label: 'Notifications', icon: Bell, to: '/student/notifications' },
  { label: 'Profile', icon: User, to: '/student/profile' },
];

const teacherNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
  { label: 'My Courses', icon: BookOpen, to: '/teacher/courses' },
  { label: 'Students', icon: Users, to: '/teacher/students' },
  { label: 'Assignments', icon: FileText, to: '/teacher/assignments' },
  { label: 'Grading', icon: CheckSquare, to: '/teacher/grading' },
  { label: 'Attendance', icon: CalendarCheck, to: '/teacher/attendance' },
  { label: 'Timetable', icon: Calendar, to: '/teacher/dashboard#timetable' },
  { label: 'Q&A', icon: MessageSquare, to: '/student/qa' },
  { label: 'Announcements', icon: Megaphone, to: '/teacher/dashboard#announcements' },
  { label: 'Notifications', icon: Bell, to: '/student/notifications' },
  { label: 'Profile', icon: User, to: '/student/profile' },
];

export default function Sidebar({ open, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = currentUser?.role === 'teacher' ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">UniLearn</span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                {currentUser?.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-0.5">
          {navItems.map(({ label, icon: Icon, to }) => {
            // Compute active state manually to support hashes properly
            const isHashLink = to.includes('#');
            const targetPath = to.split('#')[0];
            const targetHash = isHashLink ? '#' + to.split('#')[1] : '';
            
            // It's active if path matches AND hash matches (or if no hash in 'to' and no hash in URL)
            const isActive = isHashLink 
              ? location.pathname === targetPath && location.hash === targetHash
              : location.pathname === to && (!location.hash || location.hash === '');

            // Use Link for custom styling logic instead of NavLink's automatic classes
            return (
              <Link
                key={label}
                to={to}
                onClick={(e) => {
                  if (isHashLink && location.pathname === targetPath) {
                    e.preventDefault();
                    if (onClose) onClose();
                    const el = document.getElementById(targetHash.replace('#', '') + '-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    // Optionally update URL without triggering a full router cycle
                    window.history.replaceState(null, '', targetHash);
                  } else {
                    if (onClose) onClose();
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400 dark:text-indigo-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {getInitials(currentUser?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

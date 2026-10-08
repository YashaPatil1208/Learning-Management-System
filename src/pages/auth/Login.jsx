import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff, BookOpen, Users, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('aanya.sharma@university.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // Register fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regDepartment, setRegDepartment] = useState('Computer Science');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithCredentials, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginWithCredentials(email, password);
      setLoading(false);
      const targetRole = user.role === 'teacher' || user.role === 'instructor' ? 'teacher' : 'student';
      navigate(`/${targetRole}/dashboard`);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(msg);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDepartment,
      });
      setLoading(false);
      const targetRole = user.role === 'teacher' || user.role === 'instructor' ? 'teacher' : 'student';
      navigate(`/${targetRole}/dashboard`);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to create account.';
      setError(msg);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    const demoEmail = role === 'teacher' ? 'r.mehta@university.edu' : 'aanya.sharma@university.edu';
    const demoPass = 'password123';

    try {
      // Attempt backend auth first
      const user = await loginWithCredentials(demoEmail, demoPass);
      setLoading(false);
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch {
      // Offline fallback
      const fallbackUser = login(role);
      setLoading(false);
      navigate(fallbackUser.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    }
  };

  const setCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-3">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">UniLearn LMS</h1>
          <p className="text-slate-500 mt-1 text-xs">University of Technology · Academic Year 2024–25</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-7">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 mb-6 pb-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 pb-2 text-sm font-semibold text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 pb-2 text-sm font-semibold text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserPlus size={15} />
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            /* ─── Sign In Form ─── */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Fill Chips */}
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">Quick fill demo credentials:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCredentials('aanya.sharma@university.edu', 'password123')}
                    className="px-2 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors"
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials('r.mehta@university.edu', 'password123')}
                    className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors"
                  >
                    👨‍🏫 Instructor
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials('admin@example.com', 'password123')}
                    className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2 pr-10 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-indigo-600"
                />
                <span className="text-xs text-slate-600">Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm shadow-md shadow-indigo-100"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-white px-2 text-slate-400">or instant demo access</span>
                </div>
              </div>

              {/* Demo 1-click */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50/70 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-60"
                >
                  <BookOpen size={14} />
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('teacher')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50/70 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-60"
                >
                  <Users size={14} />
                  Teacher Demo
                </button>
              </div>
            </form>
          ) : (
            /* ─── Registration Form ─── */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="john.doe@university.edu"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Instructor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <UserPlus size={15} /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          University of Technology · DBMS Mini Project 2024–25<br />
          Department of Computer Science & Engineering
        </p>
      </div>
    </div>
  );
}

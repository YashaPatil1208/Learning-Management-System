import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff, BookOpen, Users } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = loginWithCredentials(email, password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } else {
      setError('Invalid email or password. Use demo login below.');
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const user = login(role);
    setLoading(false);
    navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">UniLearn LMS</h1>
          <p className="text-slate-500 mt-1 text-sm">University of Technology · Academic Year 2024–25</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email / Student ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aanya.sharma@university.edu"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">or try demo accounts</span>
            </div>
          </div>

          {/* Demo logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('student')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors disabled:opacity-60"
            >
              <BookOpen size={16} />
              Student Demo
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-60"
            >
              <Users size={16} />
              Teacher Demo
            </button>
          </div>
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

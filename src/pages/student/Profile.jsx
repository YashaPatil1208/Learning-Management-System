import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { students } from '../../data/mockData';
import { User, Mail, Phone, GitBranch, Globe, Edit2, Save, X, BookOpen, GraduationCap, Building } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const student = students.find(s => s.userId === currentUser?.id);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    github: currentUser?.github || '',
    linkedin: currentUser?.linkedin || '',
  });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account information</p>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <Save size={15} /> Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Avatar card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold mb-4 ring-4 ring-indigo-50">
            {getInitials(currentUser?.name)}
          </div>
          <h2 className="font-bold text-slate-900 text-lg">{currentUser?.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{currentUser?.email}</p>

          <div className="w-full mt-6 space-y-3 text-left">
            {[
              { icon: GraduationCap, label: 'Student ID', value: student?.studentId },
              { icon: Building, label: 'Department', value: currentUser?.department },
              { icon: BookOpen, label: 'Semester', value: `Semester ${student?.semester}` },
              { icon: User, label: 'Batch', value: student?.batch },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <item.icon size={15} className="text-indigo-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">{item.label}</p>
                  <p className="text-sm font-medium text-slate-800">{item.value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editable info */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Personal Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                <Edit2 size={15} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                  <X size={14} /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', icon: User, type: 'text' },
              { key: 'email', label: 'Email Address', icon: Mail, type: 'email' },
              { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
              { key: 'github', label: 'GitHub Profile', icon: GitBranch, type: 'text', prefix: 'github.com/' },
              { key: 'linkedin', label: 'LinkedIn Profile', icon: Globe, type: 'text', prefix: 'linkedin.com/in/' },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                  <f.icon size={14} className="text-slate-400" /> {f.label}
                </label>
                {editing ? (
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                ) : (
                  <p className="text-sm text-slate-800 px-4 py-2.5 bg-slate-50 rounded-xl">
                    {form[f.key] || <span className="text-slate-400">Not set</span>}
                  </p>
                )}
              </div>
            ))}

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
              {editing ? (
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
                />
              ) : (
                <p className="text-sm text-slate-800 px-4 py-2.5 bg-slate-50 rounded-xl leading-relaxed">
                  {form.bio || <span className="text-slate-400">No bio yet</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

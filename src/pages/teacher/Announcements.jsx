import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Megaphone, Trash2, Edit } from 'lucide-react';
import { announcements } from '../../data/mockData';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function TeacherAnnouncements() {
  const [localAnnouncements, setLocalAnnouncements] = useState(announcements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });

  const filteredAnnouncements = localAnnouncements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ann.body && ann.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePost = () => {
    if (newAnnouncement.title) {
      setLocalAnnouncements([{ 
        id: `ann${Date.now()}`, 
        title: newAnnouncement.title, 
        body: newAnnouncement.body,
        authorName: 'Prof. Rajiv Mehta', 
        createdAt: new Date().toISOString() 
      }, ...localAnnouncements]);
      setNewAnnouncement({ title: '', body: '' });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    setLocalAnnouncements(localAnnouncements.filter(a => a.id !== id));
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500 mt-0.5">Broadcast messages to all your students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map(ann => (
            <div key={ann.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Megaphone size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Announcement</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{ann.title}</h3>
              {ann.body && <p className="text-slate-600 text-sm leading-relaxed mb-4">{ann.body}</p>}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {ann.authorName.charAt(0)}
                </div>
                <span>{ann.authorName}</span>
                <span>·</span>
                <span>{formatDate(ann.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No announcements found</h3>
            <p className="text-sm text-slate-500">Create a new announcement to broadcast to your students.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input 
              type="text" 
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Midterm Exam Schedule Update" 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message Details</label>
            <textarea 
              rows={6} 
              value={newAnnouncement.body}
              onChange={(e) => setNewAnnouncement(p => ({ ...p, body: e.target.value }))}
              placeholder="Type your announcement here..." 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" 
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button 
              onClick={handlePost} 
              disabled={!newAnnouncement.title}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Publish Announcement
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

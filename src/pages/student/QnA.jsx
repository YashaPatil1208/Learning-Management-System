import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { questions, answers, courses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ThumbsUp, MessageSquare, Search, Plus, CheckCircle, Send, Filter } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function QnA() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [askModal, setAskModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [newQ, setNewQ] = useState({ title: '', body: '', courseId: '', tags: '' });
  const [submitted, setSubmitted] = useState(false);
  const [localQuestions, setLocalQuestions] = useState(questions);
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [newAnswer, setNewAnswer] = useState('');
  const [upvoted, setUpvoted] = useState(new Set());

  const filtered = localQuestions.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.body.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'all' || q.courseId === courseFilter;
    return matchSearch && matchCourse;
  });

  const handleAsk = () => {
    if (!newQ.title.trim() || !newQ.body.trim()) return;
    const q = {
      id: `q${Date.now()}`, courseId: newQ.courseId || 'c1', authorId: currentUser?.id,
      authorName: currentUser?.name, title: newQ.title, body: newQ.body,
      upvotes: 0, answerCount: 0, createdAt: new Date().toISOString(),
      tags: newQ.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    setLocalQuestions(prev => [q, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setAskModal(false); setSubmitted(false); setNewQ({ title: '', body: '', courseId: '', tags: '' }); }, 2000);
  };

  const handleUpvote = (qId) => {
    if (upvoted.has(qId)) return;
    setUpvoted(prev => new Set([...prev, qId]));
    setLocalQuestions(prev => prev.map(q => q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q));
  };

  const handlePostAnswer = (qId) => {
    if (!newAnswer.trim()) return;
    const ans = {
      id: `ans${Date.now()}`, questionId: qId, authorId: currentUser?.id,
      authorName: currentUser?.name, isTeacher: false, body: newAnswer,
      upvotes: 0, isOfficial: false, createdAt: new Date().toISOString(),
    };
    setLocalAnswers(prev => [...prev, ans]);
    setLocalQuestions(prev => prev.map(q => q.id === qId ? { ...q, answerCount: q.answerCount + 1 } : q));
    setNewAnswer('');
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Q&A Discussions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{localQuestions.length} questions · academic forum</p>
        </div>
        <button
          onClick={() => setAskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Ask a Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700"
        >
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>No questions found</p>
          </div>
        ) : filtered.map(q => {
          const qAnswers = localAnswers.filter(a => a.questionId === q.id);
          const officialAns = qAnswers.find(a => a.isOfficial);
          const course = courses.find(c => c.id === q.courseId);
          return (
            <div
              key={q.id}
              onClick={() => setViewModal(q)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Votes */}
                <div className="flex flex-col items-center gap-1 min-w-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleUpvote(q.id); }}
                    className={`p-1.5 rounded-lg transition-colors ${upvoted.has(q.id) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    <ThumbsUp size={15} />
                  </button>
                  <span className="text-sm font-semibold text-slate-700">{q.upvotes}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors leading-snug">
                      {q.title}
                    </h3>
                    {officialAns && (
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" title="Has official answer" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.body}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {course && <Badge variant="primary">{course.code}</Badge>}
                    {q.tags?.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
                    <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                      <MessageSquare size={11} /> {q.answerCount} answers
                    </span>
                    <span className="text-xs text-slate-400">{q.authorName} · {formatDate(q.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ask Question Modal */}
      <Modal isOpen={askModal} onClose={() => setAskModal(false)} title="Ask a Question" size="lg">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-900">Question Posted!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
              <select value={newQ.courseId} onChange={(e) => setNewQ(p => ({ ...p, courseId: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500">
                <option value="">Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Title</label>
              <input type="text" value={newQ.title} onChange={(e) => setNewQ(p => ({ ...p, title: e.target.value }))}
                placeholder="Be specific and clear..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea rows={4} value={newQ.body} onChange={(e) => setNewQ(p => ({ ...p, body: e.target.value }))}
                placeholder="Provide context and details..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (comma-separated)</label>
              <input type="text" value={newQ.tags} onChange={(e) => setNewQ(p => ({ ...p, tags: e.target.value }))}
                placeholder="e.g. SQL, normalization, joins"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAskModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleAsk} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Send size={15} /> Post Question
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Question Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Question" size="lg">
        {viewModal && (
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">{viewModal.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{viewModal.body}</p>
            <div className="flex gap-2 mb-6 flex-wrap">
              {viewModal.tags?.map(t => <Badge key={t} variant="default">{t}</Badge>)}
            </div>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">{localAnswers.filter(a => a.questionId === viewModal.id).length} Answers</h4>
            <div className="space-y-4 mb-6">
              {localAnswers.filter(a => a.questionId === viewModal.id).map(ans => (
                <div key={ans.id} className={`p-4 rounded-xl border ${ans.isOfficial ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                  {ans.isOfficial && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
                      <CheckCircle size={13} /> Official Answer
                    </div>
                  )}
                  <p className="text-sm text-slate-700">{ans.body}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="font-medium text-slate-600">{ans.authorName}</span>
                    {ans.isTeacher && <Badge variant="success">Teacher</Badge>}
                    <span>{formatDate(ans.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-1"><ThumbsUp size={11} /> {ans.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
              <textarea rows={3} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write a helpful answer..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" />
              <button onClick={() => handlePostAnswer(viewModal.id)}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                <Send size={14} /> Post Answer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

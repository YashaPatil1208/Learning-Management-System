import { FileText, Link, Presentation, BookOpen, Download, ExternalLink } from 'lucide-react';

const typeIconMap = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  pptx: { icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50' },
  link: { icon: Link, color: 'text-blue-500', bg: 'bg-blue-50' },
  ipynb: { icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
  default: { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ResourceItem({ resource }) {
  const { icon: Icon, color, bg } = typeIconMap[resource.type] || typeIconMap.default;

  return (
    <div className="flex items-center gap-4 py-3 hover:bg-slate-50 rounded-lg px-3 -mx-3 transition-colors group">
      <div className={`p-2.5 rounded-lg ${bg} flex-shrink-0`}>
        <Icon size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{resource.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
          <span className="uppercase font-medium">{resource.type}</span>
          {resource.size && <span>{resource.size}</span>}
          <span>{formatDate(resource.uploadDate)}</span>
        </div>
      </div>
      <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all">
        {resource.type === 'link' ? <ExternalLink size={16} /> : <Download size={16} />}
      </button>
    </div>
  );
}

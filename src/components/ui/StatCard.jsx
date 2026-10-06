// StatCard — Dashboard quick stat card
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', icon: 'bg-sky-100' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${c.icon} p-2.5 rounded-xl`}>
            <Icon size={20} className={c.text} />
          </div>
        )}
      </div>
    </div>
  );
}

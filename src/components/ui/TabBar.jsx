// TabBar — horizontal tab navigation
export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-0 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.icon && <tab.icon size={15} />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium ${
                activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

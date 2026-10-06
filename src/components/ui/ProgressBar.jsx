// ProgressBar component
export default function ProgressBar({ value, max = 100, color = 'indigo', showLabel = false, size = 'md' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    sky: 'bg-sky-500',
  };

  const getColor = () => {
    if (pct >= 75) return colorMap.emerald;
    if (pct >= 50) return colorMap.amber;
    return colorMap.red;
  };

  const barColor = color === 'auto' ? getColor() : (colorMap[color] || colorMap.indigo);
  const heightMap = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full ${heightMap[size] || heightMap.md} overflow-hidden`}>
        <div
          className={`${barColor} ${heightMap[size] || heightMap.md} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(pct)}%</p>
      )}
    </div>
  );
}

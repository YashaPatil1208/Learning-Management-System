// Badge — status/category label
const variantMap = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-indigo-100 text-indigo-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  sky: 'bg-sky-100 text-sky-700',
  purple: 'bg-purple-100 text-purple-700',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantMap[variant] || variantMap.default} ${className}`}>
      {children}
    </span>
  );
}

// Status Badge for assignments/submissions
export function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',    variant: 'warning' },
    submitted: { label: 'Submitted',  variant: 'primary' },
    graded:    { label: 'Graded',     variant: 'success' },
    overdue:   { label: 'Overdue',    variant: 'danger' },
    missing:   { label: 'Missing',    variant: 'danger' },
    present:   { label: 'Present',    variant: 'success' },
    absent:    { label: 'Absent',     variant: 'danger' },
    late:      { label: 'Late',       variant: 'warning' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}

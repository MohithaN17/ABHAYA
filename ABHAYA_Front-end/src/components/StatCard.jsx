import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // default | success | warning | danger
  onClick
}) {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    },
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-800',
      valueColor: 'text-emerald-950',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200',
      iconBg: 'bg-amber-50 text-amber-800',
      valueColor: 'text-amber-950',
    },
    danger: {
      bg: 'bg-white',
      border: 'border-rose-200',
      iconBg: 'bg-rose-50 text-rose-800',
      valueColor: 'text-rose-950',
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-md border ${style.border} ${style.bg} flex items-center justify-between transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-50' : ''
      }`}
    >
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className={`text-xl font-bold mt-0.5 ${style.valueColor}`}>{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-2 rounded ${style.iconBg} flex items-center justify-center border border-slate-200/60`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

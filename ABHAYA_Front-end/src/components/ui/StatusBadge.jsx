import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function StatusBadge({ score, category, showScore = true, size = 'md' }) {
  let style = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let Icon = ShieldCheck;
  let label = category || 'Stable';

  if (score !== undefined && score !== null) {
    if (score >= 71) {
      style = 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
      Icon = AlertOctagon;
      label = category || 'Urgent Support Needed';
    } else if (score >= 41) {
      style = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
      Icon = AlertTriangle;
      label = category || 'Attention Required';
    } else {
      style = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = ShieldCheck;
      label = category || 'Stable';
    }
  } else if (category) {
    const catLower = category.toLowerCase();
    if (catLower.includes('urgent')) {
      style = 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
      Icon = AlertOctagon;
    } else if (catLower.includes('attention')) {
      style = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
      Icon = AlertTriangle;
    }
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 gap-2 font-medium' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-md border ${sizeClasses} ${style} transition-colors`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
      {showScore && score !== undefined && score !== null && (
        <span className="ml-1 opacity-75 font-mono">({score})</span>
      )}
    </span>
  );
}

import React from 'react';
import { FolderSearch, AlertCircle } from 'lucide-react';

export default function EmptyState({
  title = "No Active Cases",
  description = "There are currently no cases assigned to this account.",
  icon: Icon = FolderSearch,
  isError = false,
  action
}) {
  return (
    <div className={`bg-white rounded-lg border ${isError ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'} p-10 text-center my-4`}>
      <div className={`w-10 h-10 rounded-md ${isError ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'} flex items-center justify-center mx-auto mb-3 border`}>
        {isError ? <AlertCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <h3 className={`text-sm font-semibold ${isError ? 'text-rose-900' : 'text-slate-900'} mb-1`}>{title}</h3>
      <p className={`text-xs ${isError ? 'text-rose-700' : 'text-slate-500'} max-w-md mx-auto mb-3`}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

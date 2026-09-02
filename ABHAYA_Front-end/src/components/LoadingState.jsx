import React from 'react';

export default function LoadingState({ message = "Loading case data..." }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>
      <div className="h-20 bg-slate-100 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-4/6"></div>
      </div>
      <p className="text-xs text-slate-400 text-center font-medium pt-2">{message}</p>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './ui/StatusBadge';
import Button from './ui/Button';
import EmptyState from './EmptyState';
import { Eye, TrendingUp, TrendingDown, Minus, ArrowUpDown, FolderKanban } from 'lucide-react';

export default function CaseTable({ cases = [], role = 'police', onSort, currentSort }) {
  const navigate = useNavigate();
  const isPolice = role === 'police';

  const handleRowClick = (id) => {
    const basePath = isPolice ? '/police/cases' : '/social-worker/cases';
    navigate(`${basePath}/${id}`);
  };

  const renderTrendIcon = (trend) => {
    if (trend === 'Deteriorating' || trend === 'increasing') {
      return <TrendingUp className="w-3.5 h-3.5 text-rose-700" title="Distress Deteriorating" />;
    }
    if (trend === 'Improving' || trend === 'decreasing') {
      return <TrendingDown className="w-3.5 h-3.5 text-emerald-700" title="Distress Improving" />;
    }
    return <Minus className="w-3.5 h-3.5 text-slate-400" title="Stable" />;
  };

  if (!cases || cases.length === 0) {
    return (
      <EmptyState
        title="No cases available"
        description="Cases assigned to this account will appear here once registered."
        icon={FolderKanban}
      />
    );
  }

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Case ID / FIR</th>
              <th className="px-4 py-3">Case Type</th>
              <th className="px-4 py-3">Registered On</th>
              <th className="px-4 py-3">Station / Location</th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                onClick={() => onSort && onSort('score')}
              >
                <div className="flex items-center gap-1">
                  <span>Well-Being Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => handleRowClick(c.id)}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                  <div>
                    <span className="font-bold text-slate-900 hover:underline">{c.caseId}</span>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.firNo}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                  {c.caseType}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {c.registeredOn}
                </td>
                <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                  {c.incidentLocation || c.policeStation}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`font-bold text-xs ${
                      c.wellBeingScore >= 71 ? 'text-rose-800' : c.wellBeingScore >= 41 ? 'text-amber-800' : 'text-emerald-800'
                    }`}>
                      {c.wellBeingScore} / 100
                    </span>
                    {renderTrendIcon(c.trend)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge score={c.wellBeingScore} category={c.wellBeingCategory} showScore={false} size="sm" />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleRowClick(c.id)}
                  >
                    View File
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './ui/StatusBadge';
import Button from './ui/Button';
import { Eye, Calendar, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CaseCard({ c, role = 'social-worker' }) {
  const navigate = useNavigate();
  const isPolice = role === 'police';

  const handleClick = () => {
    const basePath = isPolice ? '/police/cases' : '/social-worker/cases';
    navigate(`${basePath}/${c.id}`);
  };

  const renderTrendIcon = (trend) => {
    if (trend === 'Deteriorating' || trend === 'increasing') {
      return <span className="inline-flex items-center text-[11px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 gap-1 font-medium"><TrendingUp className="w-3 h-3" /> Deteriorating</span>;
    }
    if (trend === 'Improving' || trend === 'decreasing') {
      return <span className="inline-flex items-center text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 gap-1 font-medium"><TrendingDown className="w-3 h-3" /> Improving</span>;
    }
    return <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 gap-1 font-medium"><Minus className="w-3 h-3" /> Stable</span>;
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900">{c.caseId}</h4>
            <p className="text-[11px] font-mono text-slate-500">{c.firNo}</p>
          </div>
          <StatusBadge score={c.wellBeingScore} category={c.wellBeingCategory} size="sm" />
        </div>

        <p className="text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 mb-3">
          {c.caseType}
        </p>

        <div className="space-y-1.5 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Registered: {c.registeredOn}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{c.incidentLocation || c.policeStation}</span>
          </div>
        </div>

        {/* Distress score block */}
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Well-Being Score</span>
            <span className={`text-lg font-bold font-mono ${
              c.wellBeingScore >= 71 ? 'text-rose-800' : c.wellBeingScore >= 41 ? 'text-amber-800' : 'text-emerald-800'
            }`}>
              {c.wellBeingScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </span>
          </div>
          <div>{renderTrendIcon(c.trend)}</div>
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">Sync: {c.lastCheckIn || 'Recent'}</span>
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={handleClick}
        >
          Review File
        </Button>
      </div>
    </div>
  );
}

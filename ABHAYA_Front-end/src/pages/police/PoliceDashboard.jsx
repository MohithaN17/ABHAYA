import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import StatCard from '../../components/StatCard';
import CaseTable from '../../components/CaseTable';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/ui/Button';
import { FolderKanban, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Activity, Clock } from 'lucide-react';

export default function PoliceDashboard() {
  const { globalSearch } = useOutletContext() || {};
  const { cases, loading, error } = useCases('police', { search: globalSearch });
  const navigate = useNavigate();

  if (loading) return <LoadingState message="Loading Police Operations Dashboard..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load operational cases"
        description={error}
        isError={true}
        action={
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        }
      />
    );
  }

  // Operational metrics
  const activeCases = cases.length;
  const newCases = cases.filter(c => c.status === 'Active' || c.status === 'New').length;
  const attentionCases = cases.filter(c => c.wellBeingCategory === 'Attention Required' || (c.wellBeingScore >= 41 && c.wellBeingScore <= 70)).length;
  const urgentCases = cases.filter(c => c.wellBeingCategory === 'Urgent Support Needed' || c.wellBeingScore >= 71).length;

  const casesNeedingAttention = cases.filter(c => c.wellBeingScore >= 41);

  return (
    <div className="space-y-6">
      {/* CASE OVERVIEW - Operational Summary Blocks */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Case Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Active Cases"
            value={activeCases}
            subtitle="Registered Cases"
            icon={FolderKanban}
            variant="default"
            onClick={() => navigate('/police/cases')}
          />
          <StatCard
            title="New Cases"
            value={newCases}
            subtitle="Current Period"
            icon={CheckCircle2}
            variant="default"
            onClick={() => navigate('/police/cases')}
          />
          <StatCard
            title="Attention Required"
            value={attentionCases}
            subtitle="Score 41 - 70"
            icon={AlertTriangle}
            variant="warning"
            onClick={() => navigate('/police/cases?status=attention')}
          />
          <StatCard
            title="Urgent Cases"
            value={urgentCases}
            subtitle="Score 71+"
            icon={ShieldAlert}
            variant="danger"
            onClick={() => navigate('/police/cases?status=urgent')}
          />
        </div>
      </div>

      {/* PRIORITY CASES TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Priority Cases</h2>
            <p className="text-xs text-slate-500">
              Active operational cases requiring officer monitoring
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/police/cases')}
          >
            View All Cases
          </Button>
        </div>

        <CaseTable cases={casesNeedingAttention.length > 0 ? casesNeedingAttention : cases} role="police" />
      </div>

      {/* RECENT ACTIVITY LIST */}
      <div className="bg-white rounded-md p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Recent Logged Activity</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Real-time Stream</span>
        </div>

        {cases.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No recent logged activity available.</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {cases.slice(0, 4).map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-800">{c.caseId}</span>
                  <span className="text-slate-600">{c.activity || `Case check-in completed (${c.policeStation})`}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{c.lastCheckIn || c.registeredOn}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

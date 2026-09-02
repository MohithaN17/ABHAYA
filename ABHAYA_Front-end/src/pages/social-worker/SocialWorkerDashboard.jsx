import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import StatCard from '../../components/StatCard';
import CaseCard from '../../components/CaseCard';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/ui/Button';
import { HeartHandshake, ShieldAlert, AlertTriangle, ShieldCheck, ArrowRight, HeartPulse } from 'lucide-react';

export default function SocialWorkerDashboard() {
  const { globalSearch } = useOutletContext() || {};
  const { cases, loading, error } = useCases('social-worker', { search: globalSearch });
  const navigate = useNavigate();

  if (loading) return <LoadingState message="Loading Social Work Dashboard..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load social work cases"
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

  // Metric counts
  const total = cases.length;
  const stable = cases.filter(c => c.wellBeingScore <= 40).length;
  const attention = cases.filter(c => c.wellBeingScore >= 41 && c.wellBeingScore <= 70).length;
  const urgent = cases.filter(c => c.wellBeingScore >= 71).length;

  // Priority Cases sorted by highest distress score first
  const priorityCases = [...cases]
    .filter(c => c.wellBeingScore >= 41)
    .sort((a, b) => b.wellBeingScore - a.wellBeingScore);

  return (
    <div className="space-y-6">
      {/* Overview Metrics Row */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Support Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Total Assigned Cases"
            value={total}
            subtitle="Support Bureau"
            icon={HeartHandshake}
            variant="default"
            onClick={() => navigate('/social-worker/cases')}
          />
          <StatCard
            title="Stable (0-40)"
            value={stable}
            subtitle="Low Distress Index"
            icon={ShieldCheck}
            variant="success"
            onClick={() => navigate('/social-worker/cases?status=stable')}
          />
          <StatCard
            title="Attention Required"
            value={attention}
            subtitle="Score 41 - 70"
            icon={AlertTriangle}
            variant="warning"
            onClick={() => navigate('/social-worker/cases?status=attention')}
          />
          <StatCard
            title="Urgent Support"
            value={urgent}
            subtitle="Score 71+"
            icon={ShieldAlert}
            variant="danger"
            onClick={() => navigate('/social-worker/priority')}
          />
        </div>
      </div>

      {/* Priority Cases Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-800" />
              Priority Cases Queue
            </h2>
            <p className="text-xs text-slate-500">
              Cases requiring counseling review and human intervention
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/social-worker/priority')}
          >
            View Priority Queue
          </Button>
        </div>

        {priorityCases.length === 0 ? (
          <EmptyState
            title="No priority cases"
            description="There are currently no high-distress priority cases assigned."
            icon={HeartPulse}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {priorityCases.map((c) => (
              <CaseCard key={c.id} c={c} role="social-worker" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

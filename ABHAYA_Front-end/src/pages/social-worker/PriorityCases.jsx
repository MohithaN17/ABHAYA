import React from 'react';
import { useCases } from '../../hooks/useCases';
import CaseCard from '../../components/CaseCard';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { ShieldAlert } from 'lucide-react';

export default function PriorityCases() {
  const { cases, loading, error } = useCases('social-worker');

  if (loading) return <LoadingState message="Loading high-distress priority queue..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load priority cases"
        description={error}
        isError={true}
      />
    );
  }

  const priorityCases = cases
    .filter((c) => c.wellBeingScore >= 41)
    .sort((a, b) => b.wellBeingScore - a.wellBeingScore);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-800" />
          High-Distress Priority Queue
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Priority cases requiring counseling review ({priorityCases.length} records)
        </p>
      </div>

      {priorityCases.length === 0 ? (
        <EmptyState
          title="No priority cases"
          description="There are currently no cases flagged in Attention or Urgent brackets."
          icon={ShieldAlert}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {priorityCases.map((c) => (
            <CaseCard key={c.id} c={c} role="social-worker" />
          ))}
        </div>
      )}
    </div>
  );
}

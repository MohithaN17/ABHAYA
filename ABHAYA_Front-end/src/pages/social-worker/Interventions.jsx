import React from 'react';
import { useCases } from '../../hooks/useCases';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { HeartPulse, Award } from 'lucide-react';

export default function Interventions() {
  const { cases, loading, error } = useCases('social-worker');

  if (loading) return <LoadingState message="Loading intervention protocols..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load intervention protocols"
        description={error}
        isError={true}
      />
    );
  }

  const getRecommendedStep = (score) => {
    if (score >= 71) return "Immediate Emergency Tele-Counseling & Protection Protocols";
    if (score >= 41) return "Bi-weekly Trauma Recovery Sessions & Stress Reduction";
    return "Monthly Maintenance Check-in & Self-Guided Coping Resources";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-slate-700" />
          Counseling Interventions Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Standardized intervention protocols mapped to case distress indices ({cases.length} records)
        </p>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="No interventions required"
          description="Assigned cases and intervention recommendations will appear here."
          icon={HeartPulse}
        />
      ) : (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Case Reference</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Recommended Next Step</th>
                  <th className="px-4 py-3">Assigned Counselor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{c.caseId}</span>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.firNo}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge score={c.wellBeingScore} category={c.wellBeingCategory} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium max-w-sm">
                      {getRecommendedStep(c.wellBeingScore)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        {c.assignedSocialWorker || 'Dr. Ananya Roy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

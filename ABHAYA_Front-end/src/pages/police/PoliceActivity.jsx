import React from 'react';
import { useCases } from '../../hooks/useCases';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { Activity, Clock, FileCheck } from 'lucide-react';

export default function PoliceActivity() {
  const { cases, loading, error } = useCases('police');

  if (loading) return <LoadingState message="Loading station activity stream..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load activity logs"
        description={error}
        isError={true}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-700" />
          Station Activity Stream
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Recent operational activity logs and station updates ({cases.length} records)
        </p>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="No logged activity"
          description="Station activity logs will appear after case updates occur."
          icon={Activity}
        />
      ) : (
        <div className="bg-white rounded-md p-4 border border-slate-200 space-y-3">
          <div className="space-y-3 text-xs">
            {cases.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                    <span className="font-mono font-bold text-slate-900">{c.caseId}</span>
                    <span className="font-semibold text-slate-700">[{c.caseType}]</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {c.lastCheckIn || c.registeredOn}
                  </span>
                </div>
                <p className="text-slate-700 pl-5 leading-relaxed">
                  {c.activity || `Case registered under ${c.policeStation}. Status: ${c.wellBeingCategory}.`}
                </p>
                <div className="pl-5 text-[11px] text-slate-500">
                  Assigned Officer: <span className="font-semibold text-slate-800">{c.assignedOfficer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

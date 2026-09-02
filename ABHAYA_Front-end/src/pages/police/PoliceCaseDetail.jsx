import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCaseDetail } from '../../hooks/useCases';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import {
  ArrowLeft,
  Shield,
  Lock,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  FileText
} from 'lucide-react';

export default function PoliceCaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { caseData, loading, error } = useCaseDetail(caseId, 'police');

  if (loading) return <LoadingState message="Loading official case file..." />;
  
  if (error || !caseData) {
    return (
      <EmptyState
        title="Case Not Found"
        description={error || "The requested case record does not exist or access has been restricted."}
        isError={true}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/police/cases')}>
            Return to Case Directory
          </Button>
        }
      />
    );
  }

  const renderTrendText = (trend) => {
    if (trend === 'Deteriorating' || trend === 'increasing') {
      return <span className="text-rose-800 font-semibold inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Deteriorating Trend</span>;
    }
    if (trend === 'Improving' || trend === 'decreasing') {
      return <span className="text-emerald-800 font-semibold inline-flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5" /> Improving Trend</span>;
    }
    return <span className="text-slate-600 font-semibold inline-flex items-center gap-1"><Minus className="w-3.5 h-3.5" /> Stable Trend</span>;
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/police/cases')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Directory
        </button>
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-mono bg-white px-2.5 py-1 rounded border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          Police Privacy Boundary Active
        </span>
      </div>

      {/* Case Header Banner */}
      <div className="bg-slate-900 text-white rounded-md p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase tracking-wider border border-slate-700">
              OFFICIAL CASE FILE
            </span>
            <span className="text-xs text-slate-400 font-mono">FIR: {caseData.firNo}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{caseData.caseId}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{caseData.caseType}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge score={caseData.wellBeingScore} category={caseData.wellBeingCategory} size="md" />
        </div>
      </div>

      {/* Grid: Case Information & Well-Being Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Well-Being Aggregate Summary */}
        <div className="bg-white rounded-md p-5 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
            Well-Being Summary
          </h3>

          <div className="text-center p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Monitored Well-Being Score
            </span>
            <span className={`text-3xl font-extrabold font-mono ${
              caseData.wellBeingScore >= 71 ? 'text-rose-800' : caseData.wellBeingScore >= 41 ? 'text-amber-800' : 'text-emerald-800'
            }`}>
              {caseData.wellBeingScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
            </span>
            <div className="mt-2 text-xs flex justify-center">{renderTrendText(caseData.trend)}</div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Status Category:</span>
              <span className="font-semibold text-slate-900">{caseData.wellBeingCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Last System Sync:</span>
              <span className="font-mono text-slate-900">{caseData.lastCheckIn || 'Recent'}</span>
            </div>
          </div>

          {/* Privacy Protocol Notice */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
            <p className="font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-800">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              Role Security Policy
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Per victim protection standards, raw victim chat transcripts and detailed AI diagnostic explanation signals are restricted from law enforcement view.
            </p>
          </div>
        </div>

        {/* Right Column: Case Information Specifications */}
        <div className="lg:col-span-2 bg-white rounded-md p-5 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
            Case Information Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Case Identifier</span>
              <p className="font-bold text-slate-900">{caseData.caseId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">FIR Status / Number</span>
              <p className="font-mono font-bold text-slate-900">{caseData.firNo}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Police Station Jurisdiction</span>
              <p className="font-semibold text-slate-900">{caseData.policeStation}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Assigned Investigating Officer</span>
              <p className="font-semibold text-slate-900">{caseData.assignedOfficer}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Incident Date</span>
              <p className="font-semibold text-slate-900">{caseData.incidentDate}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Registration Date</span>
              <p className="font-semibold text-slate-900">{caseData.registeredOn}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 sm:col-span-2 space-y-0.5">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Incident Location</span>
              <p className="font-semibold text-slate-900">{caseData.incidentLocation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

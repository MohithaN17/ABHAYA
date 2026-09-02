import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCaseDetail } from '../../hooks/useCases';
import { getDistressHistory, getDistressExplanation } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import DistressChart from '../../components/DistressChart';
import AIExplanation from '../../components/AIExplanation';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import {
  ArrowLeft,
  HeartHandshake,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckSquare,
  XSquare,
  Save,
  CheckCircle2,
  UserCheck,
  Clock,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';

export default function SocialWorkerCaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { caseData, loading, error, submittingReview, submitReview } = useCaseDetail(caseId, 'social-worker');

  const [distressHistory, setDistressHistory] = useState([]);
  const [aiExplanation, setAiExplanation] = useState({ signals: [] });

  // Human Review Form State
  const [reviewAction, setReviewAction] = useState('confirmed'); // 'confirmed' | 'false_alert'
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (caseId) {
      getDistressHistory(caseId).then(setDistressHistory).catch(console.error);
      getDistressExplanation(caseId).then(setAiExplanation).catch(console.error);
    }
  }, [caseId]);

  useEffect(() => {
    if (caseData?.humanReview) {
      setReviewAction(caseData.humanReview.action);
      setReviewNotes(caseData.humanReview.notes || '');
    }
  }, [caseData]);

  if (loading) return <LoadingState message="Loading victim case file & distress assessment workspace..." />;
  
  if (error || !caseData) {
    return (
      <EmptyState
        title="Case File Unavailable"
        description={error || "The specified victim case record could not be loaded."}
        isError={true}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/social-worker/cases')}>
            Return to Case Directory
          </Button>
        }
      />
    );
  }

  const handleSaveReview = async (e) => {
    e.preventDefault();
    try {
      await submitReview(reviewAction, reviewNotes);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      alert("Failed to log review action: " + err.message);
    }
  };

  const renderTrendText = (trend) => {
    if (trend === 'Deteriorating' || trend === 'increasing') {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-rose-800 text-xs">
          <TrendingUp className="w-3.5 h-3.5" /> Worsening Trend
        </span>
      );
    }
    if (trend === 'Improving' || trend === 'decreasing') {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 text-xs">
          <TrendingDown className="w-3.5 h-3.5" /> Improving Trend
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-slate-600 text-xs">
        <Minus className="w-3.5 h-3.5" /> Stable Trend
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/social-worker/cases')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Social Work Directory
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/social-worker/interventions')}
        >
          Interventions List
        </Button>
      </div>

      {/* 1. CASE HEADER */}
      <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">
              SOCIAL WORK FILE
            </span>
            <span className="text-xs text-slate-500 font-mono">FIR: {caseData.firNo}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{caseData.caseId}</h1>
          <p className="text-xs font-medium text-slate-600 mt-0.5">{caseData.caseType}</p>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-xs text-slate-600">
          <StatusBadge score={caseData.wellBeingScore} category={caseData.wellBeingCategory} size="md" />
          <p className="text-[11px] text-slate-500 mt-1">
            Assigned Counselor: <span className="font-semibold text-slate-800">{caseData.assignedSocialWorker || 'Dr. Ananya Roy'}</span>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Last Check-In: {caseData.lastCheckIn || 'Recent'}
          </p>
        </div>
      </div>

      {/* 2. WELL-BEING ASSESSMENT */}
      <div className="bg-white rounded-md p-5 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
          Well-Being Assessment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Current Distress Score</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className={`text-2xl font-bold ${
                caseData.wellBeingScore >= 71 ? 'text-rose-800' : caseData.wellBeingScore >= 41 ? 'text-amber-800' : 'text-emerald-800'
              }`}>
                {caseData.wellBeingScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Category Status</span>
            <p className="text-sm font-semibold text-slate-900 mt-1">{caseData.wellBeingCategory}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Change Over Time</span>
            <div className="mt-1">{renderTrendText(caseData.trend)}</div>
          </div>
        </div>
      </div>

      {/* 3. DISTRESS TREND */}
      <div className="bg-white rounded-md p-5 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
          Distress Score Trajectory over Monitoring Intervals
        </h3>
        <DistressChart data={distressHistory} height={260} />
      </div>

      {/* 4. SYSTEM ASSESSMENT (AI Explanation) */}
      <AIExplanation
        signals={aiExplanation.signals.length ? aiExplanation.signals : caseData.aiSignals}
        disclaimer={aiExplanation.disclaimer}
      />

      {/* 5. HUMAN REVIEW WORKSPACE */}
      <div className="bg-white rounded-md p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-700" />
              Human-in-the-Loop Review & Intervention Action
            </h3>
            <p className="text-xs text-slate-500">
              Social worker verification required to validate automated risk indicators
            </p>
          </div>
          {caseData.humanReview && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Reviewed by {caseData.humanReview.reviewedBy}
            </span>
          )}
        </div>

        {reviewSuccess && (
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Human review action logged successfully.</span>
          </div>
        )}

        <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Review Action Workflow:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewAction('confirmed')}
                className={`p-2.5 rounded border font-semibold flex items-center justify-center gap-2 transition-colors ${
                  reviewAction === 'confirmed'
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-rose-700" />
                <span>Confirm Concern (Validate Risk)</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewAction('false_alert')}
                className={`p-2.5 rounded border font-semibold flex items-center justify-center gap-2 transition-colors ${
                  reviewAction === 'false_alert'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XSquare className="w-4 h-4 text-emerald-700" />
                <span>Mark False Alert (No Escalation)</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reviewNotes" className="block font-semibold text-slate-700 mb-1">
              Social Worker Review Note:
            </label>
            <textarea
              id="reviewNotes"
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter social worker observations or justification for review confirmation..."
              className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submittingReview}
              icon={Save}
            >
              Save Review Action
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

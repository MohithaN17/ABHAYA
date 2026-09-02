import React from 'react';
import { Info, Activity, AlertTriangle } from 'lucide-react';

export default function AIExplanation({ signals = [], disclaimer }) {
  const defaultDisclaimer = disclaimer || "AI assessment is decision support and does not constitute a final diagnosis.";

  return (
    <div className="bg-white rounded-md p-5 border border-slate-200 space-y-4">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h3 className="font-bold text-sm text-slate-900">Why was this case flagged?</h3>
        <p className="text-xs text-slate-500 mt-0.5">Automated signal analysis & anomaly detection indicators</p>
      </div>

      {/* Signals List */}
      <div className="space-y-2.5">
        {!signals || signals.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 italic">
            No specific automated risk indicators flagged for this case.
          </div>
        ) : (
          signals.map((sig, idx) => {
            const riskLevel = sig.riskLevel || sig.severity || 'Medium';
            const isHigh = riskLevel.toLowerCase() === 'high';
            const label = sig.label || sig.type || 'Signal Anomaly';
            const description = sig.description || sig.detail || '';

            return (
              <div
                key={sig.id || idx}
                className={`p-3 rounded border text-xs ${
                  isHigh
                    ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                    : 'bg-amber-50/50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-700' : 'text-amber-700'}`} />
                    <span>{label}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isHigh ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {riskLevel} Risk
                  </span>
                </div>
                {description && (
                  <p className="text-slate-700 text-xs leading-relaxed pl-5">{description}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Mandatory Decision Support Disclaimer */}
      <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-900 text-xs">{defaultDisclaimer}</p>
          <p className="text-[11px] text-slate-500">
            Algorithmic score estimation is designed for decision support only. Social worker human review is required before executing intervention protocols.
          </p>
        </div>
      </div>
    </div>
  );
}

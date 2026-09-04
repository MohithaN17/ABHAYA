import React, { useState } from 'react';

export default function SocialWorkerDashboard() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);

  // Mock Active Triage List
  const [cases, setCases] = useState([
    {
      caseId: 'KA-2026-BLR-002',
      victimName: 'Rajeshwari M',
      riskScore: 82.5,
      riskLevel: 'Urgent Attention',
      status: 'Intervention Required',
      checkinResponse: 'Distressed',
      missedCheckins: 2,
      voiceStressScore: 78.4,
      aiExplanations: [
        'Recent check-in self-reported elevated emotional distress.',
        'Multiple consecutive missed wellbeing check-ins (2 missed).',
        'Acoustic analysis flagged notable vocal tremor, lower energy, and irregular pause patterns.'
      ],
      trendline: [40, 45, 52, 58, 65, 74, 82],
      history: [
        { date: '04-Sep-2026', note: 'Distress spike flagged by AI voice analysis.' },
        { date: '02-Sep-2026', note: 'Missed scheduled check-in window.' }
      ]
    },
    {
      caseId: 'KA-2026-BLR-001',
      victimName: 'Ananya S',
      riskScore: 22.0,
      riskLevel: 'Low',
      status: 'Monitoring',
      checkinResponse: 'Good',
      missedCheckins: 0,
      voiceStressScore: 18.0,
      aiExplanations: ['All baseline distress signals are currently within the stable threshold.'],
      trendline: [30, 28, 25, 26, 22, 21, 22],
      history: [
        { date: '03-Sep-2026', note: 'Routine check-in completed positively.' }
      ]
    }
  ]);

  const handleUpdateStatus = (caseId, newStatus) => {
    setCases(cases.map(c => c.caseId === caseId ? { ...c, status: newStatus } : c));
    if (selectedCase && selectedCase.caseId === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus });
    }
  };

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center mb-6 border border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-1 rounded">
            Care Coordination Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Social Worker Casework Desk</h1>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-slate-100 border text-slate-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
            Active Assigned: {cases.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage Priority Column */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-3">Priority Alert Triage</h2>
          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.caseId}
                onClick={() => setSelectedCase(c)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedCase?.caseId === c.caseId ? 'border-purple-600 bg-purple-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-slate-800">{c.victimName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    c.riskScore > 60 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {c.riskScore} / 100
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{c.caseId}</span>
                  <span className="font-medium text-purple-900">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Detail / AI Explainability / Trendline Column */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Top Case Summary Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedCase.victimName}</h2>
                    <p className="text-xs text-slate-500">Case ID: {selectedCase.caseId} • Status: <span className="font-semibold text-purple-700">{selectedCase.status}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedCase.caseId, 'Reviewing')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Mark In Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedCase.caseId, 'Intervened')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-800 text-white"
                    >
                      Resolve / Intervened
                    </button>
                  </div>
                </div>

                {/* AI Explainability Box */}
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-bold text-purple-900 mb-2">AI Distress Explainability (Why Flagged?)</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-purple-800">
                    {selectedCase.aiExplanations.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                </div>

                {/* Simulated 7-Day Distress Trendline */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Distress Trajectory (Last 7 Data Points)</h3>
                  <div className="flex items-end gap-3 h-28 pt-4 pb-2 border-b border-slate-200">
                    {selectedCase.trendline.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t transition-all ${val > 60 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ height: `${val}%` }}
                        ></div>
                        <span className="text-[10px] text-slate-500">{val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Timeline progression from earliest check-in to latest.</p>
                </div>

                {/* Actions & Alerts */}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <button
                    onClick={handleSendNotification}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition"
                  >
                    Send Wellbeing Reassurance Notification
                  </button>
                  {notificationSent && (
                    <span className="text-xs text-green-600 font-semibold animate-fade-in">
                      Reassurance alert dispatched to victim device ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-slate-500 text-sm">Select a case from the triage list to view distress explainability, trendlines, and intervention workflows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
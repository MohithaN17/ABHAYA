import React, { useState } from 'react';

export default function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState('cases'); // 'cases', 'register', 'analytics'
  const [geoLevel, setGeoLevel] = useState('national'); // 'national', 'state', 'district'

  // Mock Onboarding Form State
  const [formData, setFormData] = useState({
    firNumber: '',
    caseType: 'Harassment',
    victimName: '',
    phone: '',
    hasSmartphone: true,
    district: 'Bengaluru Urban'
  });

  const [registeredCases, setRegisteredCases] = useState([
    {
      caseId: 'KA-2026-BLR-001',
      victimName: 'Ananya S',
      firNumber: 'FIR-402/2026',
      type: 'Harassment',
      date: '04-Sept-2026',
      status: 'Investigation Started',
      wellbeing: 'Stable',
      smartphone: 'Yes'
    },
    {
      caseId: 'KA-2026-BLR-002',
      victimName: 'Rajeshwari M',
      firNumber: 'FIR-409/2026',
      type: 'Threats',
      date: '02-Sept-2026',
      status: 'FIR Registered',
      wellbeing: 'Urgent Support',
      smartphone: 'No (IVR Assigned)'
    }
  ]);

  const handleRegister = (e) => {
    e.preventDefault();
    const newCaseId = `KA-2026-BLR-00${registeredCases.length + 1}`;
    const newEntry = {
      caseId: newCaseId,
      victimName: formData.victimName,
      firNumber: formData.firNumber || 'FIR-PENDING',
      type: formData.caseType,
      date: 'Today',
      status: 'Complaint Registered',
      wellbeing: 'Stable',
      smartphone: formData.hasSmartphone ? 'Yes' : 'No (IVR Dispatched)'
    };
    setRegisteredCases([newEntry, ...registeredCases]);
    alert(`Case successfully registered! Generated Case ID: ${newCaseId}`);
    setActiveTab('cases');
  };

  // Hierarchical Analytics Data (Correction #4: National -> State -> District)
  const analyticsData = {
    national: {
      label: 'National Overview (All India)',
      totalCases: 12450,
      activeCases: 8210,
      highRisk: 1120,
      assistanceRequests: 2450,
      avgDistressScore: 34.2
    },
    state: {
      label: 'State View (Karnataka)',
      totalCases: 1240,
      activeCases: 820,
      highRisk: 105,
      assistanceRequests: 230,
      avgDistressScore: 38.6
    },
    district: {
      label: 'District View (Bengaluru Urban)',
      totalCases: 340,
      activeCases: 225,
      highRisk: 31,
      assistanceRequests: 72,
      avgDistressScore: 41.5
    }
  };

  const currentStats = analyticsData[geoLevel];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center mb-6 border border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-1 rounded">
            Government of Karnataka • Police Command Portal[cite: 1]
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Station Dashboard - Vijayanagar Police Station[cite: 1]</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'cases' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            All Cases
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'register' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            + Register New Case[cite: 1]
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'analytics' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Hierarchical Analytics
          </button>
        </div>
      </div>

      {/* TAB 1: ALL CASES */}
      {activeTab === 'cases' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Active Case Records[cite: 1]</h2>
            <span className="text-xs text-slate-500 font-medium">Privacy Guard: Raw victim interaction & psychological chat transcripts are restricted from officer view[cite: 1].</span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-xs uppercase font-semibold text-slate-700">
              <tr>
                <th className="p-3">Case ID[cite: 1]</th>
                <th className="p-3">Victim Name</th>
                <th className="p-3">FIR Number[cite: 1]</th>
                <th className="p-3">Case Type[cite: 1]</th>
                <th className="p-3">Case Status[cite: 1]</th>
                <th className="p-3">Well-being Status[cite: 1]</th>
                <th className="p-3">Device[cite: 1]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {registeredCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-blue-900">{c.caseId}</td>
                  <td className="p-3">{c.victimName}</td>
                  <td className="p-3">{c.firNumber}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{c.status}</span></td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      c.wellbeing === 'Urgent Support' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {c.wellbeing}
                    </span>
                  </td>
                  <td className="p-3">{c.smartphone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: REGISTER NEW CASE */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Register Victim & Initiate Support Case[cite: 1]</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">FIR / Complaint Number[cite: 1]</label>
              <input
                type="text"
                required
                placeholder="e.g. FIR-452/2026"
                className="w-full p-2 border rounded-lg text-sm"
                value={formData.firNumber}
                onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Case Type[cite: 1]</label>
                <select
                  className="w-full p-2 border rounded-lg text-sm"
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                >
                  <option>Harassment[cite: 1]</option>
                  <option>Threats[cite: 1]</option>
                  <option>Theft[cite: 1]</option>
                  <option>Land Dispute[cite: 1]</option>
                  <option>Other Atrocity</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Victim Name[cite: 1]</label>
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={formData.victimName}
                  onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Registered Phone Number (OTP Verified)[cite: 1]</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                className="w-full p-2 border rounded-lg text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="smartphone"
                checked={formData.hasSmartphone}
                onChange={(e) => setFormData({ ...formData, hasSmartphone: e.target.checked })}
              />
              <label htmlFor="smartphone" className="text-sm font-medium text-slate-700">
                Victim has active smartphone with internet (if unchecked, automated IVRS fallback activates)[cite: 1]
              </label>
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Generate Case ID & Register Victim[cite: 1]
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: HIERARCHICAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          {/* Level Switcher */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
            <span className="text-sm font-bold text-slate-700">Hierarchical Drilldown:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setGeoLevel('national')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-l-lg border ${geoLevel === 'national' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700'}`}
              >
                1. National (India)
              </button>
              <button
                onClick={() => setGeoLevel('state')}
                className={`px-4 py-1.5 text-xs font-semibold border-t border-b ${geoLevel === 'state' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700'}`}
              >
                2. State (Karnataka)
              </button>
              <button
                onClick={() => setGeoLevel('district')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-r-lg border ${geoLevel === 'district' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700'}`}
              >
                3. District (Bengaluru Urban)
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-500">Total Registered Cases</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{currentStats.totalCases.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-500">Active Monitored Cases</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{currentStats.activeCases.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-500">High / Critical Distress</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{currentStats.highRisk.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-500">Assistance Requests</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">{currentStats.assistanceRequests.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-2">Aggregated View: {currentStats.label}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Aggregated metrics update dynamically based on the hierarchy level without splitting into disconnected dashboards.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${(currentStats.highRisk / currentStats.activeCases) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>High Risk Proportion: {((currentStats.highRisk / currentStats.activeCases) * 100).toFixed(1)}%</span>
              <span>Avg Distress Score: {currentStats.avgDistressScore} / 100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
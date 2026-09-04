import React, { useState } from 'react';
import OfficerDashboard from './components/OfficerDashboard';
import SocialWorkerDashboard from './components/SocialWorkerDashboard';

export default function App() {
  const [currentPortal, setCurrentPortal] = useState('social_worker'); // 'officer' or 'social_worker'

  return (
    <div>
      {/* Top Universal Portal Switcher Navigation */}
      <nav className="bg-slate-900 text-white px-6 py-2 flex justify-between items-center border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-blue-400">ABHAYA SYSTEM</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">SIH26094 Prototype</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPortal('officer')}
            className={`px-3 py-1 rounded font-semibold transition ${
              currentPortal === 'officer' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Officer Dashboard
          </button>
          <button
            onClick={() => setCurrentPortal('social_worker')}
            className={`px-3 py-1 rounded font-semibold transition ${
              currentPortal === 'social_worker' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Social Worker Dashboard
          </button>
        </div>
      </nav>

      {/* Render Selected View */}
      {currentPortal === 'officer' ? <OfficerDashboard /> : <SocialWorkerDashboard />}
    </div>
  );
}
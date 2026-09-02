import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white uppercase">ABHAYA</h1>
            <p className="text-xs text-slate-400">Institutional Victim Support System</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded border border-slate-700">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Institutional Secure Portal</span>
        </div>
      </header>

      {/* Main Form Box Outlet */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 z-10 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 ABHAYA Case Support System. All rights reserved.</p>
        <p className="text-[11px] text-slate-500">Authorized law enforcement & social welfare operations only.</p>
      </footer>
    </div>
  );
}

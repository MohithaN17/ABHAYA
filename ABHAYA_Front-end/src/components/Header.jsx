import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut, Shield, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({
  title,
  subtitle,
  onNotificationClick,
  unreadCount = 0,
  onSearchChange,
  searchValue = ''
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const isPolice = role === 'police';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title and Context */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {title || (isPolice ? 'Police Overview Dashboard' : 'Social Worker Case Dashboard')}
            </h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${isPolice ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
              {isPolice ? 'Law Enforcement' : 'Social Welfare'}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={isPolice ? "Search Case ID / FIR..." : "Search Case / Victim ID..."}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all"
            />
          </div>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Info & Quick Sign Out */}
          <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || (isPolice ? 'Officer' : 'Counselor')}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role ? role.replace('-', ' ') : 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  HeartHandshake,
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  Activity,
  HeartPulse,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Settings,
  UserCheck,
  UserPlus
} from 'lucide-react';

export default function Sidebar({ role = 'police' }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const normRole = (role || '').toLowerCase().replace('-', '_').trim();
  const userNormRole = (user?.role || '').toLowerCase().replace('-', '_').trim();

  const isPolice = normRole === 'police';
  const isAdmin = userNormRole === 'admin' || normRole === 'admin';

  const policeNav = [
    { label: 'Overview', path: '/police', icon: LayoutDashboard },
    { label: 'Cases', path: '/police/cases', icon: FolderKanban },
    { label: 'Alerts', path: '/police/alerts', icon: AlertTriangle },
    { label: 'Activity', path: '/police/activity', icon: Activity },
  ];

  const socialWorkerNav = [
    { label: 'Overview', path: '/social-worker', icon: LayoutDashboard },
    { label: 'Cases', path: '/social-worker/cases', icon: FolderKanban },
    { label: 'Priority Cases', path: '/social-worker/priority', icon: ShieldAlert },
    { label: 'Interventions', path: '/social-worker/interventions', icon: HeartPulse },
    { label: 'Alerts', path: '/social-worker/alerts', icon: AlertTriangle },
  ];

  const adminNav = [
    { label: 'User Administration', path: '/admin/users', icon: UserPlus },
    { label: 'Police Portal', path: '/police', icon: Shield },
    { label: 'Social Work Portal', path: '/social-worker', icon: HeartHandshake },
  ];

  const navItems = isAdmin ? adminNav : (isPolice ? policeNav : socialWorkerNav);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-slate-900 text-slate-100 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 transition-all duration-200 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex-shrink-0">
              {isAdmin ? <UserPlus className="w-5 h-5" /> : (isPolice ? <Shield className="w-5 h-5" /> : <HeartHandshake className="w-5 h-5" />)}
            </div>
            {!collapsed && (
              <div className="whitespace-nowrap">
                <h1 className="font-bold text-sm tracking-wide text-white uppercase">ABHAYA</h1>
                <p className="text-[11px] font-medium text-slate-400">
                  Case Support System
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Portal Banner */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700/60 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400' : (isPolice ? 'bg-blue-400' : 'bg-teal-400')}`}></span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
              {isAdmin ? 'System Admin Portal' : (isPolice ? 'Police Officer Portal' : 'Social Worker Portal')}
            </span>
          </div>
        )}

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/police' || item.path === '/social-worker' || item.path === '/admin/users'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-slate-300'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Account / Footer Section */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {!collapsed && (
          <div className="px-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Account
          </div>
        )}

        <div className={`flex items-center gap-2.5 p-2 rounded bg-slate-800/40 border border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 border border-slate-700">
            <UserCheck className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || (isAdmin ? 'System Admin' : (isPolice ? 'Officer In-Charge' : 'Counselor'))}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user?.badgeId || user?.role}</p>
            </div>
          )}
        </div>

        <div className="pt-1 space-y-1">
          {!collapsed ? (
            <>
              <button
                onClick={() => alert("System settings are managed by department administrator.")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

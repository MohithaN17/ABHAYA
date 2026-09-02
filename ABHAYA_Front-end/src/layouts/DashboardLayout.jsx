import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../services/api';

export default function DashboardLayout({ role = 'police' }) {
  const { user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const location = useLocation();

  const normRole = (role || '').toLowerCase().replace('-', '_').trim();

  useEffect(() => {
    getNotifications(normRole).then(setNotifications).catch(console.error);
  }, [normRole, location.pathname]);

  const getTitle = () => {
    const p = location.pathname;
    if (p.includes('/police/cases')) return 'Case Management Directory';
    if (p.includes('/police/alerts')) return 'Urgent Police Alert Logs';
    if (p.includes('/police/activity')) return 'Station Case Activity Stream';
    if (p.includes('/social-worker/cases')) return 'Victim Distress Case Files';
    if (p.includes('/social-worker/priority')) return 'High Distress Priority Queue';
    if (p.includes('/social-worker/interventions')) return 'Counseling Interventions';
    if (p.includes('/social-worker/alerts')) return 'Mental Health Risk Notifications';
    if (p.includes('/admin/users')) return 'User Administration & Controlled Registration';
    return normRole === 'police' ? 'Police Overview Dashboard' : (normRole === 'admin' ? 'System Administration' : 'Social Worker Case Dashboard');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar role={normRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={getTitle()}
          onNotificationClick={() => setIsNotifOpen(true)}
          unreadCount={unreadCount}
          searchValue={globalSearch}
          onSearchChange={setGlobalSearch}
        />
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          <Outlet context={{ globalSearch, setGlobalSearch }} />
        </main>
      </div>
      <NotificationPanel
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        role={normRole}
      />
    </div>
  );
}

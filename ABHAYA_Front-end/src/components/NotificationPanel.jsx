import React from 'react';
import { X, Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel({ isOpen, onClose, notifications = [], role = 'police' }) {
  const navigate = useNavigate();
  const isPolice = role === 'police';

  if (!isOpen) return null;

  const handleNotificationClick = (n) => {
    onClose();
    if (n.caseId || n.case_id) {
      const cId = n.caseId || n.case_id;
      const path = isPolice ? `/police/cases/${cId}` : `/social-worker/cases/${cId}`;
      navigate(path);
    }
  };

  const getIcon = (type) => {
    if (type === 'urgent') return <ShieldAlert className="w-4 h-4 text-rose-700" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-700" />;
    return <Info className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-lg flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-sm">System Notifications</h3>
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Feed */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No active notifications</p>
              <p className="mt-1">System alerts requiring operational review will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded border text-xs cursor-pointer transition-colors ${
                  n.read_status === 'false' || !n.read ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{getIcon(n.type || 'info')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => {
              onClose();
              navigate(isPolice ? '/police/alerts' : '/social-worker/alerts');
            }}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            View All Alert Logs &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

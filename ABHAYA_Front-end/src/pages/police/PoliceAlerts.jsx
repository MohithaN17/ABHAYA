import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../../services/api';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { ShieldAlert, Info, ArrowRight, Bell } from 'lucide-react';

export default function PoliceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications('police')
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load notifications");
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Fetching urgent police alert feed..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load notifications"
        description={error}
        isError={true}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          Station Alert Logs
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time automated alert notifications ({alerts.length} records)
        </p>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          title="No active alerts"
          description="There are no active alert logs requiring law enforcement review."
          icon={Bell}
        />
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-md border text-xs ${
                a.type === 'urgent'
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-slate-100 border border-slate-200 mt-0.5">
                    {a.type === 'urgent' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-700" />
                    ) : (
                      <Info className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{a.title}</h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {a.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{a.message}</p>
                  </div>
                </div>

                {(a.caseId || a.case_id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => navigate(`/police/cases/${a.caseId || a.case_id}`)}
                    className="self-start sm:self-center"
                  >
                    View File
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

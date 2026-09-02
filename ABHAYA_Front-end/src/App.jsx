import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingState from './components/LoadingState';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth & Admin Pages
import Login from './pages/Login';
import AdminUsers from './pages/admin/AdminUsers';

// Police Pages
import PoliceDashboard from './pages/police/PoliceDashboard';
import PoliceCases from './pages/police/PoliceCases';
import PoliceCaseDetail from './pages/police/PoliceCaseDetail';
import PoliceAlerts from './pages/police/PoliceAlerts';
import PoliceActivity from './pages/police/PoliceActivity';

// Social Worker Pages
import SocialWorkerDashboard from './pages/social-worker/SocialWorkerDashboard';
import SocialWorkerCases from './pages/social-worker/SocialWorkerCases';
import SocialWorkerCaseDetail from './pages/social-worker/SocialWorkerCaseDetail';
import PriorityCases from './pages/social-worker/PriorityCases';
import Interventions from './pages/social-worker/Interventions';
import SocialWorkerAlerts from './pages/social-worker/SocialWorkerAlerts';

/**
 * Normalizes role string to canonical representation (e.g., 'social-worker' -> 'social_worker')
 */
function normalizeRole(role) {
  if (!role) return '';
  return role.toLowerCase().replace('-', '_').trim();
}

/**
 * ProtectedRoute — enforces authentication & role security boundaries.
 * Renders LoadingState while restoring Supabase Auth session.
 */
function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingState message="Restoring secure Supabase session..." />
      </div>
    );
  }

  // Fallback: read directly from localStorage if state hasn't flushed yet
  let effectiveAuthenticated = isAuthenticated;
  let effectiveRole = role;

  if (!effectiveAuthenticated) {
    try {
      const raw = localStorage.getItem('abhaya_user');
      if (raw) {
        const stored = JSON.parse(raw);
        if (stored?.role) {
          effectiveAuthenticated = true;
          effectiveRole = stored.role;
        }
      }
    } catch {}
  }

  if (!effectiveAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normEffective = normalizeRole(effectiveRole);
  const normAllowed = normalizeRole(allowedRole);

  // Admin users have access to admin portal as well as staff portals
  if (normEffective === 'admin') {
    return <Outlet />;
  }

  // Victim role MUST NOT access police or social-worker dashboards
  if (normEffective === 'victim') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Victim Account Access</h2>
          <p className="text-slate-400 text-sm max-w-md">
            Victim accounts must access their personal safety dashboard via the mobile app or victim portal. Access to institutional dashboards is restricted.
          </p>
        </div>
      </div>
    );
  }

  if (normAllowed && normEffective !== normAllowed) {
    return <Navigate to={normEffective === 'police' ? '/police' : '/social-worker'} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default: redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* ── Admin Controlled Registration Portal ──────────────── */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* ── Police Officer Portal ───────────────────────────── */}
          <Route element={<ProtectedRoute allowedRole="police" />}>
            <Route element={<DashboardLayout role="police" />}>
              <Route path="/police" element={<PoliceDashboard />} />
              <Route path="/police/cases" element={<PoliceCases />} />
              <Route path="/police/cases/:caseId" element={<PoliceCaseDetail />} />
              <Route path="/police/alerts" element={<PoliceAlerts />} />
              <Route path="/police/activity" element={<PoliceActivity />} />
            </Route>
          </Route>

          {/* ── Social Worker Portal ────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRole="social_worker" />}>
            <Route element={<DashboardLayout role="social_worker" />}>
              <Route path="/social-worker" element={<SocialWorkerDashboard />} />
              <Route path="/social-worker/cases" element={<SocialWorkerCases />} />
              <Route path="/social-worker/cases/:caseId" element={<SocialWorkerCaseDetail />} />
              <Route path="/social-worker/priority" element={<PriorityCases />} />
              <Route path="/social-worker/interventions" element={<Interventions />} />
              <Route path="/social-worker/alerts" element={<SocialWorkerAlerts />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

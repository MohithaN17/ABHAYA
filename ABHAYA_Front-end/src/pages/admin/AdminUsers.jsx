import React, { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, toggleUserStatus } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import {
  UserPlus,
  Shield,
  HeartHandshake,
  BadgeCheck,
  Mail,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
  UserX,
  UserCheck,
  EyeOff
} from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [roleTab, setRoleTab] = useState('police'); // 'police' | 'social_worker'
  const [badgeId, setBadgeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stationOrOrg, setStationOrOrg] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!badgeId.trim()) {
      setFormError(roleTab === 'police' ? 'Officer ID is required.' : 'Worker ID is required.');
      return;
    }
    if (!fullName.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid email address is required.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!stationOrOrg.trim()) {
      setFormError(roleTab === 'police' ? 'Police Station / Department is required.' : 'Organization is required.');
      return;
    }

    setFormLoading(true);
    try {
      await createAdminUser({
        badge_id: badgeId.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: roleTab,
        police_station: stationOrOrg.trim()
      });

      setFormSuccess(`${roleTab === 'police' ? 'Police Officer' : 'Social Worker'} registered successfully.`);
      setBadgeId('');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setStationOrOrg('');
      fetchUsers();
    } catch (err) {
      if (err.message.includes('Officer ID already registered')) {
        setFormError('Officer ID already registered.');
      } else if (err.message.includes('email is already associated')) {
        setFormError('This email is already associated with an ABHAYA account.');
      } else {
        setFormError(err.message || 'Registration failed.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (userObj) => {
    const newStatus = !userObj.is_active;
    const actionText = newStatus ? 'Reactivate' : 'Deactivate';
    if (!window.confirm(`Are you sure you want to ${actionText.toLowerCase()} user ${userObj.badge_id || userObj.full_name}?`)) {
      return;
    }

    try {
      await toggleUserStatus(userObj.id, newStatus);
      fetchUsers();
    } catch (err) {
      alert(`Failed to update user status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-700" />
            User Administration & Controlled Registration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorized System Registrar Portal • Register and manage Police Officers &amp; Social Workers
          </p>
        </div>
        <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto font-bold">
          ADMIN ACCESS ONLY
        </span>
      </div>

      {/* 1. CONTROLLED USER REGISTRATION FORM */}
      <div className="bg-white rounded-md p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-700" />
            Register New Account
          </h3>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => { setRoleTab('police'); setFormError(''); setFormSuccess(''); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors ${
                roleTab === 'police' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Police Officer
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('social_worker'); setFormError(''); setFormSuccess(''); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors ${
                roleTab === 'social_worker' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Social Worker
            </button>
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Input
            label={roleTab === 'police' ? 'Officer ID *' : 'Worker ID *'}
            id="badgeId"
            placeholder={roleTab === 'police' ? 'POL001' : 'SW001'}
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            icon={BadgeCheck}
            required
          />

          <Input
            label="Full Name *"
            id="fullName"
            placeholder={roleTab === 'police' ? 'Example Officer' : 'Example Social Worker'}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address *"
            id="email"
            type="email"
            placeholder={roleTab === 'police' ? 'officer@example.com' : 'worker@example.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label={roleTab === 'police' ? 'Police Station / Department *' : 'Organization *'}
            id="stationOrOrg"
            placeholder={roleTab === 'police' ? 'Central Police Station' : 'ABHAYA Support Services'}
            value={stationOrOrg}
            onChange={(e) => setStationOrOrg(e.target.value)}
            icon={Building}
            required
          />

          <Input
            label="Password *"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password *"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          <div className="sm:col-span-2 flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={formLoading}
              icon={UserPlus}
            >
              Register {roleTab === 'police' ? 'Police Officer' : 'Social Worker'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. USER MANAGEMENT DIRECTORY TABLE */}
      <div className="bg-white rounded-md p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900">User Management Directory</h3>
          <span className="text-xs text-slate-500 font-mono">Total Users: {users.length}</span>
        </div>

        {loading ? (
          <LoadingState message="Loading system users..." />
        ) : error ? (
          <EmptyState
            title="Unable to load user directory"
            description={error}
            isError={true}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title="No registered users"
            description="Registered system accounts will appear here."
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Officer / Worker ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Station / Organization</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {u.badge_id || 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>
                        <span>{u.full_name}</span>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold uppercase text-[11px]">
                      <span className={`px-2 py-0.5 rounded border ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : u.role === 'police'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {u.police_station || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {u.role !== 'admin' && (
                        <Button
                          variant={u.is_active ? 'danger' : 'success'}
                          size="sm"
                          icon={u.is_active ? UserX : UserCheck}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.is_active ? 'Deactivate' : 'Reactivate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

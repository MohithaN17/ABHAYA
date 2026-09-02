import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { UserCheck, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

function normalizeRole(role) {
  if (!role) return '';
  return role.toLowerCase().replace('-', '_').trim();
}

export default function Login() {
  const [officerId, setOfficerId] = useState('POL001');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!officerId.trim()) {
      setError('Please enter your Officer ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      const activeUser = await login(officerId, password);
      const userRole = normalizeRole(activeUser.role || 'police');
      
      if (userRole === 'admin') {
        navigate('/admin/users', { replace: true });
      } else if (userRole === 'police') {
        navigate('/police', { replace: true });
      } else if (userRole === 'social_worker') {
        navigate('/social-worker', { replace: true });
      } else {
        setError('Victim accounts must access their personal dashboard via the mobile application.');
      }
    } catch (err) {
      if (err.message === 'Account inactive') {
        setError('Account inactive');
      } else {
        setError('Invalid credentials.');
      }
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-md p-6 border border-slate-200 shadow-sm">
      {/* Brand Header */}
      <div className="text-center mb-5 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-wide uppercase">ABHAYA</h2>
        <p className="text-xs text-slate-500 mt-0.5">Case Support System</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Officer ID"
          id="officerId"
          type="text"
          placeholder="POL001"
          value={officerId}
          onChange={(e) => setOfficerId(e.target.value)}
          icon={UserCheck}
          required
        />

        <div className="space-y-1">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-8 pr-10 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            loading={loading}
            icon={LogIn}
          >
            Login
          </Button>
        </div>
      </form>

      <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
        Authorized Personnel Only
      </div>
    </div>
  );
}

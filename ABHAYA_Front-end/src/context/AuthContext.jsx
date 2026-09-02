import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { resolveOfficerId, loginWithPassword, getMe } from '../services/api';

const AuthContext = createContext(null);

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(() => readStorage('abhaya_user'));
  const [role, setRole] = useState(() => readStorage('abhaya_role') || user?.role || null);
  const [loading, setLoading] = useState(true);

  // Restore Supabase Session and fetch ABHAYA role from FastAPI
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession && isMounted) {
          setSession(currentSession);
          
          // Fetch profile and application role from FastAPI /api/v1/auth/me
          try {
            const profile = await getMe();
            if (profile && isMounted) {
              if (!profile.is_active) {
                setSession(null);
                setUser(null);
                setRole(null);
                removeStorage('abhaya_user');
                removeStorage('abhaya_role');
                await supabase.auth.signOut().catch(() => {});
                return;
              }

              const appRole = profile.role || 'police';
              const userObj = {
                id: profile.id,
                name: profile.full_name,
                role: appRole,
                email: profile.email,
                phone: profile.phone,
                policeStation: profile.police_station,
                badgeId: profile.badge_id,
              };
              setUser(userObj);
              setRole(appRole);
              writeStorage('abhaya_user', userObj);
              writeStorage('abhaya_role', appRole);
            }
          } catch (err) {
            console.warn('Could not fetch user profile from FastAPI during session restore:', err);
          }
        }
      } catch (err) {
        console.error('Session restoration error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    restoreSession();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        setUser(null);
        setRole(null);
        removeStorage('abhaya_user');
        removeStorage('abhaya_role');
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Login with Officer ID and Password
  const login = async (officerId, password) => {
    setLoading(true);
    try {
      if (!officerId || !password) {
        throw new Error("Invalid credentials.");
      }

      // Step 1: Securely resolve Officer ID to Supabase email & verify active status
      const resolved = await resolveOfficerId(officerId);
      if (!resolved || !resolved.email) {
        throw new Error("Invalid credentials.");
      }
      if (resolved.is_active === false) {
        throw new Error("Account inactive");
      }

      // Step 2: Supabase Password Authentication
      const authData = await loginWithPassword(resolved.email, password);
      const newSession = authData.session;
      const authUser = authData.user;

      setSession(newSession);

      // Step 3: Fetch verified user profile & role from FastAPI /api/v1/auth/me
      let appRole = 'police';
      let userProfile = null;

      try {
        userProfile = await getMe();
      } catch (e) {
        console.warn('FastAPI getMe unavailable during login:', e);
      }

      if (userProfile?.role) {
        appRole = userProfile.role;
      }

      const activeUser = {
        id: authUser.id,
        name: userProfile?.full_name || authUser.email || 'Authenticated User',
        role: appRole,
        email: authUser.email,
        phone: authUser.phone,
        policeStation: userProfile?.police_station,
        badgeId: userProfile?.badge_id || resolved.badge_id || officerId
      };

      writeStorage('abhaya_user', activeUser);
      writeStorage('abhaya_role', appRole);

      setUser(activeUser);
      setRole(appRole);

      return activeUser; // caller uses this to redirect based on role
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    setUser(null);
    setRole(null);
    setSession(null);
    removeStorage('abhaya_user');
    removeStorage('abhaya_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        login,
        logout,
        isAuthenticated: !!session || !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

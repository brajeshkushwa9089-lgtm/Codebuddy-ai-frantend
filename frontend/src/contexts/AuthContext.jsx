import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { setTokenGetter } from '../services/api';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // 1. Check local storage for mock / offline session first
    const savedMockUser = localStorage.getItem('codebuddy_mock_user');
    if (savedMockUser) {
      try {
        const parsed = JSON.parse(savedMockUser);
        setUser(parsed);
        setProfile({ displayName: parsed.displayName || 'Demo Student' });
        setTokenGetter(() => `test-mock-token-${parsed.id}`);
        setLoading(false);
        return;
      } catch {
        // ignore parse error
      }
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 2. Live Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setTokenGetter(() => session.access_token);
        fetchProfile();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setTokenGetter(() => session.access_token);
        fetchProfile();
      } else {
        setTokenGetter(() => null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res?.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch {
      // Profile fetch failure is non-fatal
    }
  };

  const login = async (email, password) => {
    // 1. If demo student account or currently offline, use immediate local offline session
    if (email === 'student@codebuddy.local' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      const mockUser = {
        id: 'demo-student-id',
        email,
        displayName: 'Demo Student',
      };
      localStorage.setItem('codebuddy_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({ displayName: mockUser.displayName });
      setTokenGetter(() => `test-mock-token-${mockUser.id}`);
      return { user: mockUser };
    }

    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'demo-student-id',
        email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('codebuddy_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({ displayName: mockUser.displayName });
      setTokenGetter(() => `test-mock-token-${mockUser.id}`);
      return { user: mockUser };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      // If network call failed (offline), gracefully fall back to local offline session
      if (err.message?.includes('fetch') || err.message?.includes('NetworkError') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        const mockUser = {
          id: 'offline-' + email.replace(/[^a-zA-Z0-9]/g, ''),
          email,
          displayName: email.split('@')[0],
        };
        localStorage.setItem('codebuddy_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setProfile({ displayName: mockUser.displayName });
        setTokenGetter(() => `test-mock-token-${mockUser.id}`);
        return { user: mockUser };
      }
      throw err;
    }
  };

  const register = async (email, password, displayName) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'student-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: displayName || email.split('@')[0],
      };
      localStorage.setItem('codebuddy_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({ displayName: mockUser.displayName });
      setTokenGetter(() => `test-mock-token-${mockUser.id}`);
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('codebuddy_mock_user');
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore offline signout error
      }
    }
    setUser(null);
    setProfile(null);
    setTokenGetter(() => null);
  };

  const updateProfile = async (displayName) => {
    if (!isSupabaseConfigured) {
      const updated = { ...user, displayName };
      localStorage.setItem('codebuddy_mock_user', JSON.stringify(updated));
      setUser(updated);
      setProfile({ displayName });
      return;
    }

    const res = await api.patch('/profile', { displayName });
    if (res?.data?.profile) {
      setProfile(res.data.profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isSupabaseConfigured,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


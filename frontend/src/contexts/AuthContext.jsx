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
    // Check local storage for mock session if Supabase is unconfigured
    if (!isSupabaseConfigured) {
      const savedMockUser = localStorage.getItem('codebuddy_mock_user');
      if (savedMockUser) {
        try {
          const parsed = JSON.parse(savedMockUser);
          setUser(parsed);
          setProfile({ displayName: parsed.displayName || 'Demo Student' });
          setTokenGetter(() => `test-mock-token-${parsed.id}`);
        } catch {
          // ignore parse error
        }
      }
      setLoading(false);
      return;
    }

    // Live Supabase Auth
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
    if (!isSupabaseConfigured) {
      // Demo mock login
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
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
    if (!isSupabaseConfigured) {
      localStorage.removeItem('codebuddy_mock_user');
      setUser(null);
      setProfile(null);
      setTokenGetter(() => null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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


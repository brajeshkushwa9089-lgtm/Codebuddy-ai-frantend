import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAIProvider } from '../contexts/AIProviderContext';
import {
  User,
  Mail,
  Cpu,
  CheckCircle2,
  Shield,
  Loader2,
  Save,
  Check,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateProfile, isSupabaseConfigured } = useAuth();
  const { providerInfo } = useAIProvider();

  const [displayName, setDisplayName] = useState(
    profile?.displayName || user?.displayName || user?.email?.split('@')[0] || ''
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await updateProfile(displayName);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-brand-400" />
          <span>Student Profile & Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details and view your connected AI configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Profile Information</h2>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Display name updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name / Student Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-dark-bg border border-dark-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || 'student@codebuddy.local'}
                disabled
                className="w-full px-3.5 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Managed via Supabase Authentication.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI & System Status Info */}
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Provider Info</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span className="text-slate-400">Active Provider</span>
              <span className="font-semibold text-white uppercase">{providerInfo.provider}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span className="text-slate-400">Active Model</span>
              <span className="font-mono text-brand-300">{providerInfo.model}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span className="text-slate-400">Connection</span>
              <span className={providerInfo.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>
                {providerInfo.status}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Database Auth</span>
              <span className={isSupabaseConfigured ? 'text-emerald-400' : 'text-indigo-400'}>
                {isSupabaseConfigured ? 'Live Supabase' : 'Local Demo Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


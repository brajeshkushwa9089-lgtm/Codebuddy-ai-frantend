import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthHero from '../components/auth/AuthHero';
import {
  Terminal,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validation helper
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError('');
    setInfoMessage('');
    try {
      setLoading(true);
      await login('student@codebuddy.local', 'Demo1234!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email.trim())) {
      setError('Enter your registered email address first to reset your password.');
      return;
    }
    setInfoMessage(`Password reset instruction will be sent to ${email.trim()} if registered.`);
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 lg:p-8 bg-jet">
      {/* Outer Split Container */}
      <div className="w-full max-w-6xl rounded-3xl bg-navy/60 border border-navy-border/80 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column — Branding & Hero (Desktop & Tablet) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-jet via-navy to-jet border-b lg:border-b-0 lg:border-r border-navy-border/80 flex flex-col justify-between">
          <AuthHero />
        </div>

        {/* Right Column — Authentication Card */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative bg-navy/40">
          {/* Subtle Ambient Card Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cerulean/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neonRose/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-md mx-auto">
            {/* Top Logo & Heading */}
            <div className="text-center mb-8">
              <div className="relative inline-flex mb-3 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cerulean to-neonRose rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-jet flex items-center justify-center border border-navy-border shadow-lg">
                  <Terminal className="w-6 h-6 text-cerulean" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                Welcome Back.
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
                Sign in to your CodeBuddy account.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed flex-1">{error}</span>
              </div>
            )}

            {/* Info / Reset Banner */}
            {infoMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-cerulean/10 border border-cerulean/30 flex items-start gap-3 text-xs text-cerulean animate-fadeIn">
                <ShieldCheck className="w-4 h-4 shrink-0 text-cerulean mt-0.5" />
                <span className="leading-relaxed flex-1">{infoMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-[#F8FAFC] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-jet border border-navy-border rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cerulean focus:ring-2 focus:ring-cerulean/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-[#F8FAFC]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-cerulean hover:text-cerulean-light transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-jet border border-navy-border rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cerulean focus:ring-2 focus:ring-cerulean/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-navy-border bg-jet text-cerulean focus:ring-cerulean focus:ring-offset-jet transition-colors cursor-pointer"
                  />
                  <span className="text-xs text-[#94A3B8] font-medium">Remember me</span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r from-cerulean to-neonRose hover:brightness-110 active:scale-[0.99] shadow-lg shadow-cerulean/20 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-navy-border/80" />
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Instant Access
              </span>
              <div className="flex-1 h-px bg-navy-border/80" />
            </div>

            {/* Quick Demo Student Sign-In */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-jet hover:bg-navy-hover border border-navy-border text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:border-cerulean/50 group"
            >
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Quick Sign In as Demo Student</span>
            </button>

            {/* Bottom Navigation Link */}
            <p className="text-center text-xs text-[#94A3B8] mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-cerulean hover:text-neonRose transition-colors inline-flex items-center gap-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

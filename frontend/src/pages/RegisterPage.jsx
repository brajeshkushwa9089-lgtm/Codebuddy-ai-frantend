import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthHero from '../components/auth/AuthHero';
import {
  Terminal,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validation helper
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-cerulean' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!displayName.trim()) {
      setError('Please provide your name or nickname.');
      return;
    }

    if (!email.trim() || !isValidEmail(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(email.trim(), password, displayName.trim());

      // If user requires email verification confirmation
      if (res?.user && !res?.session) {
        setSuccessMsg('Account created! Please check your email to confirm registration, or sign in.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-neonRose/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cerulean/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-md mx-auto">
            {/* Top Logo & Heading */}
            <div className="text-center mb-6">
              <div className="relative inline-flex mb-3 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cerulean to-neonRose rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-jet flex items-center justify-center border border-navy-border shadow-lg">
                  <Terminal className="w-6 h-6 text-neonRose" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                Create Account.
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
                Start your coding journey with CodeBuddy AI.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed flex-1">{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="leading-relaxed flex-1">{successMsg}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name / Nickname */}
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold text-[#F8FAFC] mb-1.5"
                >
                  Full Name or Nickname
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="signup-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Aarav Sharma"
                    autoComplete="name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-jet border border-navy-border rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cerulean focus:ring-2 focus:ring-cerulean/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-[#F8FAFC] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="signup-email"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-[#F8FAFC] mb-1.5"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
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

                {/* Password Strength Indicator Bar */}
                {password && (
                  <div className="mt-1.5 flex items-center gap-2 animate-fadeIn">
                    <div className="flex-1 h-1 bg-jet rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            strength.score >= step ? strength.color : 'bg-navy-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-semibold text-[#F8FAFC] mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-cerulean absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-jet border border-navy-border rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cerulean focus:ring-2 focus:ring-cerulean/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password && confirmPassword === password && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms Note */}
              <p className="text-[11px] text-[#94A3B8] leading-relaxed pt-1">
                By creating an account, you agree to CodeBuddy AI's educational learning guidelines.
              </p>

              {/* Primary Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r from-cerulean to-neonRose hover:brightness-110 active:scale-[0.99] shadow-lg shadow-cerulean/20 disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation Link */}
            <p className="text-center text-xs text-[#94A3B8] mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-cerulean hover:text-neonRose transition-colors inline-flex items-center gap-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

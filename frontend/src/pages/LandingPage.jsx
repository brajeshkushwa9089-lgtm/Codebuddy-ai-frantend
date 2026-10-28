import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Code2,
  Bug,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-600/40 to-violet-600/20 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI-Powered Programming Companion for Python, C, C++, & JS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Learn to Code.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-violet-400">
              Understand the Logic.
            </span>{' '}
            Build Confidence.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
            Stop blindly copying answers. CodeBuddy AI teaches you how code works line-by-line, analyzes compiler bugs, and reveals progressive hints so you genuinely master algorithmic thinking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
            >
              <span>{user ? 'Go to Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explainer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <Code2 className="w-4 h-4 text-brand-400" />
              <span>Try Code Explainer</span>
            </Link>
          </div>

          {/* Languages Supported Pill Row */}
          <div className="mt-14 pt-8 border-t border-dark-border/60 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-slate-400 font-medium mr-2">Supported Languages:</span>
            {['Python 3', 'C (C99/C11)', 'C++ (C++17)', 'JavaScript (ES6+)'].map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-dark-card border border-dark-border text-slate-300"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Educational Pillars */}
      <section className="py-16 bg-dark-surface/40 border-y border-dark-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Why First-Year Engineers Love CodeBuddy
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Built on scaffolding pedagogy — designed to foster independent problem solvers, not copy-pasters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Line-by-Line Breakdown</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Paste any complex snippet. CodeBuddy explains each loop, pointer, and variable state in memory with beginner-friendly language.
              </p>
              <Link to="/explainer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300">
                Explore Explainer <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Error Diagnosis</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Segmentation faults, off-by-one bounds, or undefined variables? Receive actionable root-cause analysis and prevention tips.
              </p>
              <Link to="/debugger" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300">
                Debug Your Code <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">5-Level Progressive Hints</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Unlock conceptual nudges, approach strategies, pseudocode, and partial fragments sequentially without immediately spoiling the answer.
              </p>
              <Link to="/practice" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300">
                Practice Problems <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Provider Highlight */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-dark-card border border-dark-border rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Dual AI Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Run 100% Locally with Gemma 3 or Scale with Gemini
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Switch freely between a private local Ollama instance running Google's Gemma 3:1B or cloud-based Google Gemini via server configuration. No lock-in.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full md:w-auto">
            <div className="px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Local Ollama</div>
                <div className="text-[11px] text-slate-400 font-mono">gemma3:1b (Offline)</div>
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Google Gemini Cloud</div>
                <div className="text-[11px] text-slate-400 font-mono">gemini-1.5-flash / Pro</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


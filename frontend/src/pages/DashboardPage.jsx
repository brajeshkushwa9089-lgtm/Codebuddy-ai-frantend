import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  Flame,
  CheckCircle2,
  Code2,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res?.data?.stats);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your learning analytics...</p>
        </div>
      </div>
    );
  }

  const isEmpty = stats?.isEmptyState;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {profile?.displayName || user?.email?.split('@')[0] || 'Student'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your coding streak, practice mastery, and AI tutoring history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/practice/generate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Problem</span>
          </Link>
          <Link
            to="/explainer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 font-semibold text-xs transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Explain Code</span>
          </Link>
        </div>
      </div>

      {/* Database Setup Notice if SQL migration not run yet */}
      {stats?.isDbPending && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3 text-xs text-amber-300">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-amber-200">Supabase Tables Initializing</span>
            <p className="text-amber-300/80 leading-relaxed">
              To persist practice problems and stats across sessions, run the SQL migration in your Supabase SQL Editor:
              <br />
              <code className="text-amber-200 font-mono text-[11px] bg-dark-bg/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                backend/supabase/migrations/20261028_init.sql
              </code>
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats?.learningStreak || 0} Days</div>
            <div className="text-xs text-slate-400 font-medium">Learning Streak</div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats?.problemsCompleted || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Problems Completed</div>
          </div>
        </div>

        {/* Total Attempts */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats?.totalAttempts || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Practice Attempts</div>
          </div>
        </div>

        {/* Questions Asked */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats?.questionsAsked || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Tutor Questions Asked</div>
          </div>
        </div>
      </div>

      {/* Empty State Banner for New Users */}
      {isEmpty && (
        <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-950/40 to-dark-card border border-brand-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Your Coding Journey Begins Now!</h3>
            <p className="text-xs text-slate-300 mt-1">
              You haven't completed any practice exercises or asked the AI tutor any questions yet. Start with our AI code explainer or generate your first practice problem!
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/explainer"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
            >
              Analyze Your First Snippet
            </Link>
            <Link
              to="/practice/generate"
              className="px-4 py-2 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-200 text-xs font-semibold"
            >
              Generate Practice Problem
            </Link>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <span>Learning Activity (Past 7 Days)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Exercises, explanations, and debug runs</p>
            </div>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData || []}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111726',
                    borderColor: '#1f293d',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="activities" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Frequent Languages */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Language Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Most frequently studied languages</p>
          </div>

          {stats?.languageStats?.length > 0 ? (
            <div className="space-y-3 my-auto">
              {stats.languageStats.map((item, idx) => (
                <div key={item.language} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="capitalize text-slate-200">{item.language}</span>
                    <span className="text-slate-400 font-mono">{item.count} sessions</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-surface overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (item.count / (stats.totalAttempts + 1)) * 100)}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-auto text-center py-8 text-xs text-slate-500">
              No language data yet. Solve problems in Python, C, C++, or JS!
            </div>
          )}

          <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-dark-border/40">
            Calculated from authentic activity logs
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recently Studied Topics */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Recently Studied Topics</span>
          </h3>

          {stats?.recentTopics?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.recentTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-surface border border-dark-border text-slate-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No topics recorded yet.</p>
          )}
        </div>

        {/* Suggested Next Topics */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Recommended Next Concepts</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {(stats?.suggestedNextTopics || ['Loops & Iteration', 'Arrays', 'Recursion']).map((topic) => (
              <Link
                key={topic}
                to={`/practice/generate?topic=${encodeURIComponent(topic)}`}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-950/40 hover:bg-brand-900/50 border border-brand-800/50 text-brand-300 transition-colors"
              >
                <span>{topic}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


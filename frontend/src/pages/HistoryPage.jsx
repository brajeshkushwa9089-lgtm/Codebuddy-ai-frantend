import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Code2,
  HelpCircle,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

export default function HistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('attempts');
  const [filterLang, setFilterLang] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const [attRes, actRes] = await Promise.allSettled([
        api.get('/practice/attempts'),
        api.get('/dashboard/activity'),
      ]);

      if (attRes.status === 'fulfilled') {
        setAttempts(attRes.value?.data?.attempts || []);
      }
      if (actRes.status === 'fulfilled') {
        setActivities(actRes.value?.data?.activity || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAttempts = attempts.filter((att) => {
    if (filterLang === 'all') return true;
    return att.practice_problems?.language === filterLang;
  });

  const filteredActivities = activities.filter((act) => {
    if (filterLang === 'all') return true;
    return act.language === filterLang;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-400" />
            <span>Learning History & Submissions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your historical coding attempts, hint consumption, and learning milestones.
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-3">
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-dark-card border border-dark-border text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-border">
        <button
          type="button"
          onClick={() => setActiveTab('attempts')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'attempts'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Practice Attempts ({filteredAttempts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Activity Stream ({filteredActivities.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading history records...</p>
        </div>
      ) : activeTab === 'attempts' ? (
        <div className="space-y-4">
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl p-8 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No practice attempts recorded</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate practice problems in Python, C, C++, or JS and submit your solutions to track them here.
              </p>
            </div>
          ) : (
            filteredAttempts.map((att) => (
              <div
                key={att.id}
                className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300 uppercase">
                      {att.practice_problems?.language || 'Code'}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {att.practice_problems?.title || 'Practice Problem'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{att.hints_used} Hints Used</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        att.completed
                          ? 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {att.completed ? 'Completed' : 'Attempted'}
                    </span>
                    <span>{new Date(att.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {att.submitted_code && (
                  <pre className="font-mono text-xs bg-dark-bg p-3 rounded-xl border border-dark-border text-slate-300 overflow-x-auto max-h-40">
                    {att.submitted_code}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl p-8 space-y-2">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No activity logged yet</h3>
              <p className="text-xs text-slate-400">Your study events will appear here.</p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-brand-400 font-bold text-xs">
                    {act.activity_type.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white capitalize">
                      {act.activity_type.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Language: <span className="capitalize">{act.language}</span>{' '}
                      {act.topic && `• Topic: ${act.topic}`}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  {new Date(act.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


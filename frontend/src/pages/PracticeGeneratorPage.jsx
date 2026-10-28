import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Code2,
  CheckCircle2,
  Layers,
  RotateCcw,
} from 'lucide-react';

const TOPICS = [
  'Variables and data types',
  'Operators & Expressions',
  'Conditional statements',
  'Loops & Iteration',
  'Arrays & Lists',
  'Strings & Text Processing',
  'Functions & Scope',
  'Recursion',
  'Searching and sorting',
  'Object-oriented programming',
  'Basic data structures',
  'Problem-solving and algorithms',
];

export default function PracticeGeneratorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [language, setLanguage] = useState('python');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [topic, setTopic] = useState(searchParams.get('topic') || 'Loops & Iteration');

  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    try {
      setLoading(true);
      const res = await api.post('/ai/practice/generate', {
        language,
        difficulty,
        topic,
      });
      setGeneratedProblem(res.data);
    } catch (err) {
      setError(err.message || 'Failed to generate problem. Ensure AI provider is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkspace = () => {
    if (!generatedProblem) return;
    navigate(`/workspace`, { state: { problem: generatedProblem } });
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-400" />
          <span>AI Practice Problem Generator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate targeted coding challenges matching your current syllabus, language, and skill level.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Generator Configuration Card */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Configure Challenge</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Target Language</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'python', label: 'Python 3' },
                { id: 'c', label: 'C' },
                { id: 'cpp', label: 'C++' },
                { id: 'javascript', label: 'JavaScript' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLanguage(item.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    language === item.id
                      ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-sm'
                      : 'bg-dark-bg border-dark-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                    difficulty === diff
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-dark-bg border-dark-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Computer Science Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full py-2.5 px-3 bg-dark-bg border border-dark-border rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Exercise...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Practice Problem</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Problem Preview Card */}
      {generatedProblem && (
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300 uppercase">
                  {generatedProblem.language}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dark-card border border-dark-border text-indigo-300">
                  {generatedProblem.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-medium">{generatedProblem.topic}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{generatedProblem.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 text-xs font-medium transition-colors"
                title="Regenerate another variant"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry / Another</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWorkspace}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/20"
              >
                <span>Solve in Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Problem Statement
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {generatedProblem.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Input Format</span>
                <p className="text-xs text-slate-300">{generatedProblem.inputDescription}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Output Format</span>
                <p className="text-xs text-slate-300">{generatedProblem.outputDescription}</p>
              </div>
            </div>

            {generatedProblem.constraints && (
              <div className="p-3 rounded-xl bg-dark-card border border-dark-border">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Constraints</span>
                <p className="text-xs font-mono text-slate-300">{generatedProblem.constraints}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Sample Input</span>
                <pre className="font-mono text-xs bg-dark-bg p-3 rounded-xl border border-dark-border text-slate-300 overflow-x-auto">
                  {generatedProblem.sampleInput}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Expected Sample Output</span>
                <pre className="font-mono text-xs bg-dark-bg p-3 rounded-xl border border-dark-border text-emerald-300 overflow-x-auto">
                  {generatedProblem.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


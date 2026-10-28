import React, { useState } from 'react';
import CodeEditor, { STARTER_TEMPLATES } from '../components/CodeEditor';
import api from '../services/api';
import {
  Code2,
  Sparkles,
  Info,
  Layers,
  Lightbulb,
  AlertCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';

export default function CodeExplainerPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_TEMPLATES.python);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_TEMPLATES[newLang] || '');
    setExplanation(null);
    setError('');
  };

  const handleExplain = async () => {
    setError('');
    if (!code || !code.trim()) {
      setError('Please provide or paste code to explain.');
      return;
    }

    if (code.length > 15000) {
      setError('Code snippet exceeds maximum limit of 15,000 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/ai/explain', { code, language });
      setExplanation(res.data);
    } catch (err) {
      setError(err.message || 'Failed to explain code. Please ensure your AI provider is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-400" />
            <span>AI Code Explainer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Understand how each statement works line-by-line, what happens in memory, and key computer science concepts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExplain}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/25 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Logic...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Explain My Code</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Workspace (Editor on Left, Explanations on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Monaco Code Editor */}
        <div className="space-y-3">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            height="560px"
            title="Source Code"
          />
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
            <Info className="w-3.5 h-3.5" />
            <span>Select Python, C, C++, or JavaScript. You can modify code directly or reset to starter template.</span>
          </div>
        </div>

        {/* Right Column: AI Explanation Panel */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 min-h-[560px] flex flex-col justify-start space-y-6 overflow-y-auto">
          {explanation ? (
            <>
              {/* Program Summary Card */}
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                    <span>Program Summary</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {explanation.provider} / {explanation.model}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{explanation.summary}</p>
              </div>

              {/* Core Concepts */}
              {explanation.concepts?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Core Concepts Applied</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {explanation.concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-brand-950/50 border border-brand-800/50 text-brand-300"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Line by Line Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Line-by-Line Breakdown</span>
                </h4>

                <div className="space-y-2.5">
                  {(explanation.lineByLine || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-dark-card border border-dark-border space-y-1.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-emerald-400 font-semibold">
                          Line {item.lines}
                        </span>
                      </div>
                      <pre className="font-mono text-[11px] bg-dark-bg p-1.5 rounded border border-dark-border text-slate-300 overflow-x-auto">
                        {item.code}
                      </pre>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concept Analogy / Example */}
              {explanation.exampleConcept && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intuition & Real-World Analogy</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{explanation.exampleConcept}</p>
                </div>
              )}

              {/* Static Analysis Disclaimer */}
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border/60 text-[11px] text-slate-400">
                🛡️ <strong className="text-slate-300">Execution Notice:</strong>{' '}
                {explanation.executionNotice ||
                  'AI-assisted static analysis. Code has not been compiled or executed on a live virtual machine.'}
              </div>
            </>
          ) : (
            <div className="my-auto text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/10 text-brand-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Ready to inspect your code</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click <strong className="text-brand-300">"Explain My Code"</strong> to receive an educational, line-by-line pedagogical breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


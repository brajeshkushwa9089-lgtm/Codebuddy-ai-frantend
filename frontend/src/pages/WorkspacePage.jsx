import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeEditor, { STARTER_TEMPLATES } from '../components/CodeEditor';
import api from '../services/api';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Check,
  Eye,
  Lock,
} from 'lucide-react';

export default function WorkspacePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Problem passed from generator or default practice challenge
  const [problem, setProblem] = useState(
    location.state?.problem || {
      id: 'demo-problem-1',
      title: 'Count Vowels in a String',
      language: 'python',
      difficulty: 'Beginner',
      topic: 'Strings & Loops',
      description: 'Write a function that counts the number of vowels (a, e, i, o, u) present in a given string, case-insensitively.',
      inputDescription: 'A single string S containing letters and spaces.',
      outputDescription: 'Integer representing total count of vowels.',
      constraints: '1 <= len(S) <= 1000',
      sampleInput: 'Hello World',
      sampleOutput: '3',
    }
  );

  const [code, setCode] = useState(
    problem.language === 'python'
      ? `def count_vowels(s):\n    # Write your solution here\n    pass\n\nprint(count_vowels("Hello World"))`
      : STARTER_TEMPLATES[problem.language] || ''
  );

  // Progressive Hint States (Level 1 to 4)
  const [hints, setHints] = useState({}); // { 1: "...", 2: "..." }
  const [currentLevel, setCurrentLevel] = useState(0);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState('');

  // Full Solution State (Level 5)
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solutionLoading, setSolutionLoading] = useState(false);

  // Submission State
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Helper to guarantee a valid UUID is always sent to backend
  const getProblemId = () => {
    const rawId = problem?.id;
    if (!rawId || rawId === 'undefined' || typeof rawId !== 'string') {
      return 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(rawId) ? rawId : 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  };

  const requestNextHint = async () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel > 4) {
      setShowSolutionModal(true);
      return;
    }

    setHintError('');
    try {
      setHintLoading(true);
      const res = await api.post('/ai/hints', {
        problemId: getProblemId(),
        level: nextLevel,
        currentCode: code,
      });

      setHints((prev) => ({
        ...prev,
        [nextLevel]: res.data,
      }));
      setCurrentLevel(nextLevel);
    } catch (err) {
      setHintError(err.message || 'Failed to fetch hint. Ensure AI provider is active.');
    } finally {
      setHintLoading(false);
    }
  };

  const requestFullSolution = async () => {
    try {
      setSolutionLoading(true);
      const res = await api.post('/ai/solution', {
        problemId: getProblemId(),
        confirmRequest: true,
      });
      setSolution(res.data);
      setCurrentLevel(5);
      setShowSolutionModal(false);
    } catch (err) {
      setHintError(err.message || 'Failed to retrieve full solution.');
      setShowSolutionModal(false);
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleSubmitAttempt = async (isCompleted = true) => {
    try {
      setSubmitLoading(true);
      await api.post(`/practice/${getProblemId()}/attempts`, {
        submittedCode: code,
        hintsUsed: currentLevel,
        completed: isCompleted,
      });
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch (err) {
      setHintError(err.message || 'Failed to record attempt in database.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300 uppercase">
              {problem.language}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dark-card border border-dark-border text-indigo-300">
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400">{problem.topic}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{problem.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={requestNextHint}
            disabled={hintLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all disabled:opacity-60"
          >
            {hintLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <HelpCircle className="w-3.5 h-3.5" />
            )}
            <span>
              {currentLevel < 4 ? `Get Hint (Level ${currentLevel + 1} of 4)` : 'View Full Solution'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmitAttempt(true)}
            disabled={submitLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-500/20 disabled:opacity-60"
          >
            {submitLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Save & Mark Completed</span>
          </button>
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Practice attempt saved successfully to your learning records!</span>
        </div>
      )}

      {hintError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{hintError}</span>
        </div>
      )}

      {/* Workspace Grid (Problem Description & Hints on Left, Code Editor on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Problem Statement & Progressive Hints (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Card */}
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              <span>Problem Description</span>
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-dark-border/60">
              <div className="text-xs">
                <span className="font-semibold text-slate-300">Input: </span>
                <span className="text-slate-400">{problem.inputDescription}</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-300">Output: </span>
                <span className="text-slate-400">{problem.outputDescription}</span>
              </div>
              {problem.constraints && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-300">Constraints: </span>
                  <span className="font-mono text-slate-400">{problem.constraints}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Sample Test</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-dark-bg p-2 rounded-lg border border-dark-border">
                  <div className="text-[10px] text-slate-500">Input</div>
                  <div className="text-slate-300 truncate">{problem.sampleInput}</div>
                </div>
                <div className="bg-dark-bg p-2 rounded-lg border border-dark-border">
                  <div className="text-[10px] text-slate-500">Output</div>
                  <div className="text-emerald-400 truncate">{problem.sampleOutput}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progressive Hint Drawer (Level 1 to 4) */}
          <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Progressive Hints ({currentLevel}/4 Unlocked)</span>
              </h3>
            </div>

            {currentLevel === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                Stuck on logic? Click <strong>"Get Hint"</strong> above to unlock hints progressively without spoiling the solution.
              </p>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((lvl) => {
                  if (lvl > currentLevel) return null;
                  const item = hints[lvl];
                  return (
                    <div
                      key={lvl}
                      className="p-3.5 rounded-xl bg-dark-card border border-amber-900/40 space-y-1.5 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300">
                          Level {lvl}: {item?.levelName || `Hint ${lvl}`}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">Unlocked</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {item?.hint || 'Think through the base cases and loop termination condition.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Level 5 Revealed Card if available */}
            {solution && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase">
                    Level 5: Full Solution & Walkthrough
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Complexity: {solution.timeComplexity || 'O(N)'}
                  </span>
                </div>
                <pre className="font-mono text-xs bg-dark-bg p-3 rounded-lg border border-dark-border text-emerald-300 overflow-x-auto max-h-56">
                  {solution.solutionCode}
                </pre>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Strategy:</strong> {solution.algorithmicStrategy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={problem.language}
            height="620px"
            title="Solution Workspace"
          />
          <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
            <span>AI-assisted static tutoring. Code is not executed on server.</span>
            <span>Hints used: {currentLevel} / 5</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Level 5 Full Solution */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Reveal Complete Solution?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Viewing the full solution will spoil the puzzle. We encourage you to try solving it using the approach and pseudocode hints first!
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-border">
              <button
                type="button"
                onClick={() => setShowSolutionModal(false)}
                className="px-4 py-2 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-300 text-xs font-semibold"
              >
                Keep Trying Myself
              </button>
              <button
                type="button"
                onClick={requestFullSolution}
                disabled={solutionLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold disabled:opacity-60"
              >
                {solutionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                <span>I Understand, Reveal Solution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import api from '../services/api';
import {
  Bug,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Wrench,
  Check,
} from 'lucide-react';

const SAMPLE_BUGS = {
  python: {
    code: `def calculate_average(scores):
    total = sum(scores)
    # Bug: Division by zero when list is empty
    return total / len(scores)

test_scores = []
print(calculate_average(test_scores))`,
    errorMessage: `ZeroDivisionError: division by zero`,
    expectedBehavior: `Return 0 when the scores list is empty instead of crashing`,
  },
  c: {
    code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    // Bug: Loop condition goes past array bounds
    for (int i = 0; i <= 5; i++) {
        printf("%d\\n", arr[i]);
    }
    return 0;
}`,
    errorMessage: `Prints garbage value on 6th iteration or triggers Segmentation Fault`,
    expectedBehavior: `Only print the 5 elements from index 0 to 4`,
  },
  cpp: {
    code: `#include <iostream>

int main() {
    int* ptr = nullptr;
    // Bug: Dereferencing null pointer
    *ptr = 42;
    std::cout << *ptr << std::endl;
    return 0;
}`,
    errorMessage: `Segmentation fault (core dumped)`,
    expectedBehavior: `Allocate valid memory before assigning value to pointer`,
  },
  javascript: {
    code: `const user = {
  name: "Priya",
  preferences: null
};

// Bug: TypeError reading property of null
console.log(user.preferences.theme);`,
    errorMessage: `TypeError: Cannot read properties of null (reading 'theme')`,
    expectedBehavior: `Safely handle null or undefined preferences with optional chaining`,
  },
};

export default function DebuggerPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(SAMPLE_BUGS.python.code);
  const [errorMessage, setErrorMessage] = useState(SAMPLE_BUGS.python.errorMessage);
  const [expectedBehavior, setExpectedBehavior] = useState(SAMPLE_BUGS.python.expectedBehavior);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const sample = SAMPLE_BUGS[newLang] || { code: '', errorMessage: '', expectedBehavior: '' };
    setCode(sample.code);
    setErrorMessage(sample.errorMessage);
    setExpectedBehavior(sample.expectedBehavior);
    setDiagnosis(null);
    setError('');
  };

  const handleDiagnose = async (approachType = 'standard') => {
    setError('');
    if (!code || !code.trim()) {
      setError('Please provide code to debug.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/ai/debug', {
        code,
        language,
        errorMessage: approachType === 'alternative' 
          ? `${errorMessage} (Student requested an alternative solution approach)`
          : errorMessage,
        expectedBehavior,
      });
      setDiagnosis(res.data);
      setApplied(false);
    } catch (err) {
      setError(err.message || 'Error diagnosis failed. Verify AI provider is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = () => {
    if (!diagnosis?.suggestedFix) return;
    if (diagnosis.targetSection && code.includes(diagnosis.targetSection.trim())) {
      setCode(code.replace(diagnosis.targetSection.trim(), diagnosis.suggestedFix.trim()));
    } else {
      // Append suggested fix or replace
      setCode(`// Suggested fix applied:\n${diagnosis.suggestedFix}\n\n// Original code:\n${code}`);
    }
    setApplied(true);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bug className="w-6 h-6 text-rose-400" />
            <span>AI Debugging Assistant</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pinpoint root causes, distinguish syntax vs. logic issues, and learn preventive coding habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDiagnose('standard')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-500/20 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Diagnose & Suggest Fix</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Code and Context Inputs */}
        <div className="space-y-4">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            height="420px"
            title="Problematic Code"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Compiler / Runtime Error (Optional)
              </label>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste stack trace or error message..."
                rows={3}
                className="w-full p-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Expected Behavior (Optional)
              </label>
              <textarea
                value={expectedBehavior}
                onChange={(e) => setExpectedBehavior(e.target.value)}
                placeholder="What did you expect this code to do?"
                rows={3}
                className="w-full p-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Breakdown */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 min-h-[550px] flex flex-col justify-start space-y-6 overflow-y-auto">
          {diagnosis ? (
            <>
              {/* Problem Description & Classification Badge */}
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Problem Diagnosed</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        diagnosis.isDefiniteSyntaxError
                          ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                          : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                      }`}
                    >
                      {diagnosis.isDefiniteSyntaxError ? 'Syntax Issue' : 'Logical Error'}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white">{diagnosis.problemDescription}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.probableCause}</p>
              </div>

              {/* Target Problematic Line & Suggested Fix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-brand-400" />
                    <span>Suggested Minimal Correction</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleApplyFix}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {applied ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{applied ? 'Fix Applied' : 'Apply Fix to Editor'}</span>
                  </button>
                </div>

                {diagnosis.targetSection && (
                  <div className="space-y-1">
                    <div className="text-[11px] text-rose-400 font-medium">Problematic section:</div>
                    <pre className="font-mono text-xs bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg text-rose-200 overflow-x-auto">
                      {diagnosis.targetSection}
                    </pre>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-[11px] text-emerald-400 font-medium">Suggested replacement:</div>
                  <pre className="font-mono text-xs bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg text-emerald-200 overflow-x-auto">
                    {diagnosis.suggestedFix}
                  </pre>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-dark-card p-3 rounded-lg border border-dark-border">
                  <strong className="text-white">Why this helps:</strong> {diagnosis.whyFixHelps}
                </p>
              </div>

              {/* Prevention Tip */}
              {diagnosis.preventionTip && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Prevention Tip for Future Exams & Projects</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.preventionTip}</p>
                </div>
              )}

              {/* Secondary Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dark-border/60">
                <button
                  type="button"
                  onClick={() => handleDiagnose('alternative')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 text-xs font-medium transition-colors"
                >
                  Try Another Approach
                </button>
              </div>
            </>
          ) : (
            <div className="my-auto text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-400 flex items-center justify-center mx-auto">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Debug Your Code Confidently</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select your language, paste your code and optional error trace, then click <strong className="text-rose-300">"Diagnose & Suggest Fix"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


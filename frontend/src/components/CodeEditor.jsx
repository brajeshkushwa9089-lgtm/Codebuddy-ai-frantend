import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Trash2, RotateCcw, Check } from 'lucide-react';

export const STARTER_TEMPLATES = {
  python: `# Python 3 - Recursive Factorial with Validation
def factorial(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError("n must be a non-negative integer")
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Test with a sample value
num = 5
print(f"Factorial of {num} is: {factorial(num)}")
`,
  c: `// C - Array Sum and Traversal
#include <stdio.h>

int main() {
    int numbers[] = {10, 20, 30, 40, 50};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int total = 0;

    for (int i = 0; i < size; i++) {
        total += numbers[i];
    }

    printf("Total sum = %d\\n", total);
    return 0;
}
`,
  cpp: `// C++ - Vector Manipulation & Iterators
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    int sum = std::accumulate(data.begin(), data.end(), 0);

    std::cout << "Sum of elements: " << sum << std::endl;
    return 0;
}
`,
  javascript: `// JavaScript - Higher-Order Array Operations
function calculateAverages(grades) {
  if (!grades || grades.length === 0) return 0;
  const sum = grades.reduce((acc, curr) => acc + curr, 0);
  return (sum / grades.length).toFixed(2);
}

const studentGrades = [85, 92, 78, 90, 88];
console.log("Average Score:", calculateAverages(studentGrades));
`,
};

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  onLanguageChange,
  readOnly = false,
  height = '420px',
  title = 'Code Editor',
  extraActions = null,
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  const handleReset = () => {
    if (onChange) {
      onChange(STARTER_TEMPLATES[language] || '');
    }
  };

  return (
    <div className="flex flex-col border border-dark-border rounded-xl overflow-hidden bg-dark-surface shadow-lg">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-dark-card border-b border-dark-border gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</span>
          {onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-dark-bg text-slate-200 text-xs font-medium rounded-md px-2.5 py-1 border border-dark-border focus:border-brand-500 focus:outline-none transition-colors"
            >
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {extraActions}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-dark-hover transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {!readOnly && (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-dark-hover transition-colors"
                title="Reset to Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-dark-hover transition-colors"
                title="Clear Editor"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative w-full" style={{ height }}>
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          value={value}
          onChange={(val) => onChange && onChange(val || '')}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          }}
        />
      </div>
    </div>
  );
}


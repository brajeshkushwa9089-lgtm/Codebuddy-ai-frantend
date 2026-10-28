import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The page you are looking for does not exist or has been moved to another path.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}


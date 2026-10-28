import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-dark-border py-4 px-6 text-center text-xs text-slate-500 bg-dark-bg/60">
        <p>
          CodeBuddy AI — Educational Programming Companion. Designed for first-year B.Tech CSE (AI/ML) students.
        </p>
      </footer>
    </div>
  );
}


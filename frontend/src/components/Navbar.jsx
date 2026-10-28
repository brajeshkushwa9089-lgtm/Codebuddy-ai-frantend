import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProviderBadge from './ProviderBadge';
import {
  Code2,
  Terminal,
  Bug,
  BookOpen,
  MessageSquare,
  Clock,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/explainer', label: 'Code Explainer', icon: Code2 },
    { to: '/debugger', label: 'Debugger', icon: Bug },
    { to: '/practice', label: 'Practice', icon: BookOpen },
    { to: '/chat', label: 'AI Tutor', icon: MessageSquare },
    { to: '/history', label: 'History', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">CodeBuddy</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 hidden lg:block">Understand the Logic</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <ProviderBadge />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-dark-hover text-slate-300 text-xs font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-900/60 border border-brand-700/60 flex items-center justify-center text-brand-300 font-bold">
                    {(profile?.displayName || user.email || 'S')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {profile?.displayName || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-hover transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-dark-hover transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-sm shadow-brand-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-hover"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-dark-border flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}


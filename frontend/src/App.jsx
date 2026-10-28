import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AIProviderProvider } from './contexts/AIProviderContext';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CodeExplainerPage from './pages/CodeExplainerPage';
import DebuggerPage from './pages/DebuggerPage';
import PracticeGeneratorPage from './pages/PracticeGeneratorPage';
import WorkspacePage from './pages/WorkspacePage';
import TutorChatPage from './pages/TutorChatPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AIProviderProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Public Routes */}
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="explainer" element={<CodeExplainerPage />} />
              <Route path="debugger" element={<DebuggerPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="practice" element={<Navigate to="/practice/generate" replace />} />
                <Route path="practice/generate" element={<PracticeGeneratorPage />} />
                <Route path="workspace" element={<WorkspacePage />} />
                <Route path="practice/:id" element={<WorkspacePage />} />
                <Route path="chat" element={<TutorChatPage />} />
                <Route path="chat/:id" element={<TutorChatPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AIProviderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AIProviderContext = createContext(null);

export function AIProviderProvider({ children }) {
  const [providerInfo, setProviderInfo] = useState({
    status: 'checking',
    provider: 'ollama',
    model: 'gemma3:1b',
    responseTimeMs: 0,
    error: null,
  });
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const res = await api.get('/health/ai');
      setProviderInfo(res);
    } catch (err) {
      setProviderInfo({
        status: 'error',
        provider: 'unknown',
        model: 'unknown',
        error: err.message || 'Unable to connect to backend AI service',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Re-check every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AIProviderContext.Provider value={{ providerInfo, loading, checkHealth }}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAIProvider() {
  return useContext(AIProviderContext);
}


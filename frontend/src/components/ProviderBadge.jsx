import React from 'react';
import { useAIProvider } from '../contexts/AIProviderContext';
import { Cpu, RefreshCw, ArrowLeftRight } from 'lucide-react';

export default function ProviderBadge() {
  const { providerInfo, loading, checkHealth, switchProvider } = useAIProvider();

  const isConnected = providerInfo.status === 'connected';
  const isOllama = providerInfo.provider === 'ollama';

  const handleToggle = () => {
    const next = isOllama ? 'gemini' : 'ollama';
    switchProvider(next);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`group flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
          isConnected
            ? isOllama
              ? 'bg-blue-950/40 border-blue-800/60 text-blue-300 hover:border-blue-500'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:border-emerald-500'
            : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:border-amber-500'
        }`}
        title={`Click to switch AI Engine (Current: ${providerInfo.provider} [${providerInfo.model}] - Click to switch to ${isOllama ? 'Gemini Cloud' : 'Ollama Offline'})`}
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOllama ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
            ></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? (isOllama ? 'bg-blue-500' : 'bg-emerald-500') : 'bg-amber-500'
            }`}
          ></span>
        </span>

        <Cpu className="w-3.5 h-3.5 opacity-80" />
        <span className="font-semibold uppercase tracking-wider">
          {isOllama ? 'Ollama (Offline)' : 'Gemini (Cloud)'}
        </span>
        <ArrowLeftRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
      </button>

      <button
        type="button"
        onClick={checkHealth}
        disabled={loading}
        title="Check AI Connection Status"
        className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-dark-hover transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}


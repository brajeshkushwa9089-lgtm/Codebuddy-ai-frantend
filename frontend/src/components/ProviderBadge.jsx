import React from 'react';
import { useAIProvider } from '../contexts/AIProviderContext';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ProviderBadge() {
  const { providerInfo, loading, checkHealth } = useAIProvider();

  const isConnected = providerInfo.status === 'connected';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
          isConnected
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
        }`}
        title={
          isConnected
            ? `Active AI: ${providerInfo.provider} (${providerInfo.model}) - Latency: ${providerInfo.responseTimeMs}ms`
            : providerInfo.error || 'AI Provider Unavailable'
        }
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </span>

        <Cpu className="w-3.5 h-3.5 opacity-80" />
        <span className="font-semibold uppercase">{providerInfo.provider || 'AI'}</span>
        <span className="text-[11px] opacity-75 hidden sm:inline">({providerInfo.model || 'unknown'})</span>
      </div>

      <button
        type="button"
        onClick={checkHealth}
        disabled={loading}
        title="Refresh AI connection probe"
        className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-dark-hover transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}


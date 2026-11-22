import React from 'react';
import { Radio, Sparkles, BookOpen, Shield, ShieldAlert, Activity, RefreshCw, Zap } from 'lucide-react';

export default function Header({ 
  onOpenSimulator, 
  onOpenMethodology, 
  onResetToCurrent,
  totalEvents,
  fotnScore,
  currentYear,
  deltaGap,
  gapStatus
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-100 font-mono">
                RUNET FREEDOM RADAR
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Двухконтурный v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Два индекса: «Нарратив» vs. «Физика сети» & Freedom on the Net (2016–2026)
            </p>
          </div>
        </div>

        {/* Middle Quick Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">База вех:</span>
            <span className="font-bold text-slate-200">{totalEvents}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">FotN ({currentYear}):</span>
            <span className="font-bold text-amber-400">{fotnScore}</span>
          </div>

          {deltaGap !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Δ Разрыв:</span>
              <span className="font-bold text-emerald-300">
                {deltaGap > 0 ? `+${deltaGap}` : deltaGap}
              </span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LLM-Симулятор</span>
            <span className="sm:hidden">LLM</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Методология Δ</span>
          </button>

          <button
            onClick={onResetToCurrent}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Сбросить к текущей дате (2026)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

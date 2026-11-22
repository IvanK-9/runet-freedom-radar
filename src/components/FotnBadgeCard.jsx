import React, { useState } from 'react';
import { Globe, AlertCircle, Info, TrendingDown, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function FotnBadgeCard({ fotn, currentYear, onOpenMethodology }) {
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(false);
  const { score, statusRu, breakdown, keyEvents } = fotn;

  // Breakdown percentages
  const pctAccess = Math.round((breakdown.obstaclesToAccess / 25) * 100);
  const pctContent = Math.round((breakdown.limitsOnContent / 35) * 100);
  const pctRights = Math.round((breakdown.userRights / 40) * 100);

  return (
    <div className="relative bg-slate-900/85 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-2xl overflow-hidden group">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Якорная международная метрика
              </h3>
              <button
                onClick={onOpenMethodology}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="О методологии бенчмарка прав в сети"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-sm font-bold text-slate-100">
              Global Net Freedom Benchmark (GNFB)
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          {statusRu}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="my-4 flex items-center justify-between z-10">
        <div>
          <div className="text-xs text-slate-400 mb-1">
            Оценка РФ за <span className="font-bold text-slate-200">{currentYear} год</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-amber-400">
              {score}
            </span>
            <span className="text-slate-500 text-sm font-semibold">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            Снижение с 35 (2016) до 15 (2026)
          </div>
        </div>

        {/* Mini Status Gauge Badge */}
        <div className="text-right">
          <div className="inline-block p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Категория</div>
            <div className="text-xs font-bold text-red-400 font-mono mt-0.5">Not Free (0–39)</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Втрое ниже 2011 года</div>
          </div>
        </div>
      </div>

      {/* 3 Blocks Breakdown with clear percentages */}
      <div className="space-y-3 z-10">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Структура оценки (3 базовых блока):
        </div>

        {/* 1. Obstacles to Access */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">1. Препятствия к доступу (Obstacles)</span>
            <span className="font-mono text-slate-300 font-bold">
              {breakdown.obstaclesToAccess} / 25 <span className="text-[10px] text-amber-400 font-normal">({pctAccess}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${pctAccess}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block leading-tight">
            Инфраструктура, региональные шатдауны, контроль над провайдерами
          </span>
        </div>

        {/* 2. Limits on Content */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">2. Ограничения контента (Limits)</span>
            <span className="font-mono text-slate-300 font-bold">
              {breakdown.limitsOnContent} / 35 <span className="text-[10px] text-orange-400 font-normal">({pctContent}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${pctContent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block leading-tight">
            Блокировки сайтов, DPI / ТСПУ, цензура СМИ, запрет VPN
          </span>
        </div>

        {/* 3. User Rights */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">3. Нарушения прав пользователей (Rights)</span>
            <span className="font-mono text-slate-300 font-bold">
              {breakdown.userRights} / 40 <span className="text-[10px] text-red-400 font-normal">({pctRights}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${pctRights}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block leading-tight">
            Слежка (СОРМ/Яровая), уголовные дела за посты, реестры блогеров
          </span>
        </div>
      </div>

      {/* Expandable Key events note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
            <p className={`italic ${isQuoteExpanded ? '' : 'line-clamp-2'}`}>
              "{keyEvents}"
            </p>
          </div>
          <button
            onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 shrink-0 font-mono flex items-center gap-0.5 ml-2 transition-colors"
          >
            {isQuoteExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {isQuoteExpanded ? 'Свернуть' : 'Еще'}
          </button>
        </div>
      </div>
    </div>
  );
}

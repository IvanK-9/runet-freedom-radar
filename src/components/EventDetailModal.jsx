import React, { useEffect } from 'react';
import { X, Calendar, Shield, ShieldAlert, AlertTriangle, Cpu } from 'lucide-react';

export default function EventDetailModal({ event, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!event) return null;

  const isAction = event.category === 'rkn_action';
  const isFail = event.category === 'rkn_fail';
  const isBypass = event.category === 'bypass_success';

  const categoryLabel = isAction 
    ? 'Натиск РКН / Цензура' 
    : isFail 
      ? 'Сбой / Факап РКН' 
      : 'Успех обхода / Защита';

  const categoryColor = isAction 
    ? 'text-red-400 border-red-500/30 bg-red-500/10' 
    : isFail 
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' 
      : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-full border ${categoryColor} flex items-center gap-1`}>
                {isAction && <ShieldAlert className="w-3 h-3" />}
                {isFail && <AlertTriangle className="w-3 h-3" />}
                {isBypass && <Shield className="w-3 h-3" />}
                {categoryLabel}
              </span>

              <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                {event.date}
              </span>

              <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                Бенчмарк прав GNFB: {event.fotn_score} / 100
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Impact Meter */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-mono block">
                Сила влияния на Рунет (Impact Score)
              </span>
              <span className="text-xs text-slate-500">
                Определяет амплитуду отклонения спидометра
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-6 rounded-sm transition-all ${
                    i < event.impact_score
                      ? isAction 
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                        : isFail 
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
              <span className="ml-2 font-mono font-bold text-base text-slate-100">
                {event.impact_score}/10
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Технический контекст и хроника:
            </h4>
            <p className="leading-relaxed text-slate-200 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              {event.description}
            </p>
          </div>

          {/* Technologies involved */}
          {event.tech && event.tech.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Задействованные технологии и протоколы:
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources and attribution */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="font-semibold text-slate-300">Источник / Подтверждение:</span>{' '}
              <span className="italic text-slate-400">{event.quote_or_source}</span>
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-500 px-2 py-0.5 rounded bg-slate-800">
              {event.source_type}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

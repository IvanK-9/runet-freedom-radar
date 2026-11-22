import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function TimeScrubber({ 
  timelineData, 
  currentDate, 
  onSelectDate 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentIndex = timelineData.findIndex(pt => pt.date === currentDate);
  const safeIndex = currentIndex === -1 ? timelineData.length - 1 : currentIndex;

  // Auto-play through time
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const nextIdx = (safeIndex + 1) % timelineData.length;
        onSelectDate(timelineData[nextIdx].date);
        if (nextIdx === timelineData.length - 1) {
          setIsPlaying(false);
        }
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, safeIndex, timelineData, onSelectDate]);

  const currentPoint = timelineData[safeIndex] || timelineData[timelineData.length - 1];

  const eras = [
    { label: "2016: Пакет Яровой", date: "2016-07-15" },
    { label: "2018: Telegram & РКН", date: "2018-04-15" },
    { label: "2019-21: ТСПУ & Twitter", date: "2021-03-15" },
    { label: "2022: Военная цензура & VPN", date: "2022-03-15" },
    { label: "2023: Блокада WireGuard", date: "2023-08-15" },
    { label: "2024: YouTube & Zapret", date: "2024-08-15" },
    { label: "2025-26: Discord & Списки", date: "2026-02-15" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col gap-4">
      {/* Top Controls & Current Date Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play / Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Пауза
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Запустить таймлайн
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectDate(timelineData[0].date);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="В начало (2016)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onSelectDate(timelineData[timelineData.length - 1].date);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="В конец (2026)"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Date Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Выбранная дата:</span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {currentPoint.displayDate}
            </span>
          </div>
        </div>
      </div>

      {/* Range Slider with tactile height and clean touch target */}
      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min="0"
          max={timelineData.length - 1}
          value={safeIndex}
          onChange={(e) => {
            setIsPlaying(false);
            const idx = parseInt(e.target.value, 10);
            onSelectDate(timelineData[idx].date);
          }}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        {/* Year markers under slider */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
          <span>2016</span>
          <span>2018</span>
          <span>2020</span>
          <span>2022</span>
          <span>2024</span>
          <span>2026</span>
        </div>
      </div>

      {/* Quick Era Jump Buttons with smooth scroll fade indicators */}
      <div className="relative pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
            Эпохи Рунета:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {eras.map(era => {
              const isSelected = currentPoint.year === parseInt(era.date.split('-')[0], 10);
              return (
                <button
                  key={era.label}
                  onClick={() => {
                    setIsPlaying(false);
                    onSelectDate(era.date);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {era.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

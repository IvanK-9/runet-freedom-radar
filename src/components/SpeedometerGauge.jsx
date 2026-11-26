import React, { useState } from 'react';
import { 
  getGapStatus, 
  getTechStatus, 
  getNarrativeStatus 
} from '../utils/calculator';
import { Radio, Zap } from 'lucide-react';

export default function SpeedometerGauge({ 
  iTech = 0, 
  iNar = -85, 
  deltaGap = 85, 
  gapStatus 
}) {
  const [needleView, setNeedleView] = useState('both'); // 'both' | 'tech' | 'nar'
  const resolvedGapStatus = gapStatus || getGapStatus(deltaGap);
  const techStatus = getTechStatus(iTech);
  const narStatus = getNarrativeStatus(iNar);

  // SVG Gauge calculations
  // Sweep from -110deg to +110deg (total 220deg)
  const minAngle = -110;
  const maxAngle = 110;

  const calcAngle = (val) => {
    const clamped = Math.max(-100, Math.min(100, val));
    return minAngle + ((clamped + 100) / 200) * (maxAngle - minAngle);
  };

  const angleTech = calcAngle(iTech);
  const angleNar = calcAngle(iNar);

  const cx = 160;
  const cy = 145;
  const r = 112;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const backgroundArc = describeArc(cx, cy, r, minAngle, maxAngle);

  // Needles coordinates with distinct length difference to prevent overlap
  // Tech needle is long (92px) and bold, reaching the inner arc
  const needleLenTech = 92;
  const needleRadTech = ((angleTech - 90) * Math.PI) / 180.0;
  const nxTech = cx + needleLenTech * Math.cos(needleRadTech);
  const nyTech = cy + needleLenTech * Math.sin(needleRadTech);

  // Narrative needle is shorter (68px) and elegant, stopping 24px before the tech needle
  const needleLenNar = 68;
  const needleRadNar = ((angleNar - 90) * Math.PI) / 180.0;
  const nxNar = cx + needleLenNar * Math.cos(needleRadNar);
  const nyNar = cy + needleLenNar * Math.sin(needleRadNar);

  return (
    <div className="relative bg-slate-900/85 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl overflow-hidden group">
      {/* Background ambient lighting based on deltaGap */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-700 blur-3xl"
        style={{ background: `radial-gradient(circle at center, ${resolvedGapStatus.color} 0%, transparent 70%)` }}
      />
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & View Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Двухконтурный спидометр
            </h3>
            <span className="text-sm font-bold text-slate-100">
              Нарратив (Законы) vs. Физика сети
            </span>
          </div>
        </div>

        {/* Needle Mode Selector */}
        <div role="tablist" aria-label="Режимы отображения стрелок" className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            role="tab"
            aria-selected={needleView === 'both'}
            onClick={() => setNeedleView('both')}
            className={`px-2.5 py-1 rounded transition-all ${
              needleView === 'both' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Отображать обе стрелки"
          >
            Две стрелки
          </button>
          <button
            role="tab"
            aria-selected={needleView === 'tech'}
            onClick={() => setNeedleView('tech')}
            className={`px-2.5 py-1 rounded transition-all ${
              needleView === 'tech' ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Только физика сети"
          >
            Сеть
          </button>
          <button
            role="tab"
            aria-selected={needleView === 'nar'}
            onClick={() => setNeedleView('nar')}
            className={`px-2.5 py-1 rounded transition-all ${
              needleView === 'nar' ? 'bg-purple-500/20 text-purple-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Только законы и нарратив"
          >
            Законы
          </button>
        </div>
      </div>

      {/* SVG Dual Gauge */}
      <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center -my-2 mx-auto z-10">
        <svg viewBox="0 0 320 230" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="dualGaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="30%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="glowTech" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowNar" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="#1e293b"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Colored Segment Arc */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="url(#dualGaugeTrack)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="4 6"
            className="opacity-80"
          />

          {/* Markers / Scale Ticks with improved readability */}
          {[-100, -50, 0, 50, 100].map((val) => {
            const valAngle = minAngle + ((val + 100) / 200) * (maxAngle - minAngle);
            const pInner = polarToCartesian(cx, cy, r - 12, valAngle);
            const pOuter = polarToCartesian(cx, cy, r + 12, valAngle);
            const pText = polarToCartesian(cx, cy, r + 25, valAngle);
            return (
              <g key={val} className="text-[11px] font-mono fill-slate-400">
                <line
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke={val === 0 ? "#94a3b8" : "#334155"}
                  strokeWidth={val === 0 ? "2.5" : "1.5"}
                />
                <text
                  x={pText.x}
                  y={pText.y + 4}
                  textAnchor="middle"
                  className={val === 0 ? "fill-slate-200 font-bold" : "fill-slate-400"}
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Scale extremes labels - increased size and contrast */}
          <text x="30" y="208" className="text-[11px] font-bold fill-red-400 uppercase tracking-wider">
            -100 Блокада
          </text>
          <text x="290" y="208" textAnchor="end" className="text-[11px] font-bold fill-emerald-400 uppercase tracking-wider">
            +100 Свобода
          </text>

          {/* Center Hub Outer Ring */}
          <circle cx={cx} cy={cy} r="18" fill="#0b1120" stroke="#334155" strokeWidth="2.5" />

          {/* Needle 1: Narrative / Legal Pressure (Purple / Fuchsia, Shorter 68px) */}
          {(needleView === 'both' || needleView === 'nar') && (
            <g className="transition-all duration-700 ease-out">
              <line
                x1={cx}
                y1={cy}
                x2={nxNar}
                y2={nyNar}
                stroke="#c084fc"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glowNar)"
                className="opacity-95"
              />
              <circle cx={nxNar} cy={nyNar} r="3" fill="#e879f9" stroke="#0f172a" strokeWidth="1" />
            </g>
          )}

          {/* Needle 2: Network Physics / Connectivity (Neon Cyan / Emerald, Longer 92px) */}
          {(needleView === 'both' || needleView === 'tech') && (
            <g className="transition-all duration-700 ease-out">
              <line
                x1={cx}
                y1={cy}
                x2={nxTech}
                y2={nyTech}
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glowTech)"
              />
              <circle cx={nxTech} cy={nyTech} r="4" fill="#10b981" stroke="#fff" strokeWidth="1" />
            </g>
          )}

          {/* Center Hub Core */}
          <circle cx={cx} cy={cy} r="8" fill="#1e293b" />
          <circle cx={cx} cy={cy} r="4" fill={resolvedGapStatus.color} className="animate-pulse" />
        </svg>

        {/* Central HUD readout box with glass background so needle doesn't obscure text */}
        <div className="absolute bottom-0 flex flex-col items-center bg-slate-950/80 px-4 py-1 rounded-xl border border-slate-800/60 backdrop-blur-md">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Дельта расхождения (Δ)
          </div>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span 
              className="text-2xl font-black tracking-tight transition-colors duration-500"
              style={{ color: resolvedGapStatus.color, textShadow: `0 0 16px ${resolvedGapStatus.color}66` }}
            >
              {deltaGap > 0 ? `+${deltaGap}` : deltaGap}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">pts</span>
          </div>
        </div>
      </div>

      {/* Reality Gap Status Box */}
      <div className="w-full mt-1 pt-3 border-t border-slate-800/80 text-center z-10">
        <div className="flex items-center justify-center gap-2">
          <span 
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${resolvedGapStatus.bgColor} flex items-center gap-1.5 shadow-sm`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: resolvedGapStatus.color }} />
            {resolvedGapStatus.label}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 px-2">
          {resolvedGapStatus.sublabel}
        </p>

        {/* Dual Needle Comparison Metrics */}
        <div className="mt-3 pt-3 border-t border-slate-800/50 grid grid-cols-2 gap-2 text-left">
          {/* Narrative Index */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1 text-purple-400 font-medium">
                <span className="w-2.5 h-1 rounded-full bg-purple-400" /> Нарратив (Законы)
              </span>
              <span className="font-mono font-bold text-purple-300">
                {iNar > 0 ? `+${iNar}` : iNar}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {narStatus.label}
            </div>
          </div>

          {/* Tech Reality Index */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <span className="w-2.5 h-1 rounded-full bg-cyan-400" /> Физика сети (OONI)
              </span>
              <span className="font-mono font-bold text-cyan-300">
                {iTech > 0 ? `+${iTech}` : iTech}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {techStatus.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

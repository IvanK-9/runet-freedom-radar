import React, { useState, useRef } from 'react';
import { Calendar, Info, Shield, ShieldAlert, Award, Zap, Layers } from 'lucide-react';

export default function DualTimelineChart({ 
  timelineData, 
  currentDate, 
  onSelectDate, 
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const containerRef = useRef(null);

  // Chart dimensions in viewBox coordinates
  const width = 1000;
  const height = 370;
  const padding = { top: 35, right: 55, bottom: 45, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scales
  const getX = (index) => {
    return padding.left + (index / (timelineData.length - 1)) * plotWidth;
  };

  // Y for Index (-100 to +100)
  const getY = (val) => {
    const clamped = Math.max(-100, Math.min(100, val));
    const normalized = (clamped - (-100)) / 200; // 0 to 1
    return padding.top + plotHeight - (normalized * plotHeight);
  };

  // Y for Freedom on the Net (0 to 100)
  const getYFotn = (score) => {
    const normalized = Math.max(0, Math.min(100, score)) / 100;
    return padding.top + plotHeight - (normalized * plotHeight);
  };

  const zeroY = getY(0);

  // Construct Paths for I_tech and I_nar
  let techPath = "";
  let narPath = "";
  let fotnPath = "";

  timelineData.forEach((pt, i) => {
    const x = getX(i);
    const yTech = getY(pt.iTech);
    const yNar = getY(pt.iNar);
    const yFotn = getYFotn(pt.fotnScore);

    if (i === 0) {
      techPath += `M ${x} ${yTech} `;
      narPath += `M ${x} ${yNar} `;
      fotnPath += `M ${x} ${yFotn} `;
    } else {
      techPath += `L ${x} ${yTech} `;
      narPath += `L ${x} ${yNar} `;
      fotnPath += `L ${x} ${yFotn} `;
    }
  });

  // Construct shaded ribbon area between Tech and Nar (The Reality Gap Area)
  let gapAreaPath = "";
  if (timelineData.length > 0) {
    gapAreaPath = `M ${getX(0)} ${getY(timelineData[0].iTech)} `;
    for (let i = 1; i < timelineData.length; i++) {
      gapAreaPath += `L ${getX(i)} ${getY(timelineData[i].iTech)} `;
    }
    for (let i = timelineData.length - 1; i >= 0; i--) {
      gapAreaPath += `L ${getX(i)} ${getY(timelineData[i].iNar)} `;
    }
    gapAreaPath += "Z";
  }

  // Active cursor index
  const currentIndex = timelineData.findIndex(pt => pt.date === currentDate);
  const currentX = currentIndex !== -1 ? getX(currentIndex) : null;

  // Handle click on chart
  const handleSvgClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const svgClickX = (clickX / rect.width) * width;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    timelineData.forEach((pt, i) => {
      const px = getX(i);
      const diff = Math.abs(px - svgClickX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    if (timelineData[closestIndex]) {
      onSelectDate(timelineData[closestIndex].date);
    }
  };

  // Handle hover
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const svgHoverX = (hoverX / rect.width) * width;

    let closestIndex = 0;
    let minDiff = Infinity;
    timelineData.forEach((pt, i) => {
      const px = getX(i);
      const diff = Math.abs(px - svgHoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    setHoveredPoint(timelineData[closestIndex]);
  };

  return (
    <div className="relative bg-slate-900/85 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
      {/* Chart Top Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Хроника противостояния: Сеть vs. Нарратив & Дельта расхождения (2016–2026)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Светящаяся область между кривыми — разрыв реальности (Reality Gap) между законами и реальной работой сети
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          {/* Tech Reality Line */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-cyan-300 font-semibold">Физика сети (I_tech)</span>
          </div>

          {/* Narrative Line */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-purple-400 rounded-full" />
            <span className="text-purple-300">Законы / Нарратив (I_nar)</span>
          </div>

          {/* Net Freedom Benchmark */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-b-2 border-dashed border-amber-400" />
            <span className="text-amber-400">Бенчмарк прав (GNFB)</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div 
        ref={containerRef}
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
        className="relative w-full aspect-[2.6/1] min-h-[290px] cursor-crosshair select-none my-2"
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Reality Gap Ribbon Gradient */}
            <linearGradient id="realityGapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.08" />
            </linearGradient>

            <filter id="glowCyanLine">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.7" />
            </filter>

            <filter id="glowPurpleLine">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#c084fc" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Grid Lines (Y-Axis) */}
          {[-100, -50, 0, 50, 100].map(val => {
            const y = getY(val);
            const isZero = val === 0;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isZero ? "#475569" : "#1e293b"}
                  strokeWidth={isZero ? "1.5" : "1"}
                  strokeDasharray={isZero ? "6 4" : ""}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] font-mono ${
                    isZero 
                      ? "fill-slate-300 font-bold" 
                      : val < 0 ? "fill-red-400/80" : "fill-emerald-400/80"
                  }`}
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Secondary Y-Axis on Right (Net Freedom Benchmark 0..100) */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = getYFotn(val);
            return (
              <text
                key={`fotn-${val}`}
                x={width - padding.right + 10}
                y={y + 4}
                textAnchor="start"
                className="text-[10px] font-mono fill-amber-500/80 font-medium"
              >
                {val}
              </text>
            );
          })}

          {/* Right Y-Axis Label */}
          <text
            x={width - 8}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(90, ${width - 8}, ${height / 2})`}
            className="text-[10px] uppercase font-mono fill-amber-500/80 tracking-wider font-semibold"
          >
            Бенчмарк прав GNFB (0..100)
          </text>

          {/* Left Y-Axis Label */}
          <text
            x={14}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 14, ${height / 2})`}
            className="text-[10px] uppercase font-mono fill-cyan-400/90 tracking-wider font-semibold"
          >
            Индекс (-100..+100)
          </text>

          {/* X-Axis Years Labels & Grid */}
          {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => {
            const index = timelineData.findIndex(pt => pt.year === year && pt.month === 1);
            if (index === -1) return null;
            const x = getX(index);
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-medium fill-slate-400"
                >
                  {year}
                </text>
              </g>
            );
          })}

          {/* Zero Parity Guide Line Accent */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="#64748b"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-60"
          />

          {/* Reality Gap Shaded Ribbon between Tech and Nar */}
          <path
            d={gapAreaPath}
            fill="url(#realityGapGrad)"
            className="transition-all duration-300"
          />

          {/* Freedom on the Net Line (Dashed Amber) */}
          <path
            d={fotnPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 4"
            className="opacity-75"
          />

          {/* Line A: Narrative / Legal Pressure (Purple) */}
          <path
            d={narPath}
            fill="none"
            stroke="#c084fc"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glowPurpleLine)"
            className="opacity-90"
          />

          {/* Line B: Network Physics / Connectivity (Neon Cyan) */}
          <path
            d={techPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glowCyanLine)"
          />

          {/* Milestone Event Pins with staggered heights to avoid overlapping */}
          {timelineData.map((pt, i) => {
            if (!pt.events || pt.events.length === 0) return null;
            const x = getX(i);
            const y = getY(pt.iTech);
            const mainEvent = pt.events[0];
            const isAction = mainEvent.category === 'rkn_action';
            const isFail = mainEvent.category === 'rkn_fail';
            const color = isAction ? '#ef4444' : isFail ? '#fbbf24' : '#10b981';

            // Stagger pin height based on index parity to prevent cluster collisions
            const pinOffset = (i % 2 === 0) ? 22 : 36;
            const pinTargetY = isAction ? y + pinOffset : y - pinOffset;

            return (
              <g 
                key={`evt-${i}`} 
                className="cursor-pointer group/pin"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDate(pt.date);
                }}
              >
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={pinTargetY}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="opacity-70 group-hover/pin:opacity-100"
                />
                <circle
                  cx={x}
                  cy={pinTargetY}
                  r="5"
                  fill="#0b1120"
                  stroke={color}
                  strokeWidth="2.5"
                  className="transition-transform group-hover/pin:scale-150"
                />
              </g>
            );
          })}

          {/* Active Date Vertical Line Cursor */}
          {currentX && (
            <g className="transition-all duration-300">
              <line
                x1={currentX}
                y1={padding.top}
                x2={currentX}
                y2={height - padding.bottom}
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
              <circle
                cx={currentX}
                cy={getY(timelineData[currentIndex].iTech)}
                r="7"
                fill="#06b6d4"
                stroke="#fff"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <circle
                cx={currentX}
                cy={getY(timelineData[currentIndex].iNar)}
                r="5"
                fill="#c084fc"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Hover indicator cursor */}
          {hoveredPoint && (
            <g className="pointer-events-none">
              {(() => {
                const hoverIdx = timelineData.findIndex(p => p.date === hoveredPoint.date);
                const hx = getX(hoverIdx);
                const hyTech = getY(hoveredPoint.iTech);
                const hyNar = getY(hoveredPoint.iNar);
                return (
                  <>
                    <line
                      x1={hx}
                      y1={padding.top}
                      x2={hx}
                      y2={height - padding.bottom}
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="opacity-60"
                    />
                    <circle cx={hx} cy={hyTech} r="4" fill="#06b6d4" />
                    <circle cx={hx} cy={hyNar} r="4" fill="#c084fc" />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Floating Tooltip / HUD for Hover or Current */}
        {(hoveredPoint || timelineData[currentIndex]) && (
          <div 
            className="absolute top-2 right-4 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none text-xs z-20 flex flex-wrap items-center gap-4 transition-all"
          >
            {(() => {
              const active = hoveredPoint || timelineData[currentIndex];
              return (
                <>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Период</div>
                    <div className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {active.displayDate}
                    </div>
                  </div>

                  {/* Tech Reality */}
                  <div className="border-l border-slate-800 pl-3">
                    <div className="text-[10px] text-cyan-400 uppercase font-mono">Физика сети (I_tech)</div>
                    <div className="font-bold font-mono mt-0.5 text-cyan-300">
                      {active.iTech > 0 ? `+${active.iTech}` : active.iTech}
                    </div>
                  </div>

                  {/* Narrative Pressure */}
                  <div className="border-l border-slate-800 pl-3">
                    <div className="text-[10px] text-purple-400 uppercase font-mono">Нарратив (I_nar)</div>
                    <div className="font-bold font-mono mt-0.5 text-purple-300">
                      {active.iNar > 0 ? `+${active.iNar}` : active.iNar}
                    </div>
                  </div>

                  {/* Delta Gap */}
                  <div className="border-l border-slate-800 pl-3">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono">Дельта (Δ)</div>
                    <div className="font-bold font-mono mt-0.5 text-emerald-300">
                      {active.deltaGap > 0 ? `+${active.deltaGap}` : active.deltaGap}
                    </div>
                  </div>

                  {/* Gap Status */}
                  <div className="border-l border-slate-800 pl-3">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Состояние</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {active.gapStatus?.label || 'Паритет'}
                    </div>
                  </div>

                  {active.events && active.events.length > 0 && (
                    <div className="border-l border-slate-800 pl-3 max-w-[180px]">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase font-mono truncate">
                        ★ {active.events[0].title}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Historical Era Milestones Bar below chart */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Ключевые вехи расхождения:
        </span>
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-emerald-400 font-mono font-medium">2018: Telegram (Δ +130)</span>
          <span className="text-slate-600">•</span>
          <span className="text-rose-400 font-mono font-medium">2021: Twitter / t.co (Δ -35)</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-mono font-medium">2022: Военная цензура (Δ +75)</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-mono font-medium">2024: YouTube & Zapret (Δ +110)</span>
        </div>
      </div>
    </div>
  );
}

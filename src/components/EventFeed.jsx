import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function EventFeed({ 
  events, 
  currentDate, 
  onSelectEvent, 
  onSelectDate 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeScope, setTimeScope] = useState('all'); // 'window' or 'all'

  const currentYear = new Date(currentDate).getFullYear();

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Category filter
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }

      // Time scope filter (within ~6 months of current selected date)
      if (timeScope === 'window') {
        const eTime = new Date(e.date).getTime();
        const cTime = new Date(currentDate).getTime();
        const diffDays = Math.abs(eTime - cTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 200) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchDesc = e.description.toLowerCase().includes(q);
        const matchTech = e.tech ? e.tech.some(t => t.toLowerCase().includes(q)) : false;
        return matchTitle || matchDesc || matchTech;
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events, selectedCategory, timeScope, searchQuery, currentDate]);

  const categories = [
    { id: 'all', label: 'Все события', count: events.length },
    { id: 'rkn_action', label: 'Натиск РКН', icon: ShieldAlert, color: 'text-red-400' },
    { id: 'bypass_success', label: 'Успехи защиты', icon: Shield, color: 'text-emerald-400' },
    { id: 'rkn_fail', label: 'Факапы РКН', icon: AlertTriangle, color: 'text-amber-400' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
      {/* Feed Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Хроника противостояния: Лента событий
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Исторические вехи, блокировки ТСПУ, релизы утилит обхода и сбои цензуры
          </p>
        </div>

        {/* Time Scope Toggle */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeScope('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeScope === 'all'
                ? 'bg-slate-800 text-slate-100 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Вся хроника ({events.length})
          </button>
          <button
            onClick={() => setTimeScope('window')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              timeScope === 'window'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Окно выбранной даты
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по названию, DPI, ТСПУ, WireGuard, Zapret, закону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-800 text-slate-100 border-slate-600 font-semibold shadow-sm'
                      : 'bg-slate-950/50 hover:bg-slate-800/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${cat.color}`} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
          <span>
            Показано: <strong className="text-cyan-300 font-mono">{filteredEvents.length}</strong> из <strong className="text-slate-300 font-mono">{events.length}</strong> событий
          </span>
          {searchQuery && (
            <span className="text-cyan-400/80 italic">По запросу «{searchQuery}»</span>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Событий по заданным фильтрам не найдено</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setTimeScope('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isAction = event.category === 'rkn_action';
            const isFail = event.category === 'rkn_fail';
            const isBypass = event.category === 'bypass_success';
            const eventYear = new Date(event.date).getFullYear();
            const isCurrentYear = eventYear === currentYear;

            const badgeBg = isAction
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : isFail
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            const cardBorder = isCurrentYear
              ? 'border-cyan-500/50 bg-slate-900/90 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              : 'border-slate-800/90 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/60';

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${cardBorder}`}
              >
                {/* Top line: Category, Date, Impact Score */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[11px] font-mono rounded-full border ${badgeBg} flex items-center gap-1`}>
                      {isAction && <ShieldAlert className="w-3 h-3" />}
                      {isFail && <AlertTriangle className="w-3 h-3" />}
                      {isBypass && <Shield className="w-3 h-3" />}
                      {isAction ? 'Натиск РКН' : isFail ? 'Сбой РКН' : 'Успех обхода'}
                    </span>

                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(event.date);
                      }}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      title="Кликните, чтобы переместить таймлайн на эту дату"
                    >
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>

                  {/* Impact Score Dots */}
                  <div className="flex items-center gap-1" title={`Сила воздействия: ${event.impact_score}/10`}>
                    <span className="text-[10px] font-mono text-slate-500 mr-1 hidden sm:inline">Impact:</span>
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3.5 rounded-sm ${
                          i < event.impact_score
                            ? isAction
                              ? 'bg-red-500'
                              : isFail
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{event.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </h4>

                {/* Short snippet */}
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Tech tags */}
                {event.tech && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {event.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

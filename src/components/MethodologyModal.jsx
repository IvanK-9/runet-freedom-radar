import React, { useEffect } from 'react';
import { X, BookOpen, Scale, Globe, Zap, Split } from 'lucide-react';

export default function MethodologyModal({ onClose }) {
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Двухконтурная методология: «Нарратив» vs. «Физика сети» & Дельта расхождения (Δ)
              </h2>
              <p className="text-xs text-slate-400">
                Математический аппарат сопоставления регуляторного давления и реальной проходимости пакетов
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-300">
          
          {/* Section 1: The Dual-Index Concept */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm text-cyan-400">
              <Split className="w-4 h-4" /> 1. Почему необходимы два индекса (Индекс Нарратива vs Индекс Сети)
            </h3>
            <p className="leading-relaxed text-slate-300">
              Если измерять интернет только по публикациям СМИ или реестрам законов, мы попадаем в <strong>«ошибку выжившего»</strong>. Государство объявляет о запретах, но реальная связность сети определяется криптографией и протоколами обхода.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                <span className="font-bold text-purple-300 font-mono text-xs block mb-1">
                  🏛 Индекс Нарратива (I_nar): [-100..+100]
                </span>
                <p className="text-[11px] text-slate-400">
                  Бумажное давление: законы, реестры РКН, штрафы, признание сервисов «экстремистскими», якорный балл Freedom on the Net.
                </p>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-500/30 p-3 rounded-xl">
                <span className="font-bold text-cyan-300 font-mono text-xs block mb-1">
                  ⚡ Индекс Физики Сети (I_tech): [-100..+100]
                </span>
                <p className="text-[11px] text-slate-400">
                  Реальная связность: проходимость пакетов сквозь ТСПУ (OONI), трафик HTTP/3 (Cloudflare), устойчивость утилит (Zapret, Reality) и сбои инфраструктуры (Сбой.рф).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Reality Gap Formula & States */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm text-emerald-400">
              <Zap className="w-4 h-4" /> 2. Дельта расхождения (Δ_gap) и матрица состояний
            </h3>
            <p className="text-slate-300">
              Дельта расхождения вычисляется как прямая разность между физикой сети и юридическим прессингом:
            </p>
            <div className="bg-slate-900 p-3 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800">
              Δ_gap = I_tech - I_nar
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <span className="font-bold text-emerald-300 block font-mono">
                  Δ &gt; +60 : «Иллюзия контроля» (Potemkin Control)
                </span>
                <span className="text-slate-400">
                  Законы драконовские (I_nar ~ -85), но сообщество нивелировало блокировки софтом (Zapret, VLESS Reality). ТСПУ бессилен, YouTube летает в 4K.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs">
                <span className="font-bold text-cyan-300 block font-mono">
                  +20 &lt; Δ ≤ +60 : «Технологический паритет» (Cat &amp; Mouse Race)
                </span>
                <span className="text-slate-400">
                  Позиционная война: ТСПУ атакует порты и рукопожатия, сисадмины на лету поднимают stealth-туннели. Сеть держится с умеренными потерями.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                <span className="font-bold text-slate-300 block font-mono">
                  -20 ≤ Δ ≤ +20 : «Синхронная блокада» (Total Compliance)
                </span>
                <span className="text-slate-400">
                  Физика сети совпала с цензурой: заблокированные сервисы действительно труднодоступны для большинства граждан.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-300 block font-mono">
                  Δ &lt; -20 : «Самострел РКН / Коллатеральный коллапс» (Collateral Chaos)
                </span>
                <span className="text-slate-400">
                  Реальность хуже риторики: из-за ковровых блокировок или кривых сигнатур ТСПУ падают банки, кассы, домены .RU и сайты госорганов.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Historical Calibration */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm text-amber-400">
              <Scale className="w-4 h-4" /> 3. Историческая калибровка формулы (2018–2026)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">2018: Telegram</span>
                <span className="text-emerald-400 font-bold block text-sm">Δ = +130</span>
                <span className="text-[10px] text-slate-500">20 млн IP в бане, но телега работает</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">2021: Twitter / t.co</span>
                <span className="text-rose-400 font-bold block text-sm">Δ = -35</span>
                <span className="text-[10px] text-slate-500">Regex-фейл: упали RT и Кремль</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">2024: YouTube &amp; Zapret</span>
                <span className="text-emerald-400 font-bold block text-sm">Δ = +110</span>
                <span className="text-[10px] text-slate-500">Троттлинг ТСПУ обойден локально</span>
              </div>
            </div>
          </div>

          {/* Section 4: Global Net Freedom Benchmark Anchor */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm text-amber-400">
              <Globe className="w-4 h-4" /> 4. Якорная метрика: Global Net Freedom Benchmark (GNFB)
            </h3>
            <p className="text-slate-300">
              Международный бенчмарк прав в сети задает долгосрочный макро-уровень для I_nar. Падение показателей России с 35 баллов в 2016 году до 15 в 2026 году подтверждает переход в зону тотального административного прессинга (Not Free).
            </p>
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

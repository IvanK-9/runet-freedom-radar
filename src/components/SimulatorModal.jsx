import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, CheckCircle, RotateCcw } from 'lucide-react';

export default function SimulatorModal({ onClose, onAddSimulatedEvent, onResetEvents, customCount }) {
  const [headline, setHeadline] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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

  const presets = [
    {
      title: "РКН тестирует ИИ-детектирование аномалий VLESS и Reality на ТСПУ",
      category: "rkn_action",
      impact: 8,
      tech: ["ТСПУ", "VLESS Reality", "ML-фильтрация", "Эвристика"],
      reasoning: "Попытка регулятора внедрить поведенческий анализ для обнаружения зашифрованных рукопожатий без расшифровки SNI. Высокая степень угрозы протоколам маскировки."
    },
    {
      title: "Вышел релиз Zapret v2.0 с автоматической адаптацией под новые сигнатуры ТСПУ",
      category: "bypass_success",
      impact: 9,
      tech: ["Zapret 2.0", "Auto-desync", "TCP Splitting", "Kernel bypass"],
      reasoning: "Технологический прорыв обхода: инструмент теперь автоматически подбирает стратегию десинхронизации пакетов для каждого оператора, делая блокировки неэффективными без участия пользователя."
    },
    {
      title: "Авария на оборудовании ТСПУ привела к сбою работы Системы быстрых платежей (СБП) и онлайн-банков",
      category: "rkn_fail",
      impact: 8,
      tech: ["Сбой ТСПУ", "СБП ЦБ РФ", "Коллатеральный ущерб", "BGP Flapping"],
      reasoning: "Очередной факап цензурной инфраструктуры: некорректная сигнатура заблокировала легальный межбанковский трафик, вынудив регулятор временно отключить фильтры."
    },
    {
      title: "Роскомнадзор объявил о полной блокировке GitHub и Docker Hub в России",
      category: "rkn_action",
      impact: 10,
      tech: ["Блокировка разработчиков", "IT-изоляция", "ТСПУ"],
      reasoning: "Критический удар по отечественной IT-индустрии, сравнимый с военной цензурой 2022 года. Резко сдвигает баланс в сторону тотального натиска."
    }
  ];

  const handleSelectPreset = (p) => {
    setHeadline(p.title);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    if (!headline.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate LLM JSON response latency and intelligent heuristic parsing
    setTimeout(() => {
      const lower = headline.toLowerCase();

      // Heuristics to simulate LLM JSON classification
      let cat = 'rkn_action';
      let impact = 7;
      let tags = ['ТСПУ', 'Блокировки'];
      let reasoning = 'Классифицировано как действие регулирующих органов по усилению контроля над сетью.';

      if (lower.includes('zapret') || lower.includes('обход') || lower.includes('vpn') || lower.includes('релиз') || lower.includes('amnezia') || lower.includes('vless')) {
        cat = 'bypass_success';
        impact = 8;
        tags = ['Обход блокировок', 'Криптография', 'Инструменты'];
        reasoning = 'Событие относится к технологиям противодействия цензуре и расширению доступности сети.';
      } else if (lower.includes('сбой') || lower.includes('авария') || lower.includes('упал') || lower.includes('коллапс') || lower.includes('факап')) {
        cat = 'rkn_fail';
        impact = 8;
        tags = ['Сбой ТСПУ', 'Инфраструктура', 'Коллатеральный ущерб'];
        reasoning = 'Событие демонстрирует технологические ограничения и ошибки в работе систем фильтрации.';
      }

      // Check presets match
      const matchedPreset = presets.find(p => p.title === headline);
      if (matchedPreset) {
        cat = matchedPreset.category;
        impact = matchedPreset.impact;
        tags = matchedPreset.tech;
        reasoning = matchedPreset.reasoning;
      }

      setAnalysisResult({
        title: headline,
        category: cat,
        impact_score: impact,
        tech: tags,
        description: reasoning,
        source_type: 'tech_community',
        date: new Date().toISOString().split('T')[0],
        fotn_score: 15
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleApplyToRadar = () => {
    if (!analysisResult) return;
    onAddSimulatedEvent(analysisResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                LLM-Симулятор новостей & Моделирование баланса
              </h2>
              <p className="text-xs text-slate-400">
                Протестируйте, как новое событие или заголовок СМИ изменит показания спидометра
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
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Готовые сценарии для проверки (кликните для выбора):
            </label>
            <div className="space-y-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                    headline === p.title
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    p.category === 'rkn_action' ? 'bg-red-500/20 text-red-300' :
                    p.category === 'rkn_fail' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {p.category === 'rkn_action' ? 'Натиск' : p.category === 'rkn_fail' ? 'Факап' : 'Обход'} ({p.impact}/10)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Или введите свой заголовок / событие:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Например: Разработчики обошли блокировку Discord с помощью нового прокси..."
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={!headline.trim() || isAnalyzing}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                {isAnalyzing ? (
                  <>Анализ LLM...</>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Классифицировать
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Результат классификации LLM (JSON):
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  analysisResult.category === 'rkn_action' ? 'bg-red-500/20 text-red-300' :
                  analysisResult.category === 'rkn_fail' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {analysisResult.category === 'rkn_action' ? 'Натиск РКН' : analysisResult.category === 'rkn_fail' ? 'Сбой цензуры' : 'Успех обхода'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Сила влияния (Impact):</span>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {analysisResult.impact_score} / 10
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Теги:</span>
                  <span className="text-xs font-mono text-cyan-300">
                    {analysisResult.tech.join(', ')}
                  </span>
                </div>
              </div>

              {/* Dual-Index shift preview */}
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between">
                <span className="text-slate-400">Влияние на двухконтурную модель:</span>
                <span className={`font-mono font-semibold ${
                  analysisResult.category === 'bypass_success' ? 'text-emerald-400' :
                  analysisResult.category === 'rkn_action' ? 'text-purple-400' : 'text-rose-400'
                }`}>
                  {analysisResult.category === 'bypass_success' && '↑ Рост индекса сети (Δ увеличивается)'}
                  {analysisResult.category === 'rkn_action' && '↓ Удар по нарративу (рост регуляторного давления)'}
                  {analysisResult.category === 'rkn_fail' && '⚠ Фиксация сбоя ТСПУ (краш-радар)'}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                "{analysisResult.description}"
              </p>

              <button
                onClick={handleApplyToRadar}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Внедрить событие в расчет спидометра и графиков
              </button>
            </div>
          )}

          {/* Reset custom events */}
          {customCount > 0 && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Добавлено смоделированных событий: <strong className="text-cyan-400">{customCount}</strong></span>
              <button
                onClick={onResetEvents}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Сбросить до оригинала
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

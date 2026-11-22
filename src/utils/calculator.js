import { fotnData } from '../data/fotnData';

/**
 * Получить Freedom on the Net оценку для конкретного года
 */
export function getFotnForYear(year) {
  const item = fotnData.find(d => d.year === year);
  if (item) return item;
  if (year < 2016) return fotnData[0];
  return fotnData[fotnData.length - 1];
}

/**
 * Расчет статуса Дельты Расхождения (Δ_gap = I_tech - I_nar)
 */
export function getGapStatus(delta) {
  if (delta > 60) {
    return {
      label: "Иллюзия контроля",
      enLabel: "Potemkin Control",
      sublabel: "Законы драконовские, но софт обхода (Zapret, VLESS) свел блокировки на нет",
      color: "#10b981", // emerald
      bgColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      accent: "emerald"
    };
  }
  if (delta > 20) {
    return {
      label: "Технологический паритет",
      enLabel: "Cat & Mouse Race",
      sublabel: "Позиционная борьба: ТСПУ глушит каналы, сисадмины на лету поднимают stealth-туннели",
      color: "#06b6d4", // cyan
      bgColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      accent: "cyan"
    };
  }
  if (delta >= -20) {
    return {
      label: "Синхронная блокада",
      enLabel: "Total Compliance",
      sublabel: "Физика сети совпала с цензурой: заблокированные сервисы действительно труднодоступны",
      color: "#94a3b8", // slate
      bgColor: "bg-slate-500/15 text-slate-300 border-slate-500/30",
      accent: "slate"
    };
  }
  return {
    label: "Самострел РКН / Коллапс",
    enLabel: "Collateral Chaos",
    sublabel: "Сеть работает хуже, чем заявлено: из-за кривых сигнатур ТСПУ падают банки, кассы и домены .RU",
    color: "#f43f5e", // rose
    bgColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    accent: "rose"
  };
}

/**
 * Описание состояния для Индекса Сети (I_tech)
 */
export function getTechStatus(score) {
  if (score >= 60) return { label: "Свободная связность (Обход 90%+)", color: "#10b981" };
  if (score >= 20) return { label: "Высокая проходимость (Stealth-протоколы)", color: "#06b6d4" };
  if (score >= -20) return { label: "Умеренная деградация (Частичные сбои)", color: "#f59e0b" };
  if (score >= -60) return { label: "Тяжелая фильтрация (ТСПУ глушит UDP/VPN)", color: "#f97316" };
  return { label: "Глубокая изоляция / Сетевой коллапс", color: "#ef4444" };
}

/**
 * Описание состояния для Индекса Нарратива (I_nar)
 */
export function getNarrativeStatus(score) {
  if (score >= -30) return { label: "Умеренное регулирование", color: "#94a3b8" };
  if (score >= -60) return { label: "Системное юридическое давление", color: "#f97316" };
  if (score >= -85) return { label: "Драконовская военная цензура", color: "#ef4444" };
  return { label: "Тотальный законодательный запрет", color: "#b91c1c" };
}

/**
 * Двухконтурный расчет: Индекс Нарратива (I_nar) и Индекс Физики Сети (I_tech)
 * @param {Array} events - Список событий
 * @param {Date|string} targetDate - Целевая дата
 * @param {number} halfLifeDays - Период полураспада влияния события (по умолчанию 180 дней)
 */
export function calculateBalanceAtDate(events, targetDate, halfLifeDays = 180) {
  const targetTime = new Date(targetDate).getTime();
  const targetYear = new Date(targetDate).getFullYear();
  const decayConstant = Math.log(2) / (halfLifeDays * 24 * 60 * 60 * 1000);

  const fotn = getFotnForYear(targetYear);

  let totalPressure = 0;
  let totalBypass = 0;
  let totalFail = 0;
  let activeEventsCount = 0;

  events.forEach(event => {
    const eventTime = new Date(event.date).getTime();
    if (eventTime > targetTime) return;

    const diffMs = targetTime - eventTime;
    const decay = Math.exp(-diffMs * decayConstant);

    if (decay < 0.02) return;

    activeEventsCount++;
    const impact = event.impact_score || 5;

    if (event.category === 'rkn_action') {
      totalPressure += impact * decay;
    } else if (event.category === 'bypass_success') {
      totalBypass += impact * decay;
    } else if (event.category === 'rkn_fail') {
      totalFail += impact * decay;
    }
  });

  // 1. Индекс Нарратива (I_nar): базовый фон Freedom on the Net + оперативная реакция законов
  // Freedom on the Net: 100 -> I_nar: 0; Fotn: 15 -> I_nar: -85.
  const baseFotnPressure = -100 * (1 - fotn.score / 100);
  const mediaModifier = Math.min(15, Math.max(-15, (totalBypass - totalPressure) * 0.8));
  let iNar = Math.round(baseFotnPressure + mediaModifier);
  iNar = Math.max(-100, Math.min(100, iNar));

  // 2. Индекс Физики Сети (I_tech): реальная проходимость пакетов, stealth-обход и сопутствующий ущерб
  // totalBypass дает мощный плюс (+1.35x), totalPressure дает минус (-1.0x), totalFail снижает устойчивость РКН (+0.8x к обходу, но добавляет краши)
  const effectiveDefense = totalBypass * 1.35 + totalFail * 0.7;
  const effectivePressure = totalPressure * 0.95;
  const alpha = 4;

  let iTech = 0;
  if (effectiveDefense + effectivePressure > 0) {
    iTech = ((effectiveDefense - effectivePressure) / (effectiveDefense + effectivePressure + alpha)) * 100;
  }
  iTech = Math.max(-100, Math.min(100, Math.round(iTech)));

  // 3. Дельта Расхождения (Reality Gap)
  const deltaGap = iTech - iNar;
  const gapStatus = getGapStatus(deltaGap);

  // Классический сводный баланс для обратной совместимости
  const balance = iTech;

  return {
    balance,
    iNar,                          // Индекс Нарратива / Бумажного давления (-100..+100)
    iTech,                         // Индекс Физики Сети / Реальной доступности (-100..+100)
    deltaGap,                      // Δ_gap = I_tech - I_nar (-200..+200)
    gapStatus,                     // Статус расхождения ("Иллюзия контроля", "Паритет", etc.)
    pressureWeight: Math.round(totalPressure * 10) / 10,
    defenseWeight: Math.round(totalBypass * 10) / 10,
    failWeight: Math.round(totalFail * 10) / 10,
    activeEventsCount,
  };
}

/**
 * Описание состояния для спидометра (базовый хелпер)
 */
export function getSpeedometerStatus(score) {
  if (score <= -70) {
    return {
      label: "Тотальный натиск РКН",
      sublabel: "Драконовские законы, веерные блокировки, попытка изоляции сети",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.4)",
      badgeBg: "bg-red-500/20 text-red-400 border-red-500/30",
    };
  }
  if (score <= -30) {
    return {
      label: "Жесткая осада ТСПУ",
      sublabel: "Атаки на протоколы, замедление трафика, вычищение VPN",
      color: "#f87171",
      glowColor: "rgba(248, 113, 113, 0.35)",
      badgeBg: "bg-red-500/15 text-red-300 border-red-500/30",
    };
  }
  if (score <= -10) {
    return {
      label: "Преобладание давления",
      sublabel: "Регулятор перехватывает инициативу, адаптация запаздывает",
      color: "#fb923c",
      glowColor: "rgba(251, 146, 60, 0.3)",
      badgeBg: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    };
  }
  if (score < 10) {
    return {
      label: "Динамический паритет",
      sublabel: "Позиционная борьба: обновления ТСПУ vs модификации пакетов",
      color: "#94a3b8",
      glowColor: "rgba(148, 163, 184, 0.25)",
      badgeBg: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    };
  }
  if (score < 40) {
    return {
      label: "Активизация защиты",
      sublabel: "Новые инструменты быстро распространяются среди пользователей",
      color: "#2dd4bf",
      glowColor: "rgba(45, 212, 191, 0.3)",
      badgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    };
  }
  if (score < 70) {
    return {
      label: "Массовый технологический обход",
      sublabel: "Утилиты (Zapret, ByeDPI, Reality) массово нейтрализуют ТСПУ",
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.35)",
      badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
  }
  return {
    label: "Бессилие цензуры",
    sublabel: "Факапы РКН, сопутствующий ущерб Рунету, доминирование защиты",
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.4)",
    badgeBg: "bg-green-500/25 text-green-300 border-green-500/40",
  };
}

/**
 * Построение временного ряда точек для двухконтурного графика (2016-01 по 2026-03, ежемесячно)
 */
export function generateTimelineSeries(events) {
  const points = [];
  const startYear = 2016;
  const endYear = 2026;

  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = year === 2026 ? 3 : 12;
    for (let month = 1; month <= maxMonth; month++) {
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const dateStr = `${year}-${monthStr}-15`;
      const dateObj = new Date(dateStr);

      const { 
        balance, 
        iNar, 
        iTech, 
        deltaGap, 
        gapStatus,
        pressureWeight, 
        defenseWeight, 
        failWeight 
      } = calculateBalanceAtDate(events, dateStr);
      
      const fotn = getFotnForYear(year);

      const eventsThisMonth = events.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getFullYear() === year && eDate.getMonth() + 1 === month;
      });

      points.push({
        date: dateStr,
        displayDate: `${monthStr}.${year}`,
        year,
        month,
        timestamp: dateObj.getTime(),
        balance,
        iNar,
        iTech,
        deltaGap,
        gapStatus,
        fotnScore: fotn.score,
        pressureWeight,
        defenseWeight,
        failWeight,
        events: eventsThisMonth,
        hasEvents: eventsThisMonth.length > 0
      });
    }
  }

  return points;
}

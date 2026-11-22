// Данные Global Net Freedom Benchmark (GNFB) по России (2016–2026)
// Шкала: 0 (тотальная цензура) - 100 (свободный интернет)
// 70-100: Free, 40-69: Partly Free, 0-39: Not Free

export const fotnData = [
  {
    year: 2016,
    score: 35,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 12, // max 25
      limitsOnContent: 14,   // max 35
      userRights: 9          // max 40
    },
    keyEvents: "Принятие 'Пакета Яровой', расширение черных списков сайтов, первые требования о локализации баз данных (Linkedin)."
  },
  {
    year: 2017,
    score: 33,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 11,
      limitsOnContent: 13,
      userRights: 9
    },
    keyEvents: "Закон о запрете анонимайзеров и средств обхода блокировок (276-ФЗ), требования ключей шифрования от мессенджеров."
  },
  {
    year: 2018,
    score: 31,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 10,
      limitsOnContent: 12,
      userRights: 9
    },
    keyEvents: "Попытка блокировки Telegram, веерные блокировки 20 млн IP-адресов облачных провайдеров (AWS, Google Cloud)."
  },
  {
    year: 2019,
    score: 31,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 10,
      limitsOnContent: 12,
      userRights: 9
    },
    keyEvents: "Принятие закона о 'Суверенном Рунете' (90-ФЗ), запуск пилотных зон с оборудованием ТСПУ (DPI)."
  },
  {
    year: 2020,
    score: 30,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 10,
      limitsOnContent: 11,
      userRights: 9
    },
    keyEvents: "Официальная капитуляция РКН перед Telegram, ускоренное оснащение магистральных операторов ТСПУ."
  },
  {
    year: 2021,
    score: 30,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 10,
      limitsOnContent: 11,
      userRights: 9
    },
    keyEvents: "Первое боевое применение ТСПУ: замедление Twitter (X), блокировка приложения 'Умное голосование', начало блокады Tor."
  },
  {
    year: 2022,
    score: 23,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 8,
      limitsOnContent: 8,
      userRights: 7
    },
    keyEvents: "Обвал на 7 пунктов. Введение военной цензуры, блокировка сотен независимых СМИ, Instagram и Facebook, исход сервисов, бум VPN."
  },
  {
    year: 2023,
    score: 21,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 7,
      limitsOnContent: 8,
      userRights: 6
    },
    keyEvents: "Массовая протокольная блокировка WireGuard и OpenVPN на ТСПУ, миграция комьюнити на VLESS/Reality."
  },
  {
    year: 2024,
    score: 20,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 6,
      limitsOnContent: 8,
      userRights: 6
    },
    keyEvents: "Искусственное замедление YouTube, блокировка Discord и Signal, атака на TLS ECH Cloudflare, народный релиз Zapret и ByeDPI."
  },
  {
    year: 2025,
    score: 17,
    status: "Not Free",
    statusRu: "Несвободный",
    breakdown: {
      obstaclesToAccess: 5,
      limitsOnContent: 7,
      userRights: 5
    },
    keyEvents: "Падение 4 года подряд (втрое ниже 2011 г.). Реестр блогеров 10k+, шатдауны мобильного интернета в регионах, подготовка белых списков."
  },
  {
    year: 2026,
    score: 15,
    status: "Not Free",
    statusRu: "Несвободный (Экстремальный контроль)",
    breakdown: {
      obstaclesToAccess: 4,
      limitsOnContent: 6,
      userRights: 5
    },
    keyEvents: "Полномасштабная война ТСПУ против протоколов маскировки трафика, локальные изолированные сегменты, ответное развитие stealth-технологий."
  }
];

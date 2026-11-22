"""
Runet Freedom Radar - Automated News Crawler & LLM Classifier (Iteration 2 Pipeline)

Назначение:
- Автоматический сбор свежих публикаций раз в сутки из пула RSS и Telegram источников.
- Решение «Ошибки выжившего»: балансирует официальные медиа с техническими сообществами (Хабр, Telegram, ntc.party).
- Классификация событий через LLM (Google Gemini API / OpenAI) со строгим JSON-выводом.
- Дозапись в локальную базу (JSON / SQLite).
"""

import os
import sys
import json
import sqlite3
import datetime
import urllib.request
import xml.etree.ElementTree as ET

# Конфигурация пула источников для избежания "ошибки выжившего"
SOURCES = [
  # Пул 1: Техно-сообщества и разработчики инструментов обхода
  {"name": "Habr: Сети и безопасность", "url": "https://habr.com/ru/rss/hub/infosecurity/all/", "type": "tech_community"},
  {"name": "NTC Party (Network Censorship Forum)", "url": "https://ntc.party/posts.rss", "type": "tech_community"},
  {"name": "GitHub Releases (Amnezia / Zapret / ByeDPI)", "url": "https://github.com/bol-van/zapret/releases.atom", "type": "tech_community"},

  # Пул 2: Профильные Telegram-каналы (публичный RSS-мост или API)
  {"name": "ЗаТелеком (Михаил Климарев)", "url": "https://tg.i-c-a.su/rss/zatelecom", "type": "telegram"},
  {"name": "Эшер II (Филипп Кулин)", "url": "https://tg.i-c-a.su/rss/usher2", "type": "telegram"},
  {"name": "Роскомсвобода", "url": "https://tg.i-c-a.su/rss/roskomsvoboda", "type": "telegram"},

  # Пул 3: Общие медиа (контроль официальной повестки и заявлений РКН)
  {"name": "Коммерсантъ: Телеком", "url": "https://www.kommersant.ru/RSS/section-hightech.xml", "type": "media"},
  {"name": "РБК: Технологии и медиа", "url": "https://rssexport.rbc.ru/rbcnews/news/30/full.rss", "type": "media"}
]

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "radar_database.db")

SYSTEM_PROMPT = """
Ты — старший эксперт по сетевым технологиям, цензуре и DPI в Рунете.
Твоя задача — проанализировать входящую новость и определить, относится ли она к противостоянию Роскомнадзора (РКН) и средств обхода цензуры (VPN, DPI, ТСПУ).

Верни ответ СТРОГО в формате валидного JSON без markdown-блоков:
{
  "is_relevant": true | false,
  "title": "Краткий емкий заголовок (до 70 символов)",
  "category": "rkn_action" | "bypass_success" | "rkn_fail",
  "impact_score": 1..10,
  "tech": ["DPI", "ТСПУ", "Zapret", "VLESS", "WireGuard", ...],
  "summary": "Техническое резюме события (1-2 предложения)",
  "reasoning": "Почему присвоена данная категория и балл влияния"
}

Критерии категорий:
- "rkn_action": Законы, ТСПУ, блокировка сайтов, протоколов VPN, шатдауны, штрафы.
- "bypass_success": Релизы утилит (Zapret, ByeDPI, AmneziaWG, Xray), новые протоколы маскировки, рост аудитории обхода.
- "rkn_fail": Ошибки и факапы РКН, сопутствующий ущерб (упали банки, кассы, госуслуги), сбои в ТСПУ.

Impact score:
- 1-3: Локальное незначительное событие
- 4-6: Заметное событие (блокировка отдельного сервиса, обновление прокси)
- 7-8: Крупное событие (блокировка протокола, миллионные сбои, знаковый релиз)
- 9-10: Тектонический сдвиг (военная цензура, запрет Telegram/YouTube, блокировка ECH/DPI)
"""

def init_db():
  """Инициализация SQLite базы данных для сохранения собранных событий"""
  os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
  conn = sqlite3.connect(DB_PATH)
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS radar_events (
      id TEXT PRIMARY KEY,
      date TEXT,
      title TEXT,
      category TEXT,
      impact_score INTEGER,
      source_name TEXT,
      source_type TEXT,
      tech TEXT,
      summary TEXT,
      raw_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  """)
  conn.commit()
  conn.close()

def fetch_rss_feed(source):
  """Парсинг RSS/Atom ленты"""
  items = []
  try:
    req = urllib.request.Request(
      source["url"], 
      headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RunetFreedomRadar/1.0'}
    )
    with urllib.request.urlopen(req, timeout=10) as response:
      xml_data = response.read()
      root = ET.fromstring(xml_data)

      # Поддержка стандартного RSS 2.0
      for item in root.findall('.//item')[:5]:
        title = item.find('title').text if item.find('title') is not None else ""
        link = item.find('link').text if item.find('link') is not None else ""
        desc = item.find('description').text if item.find('description') is not None else ""
        items.append({
          "title": title.strip(),
          "link": link.strip(),
          "description": desc.strip()[:300],
          "source_name": source["name"],
          "source_type": source["type"]
        })
  except Exception as e:
    print(f"[{source['name']}] Ошибка получения ленты: {e}")
  return items

def classify_with_llm(article_text):
  """
  Запрос к LLM для классификации события.
  В production используется google-genai SDK или OpenAI API.
  Здесь приведена эталонная обертка.
  """
  api_key = os.environ.get("GEMINI_API_KEY")
  if not api_key:
    # Возвращаем эвристический fallback если ключ не установлен
    return heuristic_fallback(article_text)

  # Пример прямого вызова Gemini REST API
  endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
  payload = {
    "contents": [{
      "parts": [{
        "text": f"{SYSTEM_PROMPT}\n\nНОВОСТЬ ДЛЯ АНАЛИЗА:\n{article_text}"
      }]
    }],
    "generationConfig": {
      "responseMimeType": "application/json",
      "temperature": 0.1
    }
  }

  try:
    req = urllib.request.Request(
      endpoint,
      data=json.dumps(payload).encode('utf-8'),
      headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=15) as res:
      result = json.loads(res.read().decode('utf-8'))
      text_content = result['candidates'][0]['content']['parts'][0]['text']
      return json.loads(text_content)
  except Exception as e:
    print(f"Ошибка вызова LLM API: {e}")
    return heuristic_fallback(article_text)

def heuristic_fallback(text):
  """Простой эвристический классификатор в случае отсутствия LLM ключа"""
  t = text.lower()
  is_rel = any(k in t for k in ['ркн', 'роскомнадзор', 'тспу', 'dpi', 'vpn', 'zapret', 'byedpi', 'wireguard', 'vless', 'блокировк'])
  if not is_rel:
    return {"is_relevant": False}

  if any(k in t for k in ['обход', 'zapret', 'byedpi', 'amnezia', 'vless', 'успех']):
    cat = "bypass_success"
    impact = 7
  elif any(k in t for k in ['сбой', 'упал', 'ошибка', 'факап', 'коллапс']):
    cat = "rkn_fail"
    impact = 8
  else:
    cat = "rkn_action"
    impact = 7

  return {
    "is_relevant": True,
    "title": text[:60] + "...",
    "category": cat,
    "impact_score": impact,
    "tech": ["DPI/ТСПУ"],
    "summary": text[:150],
    "reasoning": "Автоматическая классификация (эвристика)"
  }

def run_crawler_pipeline():
  """Основной цикл сбора и обновления базы"""
  print(f"=== [Runet Freedom Radar] Запуск сбора новостей: {datetime.datetime.now()} ===")
  init_db()

  conn = sqlite3.connect(DB_PATH)
  cursor = conn.cursor()

  added_count = 0
  for source in SOURCES:
    print(f"Сбор из источника: {source['name']} ({source['type']})...")
    items = fetch_rss_feed(source)
    for item in items:
      content = f"{item['title']}. {item['description']}"
      classification = classify_with_llm(content)

      if classification.get("is_relevant"):
        event_id = f"evt-{datetime.datetime.now().strftime('%Y%m%d')}-{abs(hash(item['link'])) % 10000}"
        today_str = datetime.date.today().isoformat()
        
        try:
          cursor.execute("""
            INSERT OR IGNORE INTO radar_events 
            (id, date, title, category, impact_score, source_name, source_type, tech, summary, raw_link)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          """, (
            event_id,
            today_str,
            classification.get("title", item['title']),
            classification.get("category", "rkn_action"),
            classification.get("impact_score", 6),
            item["source_name"],
            item["source_type"],
            json.dumps(classification.get("tech", []), ensure_ascii=False),
            classification.get("summary", ""),
            item["link"]
          ))
          if cursor.rowcount > 0:
            added_count += 1
            print(f"  [+] Добавлено событие: {classification.get('title')}")
        except Exception as e:
          print(f"Ошибка сохранения в БД: {e}")

  conn.commit()
  conn.close()
  print(f"=== Сбор завершен. Добавлено новых событий: {added_count} ===")

if __name__ == "__main__":
  run_crawler_pipeline()

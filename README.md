# Anver

Сайт магазина постельного белья **Anver** (100% хлопок, ручное производство в Молдове, г. Чадыр-Лунга).

- **`anver-react/`** — основной проект: Next.js 16 (App Router, статическая генерация), React 19, TypeScript, двуязычность RU/RO. Детали: [`anver-react/PROJECT.md`](anver-react/PROJECT.md).
- **`site/`** — выгрузка оригинального Tilda-сайта (эталон дизайна).

## Запуск

```bash
cd anver-react
npm install
npm run dev      # разработка (localhost:3000)
npm run build    # production-сборка
npm run start    # запуск собранного
```

## Данные для подключения

- Supabase: ключи в `anver-react/.env` (по образцу `anver-react/.env.example`), схема БД — `anver-react/supabase/schema.sql`.

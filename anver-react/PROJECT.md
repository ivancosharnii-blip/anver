# PROJECT.md — Anver React

> Переделка сайта магазина текстиля **Anver** (постельное бельё, 100% хлопок, ручное производство в Молдове).
> Эталон дизайна — оригинальный Tilda-сайт (выгрузка страниц лежит в `../site/*.html`).

---

## 1. Суть проекта

Сайт родителей Вани (магазин постельного белья Anver, Молдова, г. Чадыр-Лунга). Перенос с Tilda на Next.js с целью:
- точная копия оригинального дизайна (поэтапно — сначала копия, потом улучшения);
- **двуязычность RU/RO** (румынский — для молдавского рынка; переключатель в шапке);
- тёплый «семейный» стиль текстильного бренда.

---

## 2. Стек

| Технология | Версия / детали |
|---|---|
| Next.js | 16.3.1 (App Router, статическая генерация) |
| React | 19.2.8 |
| TypeScript | 5.x |
| Шрифт | **Nunito** (округлый, тёплый; подключён через `next/font/google`; subsets: latin, latin-ext, cyrillic) |
| Хостинг товаров | данные захардкожены в `lib/products.ts` (выгружено с Tilda API) |
| MCP | Supabase подключён в `opencode.json` (пока не используется) |

**Запуск:**
```bash
npm run dev      # разработка (localhost:3000)
npm run build    # production-сборка
npm run start    # запуск собранного
npm run typecheck
```

---

## 3. Структура проекта

```
anver-react/
├── app/
│   ├── layout.tsx          # корневой layout: Nunito + LanguageProvider + CartProvider + Header/Footer/MobileMenu/CartDrawer/FloatingButtons
│   ├── page.tsx            # главная (server-обёртка: metadata) → components/HomePage.tsx
│   ├── globals.css         # дизайн-система: переменные, .container, .btn, .section и т.д.
│   ├── ranforce/  sateen/  sateen-stripe/  sets/  pillowcases/  sheets/  bundles/
│   │   └── page.tsx        # каталог-страницы (server-обёртки: metadata) → components/CatalogPage.tsx
│   ├── contacts/           # page.tsx + contacts-content.tsx (client) + consult.tsx + contact-form.tsx + accordion.tsx + icons.tsx
│   ├── feedback/           # page.tsx + feedback-form.tsx
│   └── success/            # page.tsx + success-content.tsx (client) + accordion.tsx
├── components/
│   ├── Header.tsx          # шапка: меню (разное на главной/каталоге), переключатель RU/RO, корзина
│   ├── TopBanner.tsx       # полоса «ОСЕННИЕ СКИДКИ» + таймер (скрывается, когда акция закончилась)
│   ├── RatingBar (в Header) # «★★★★★ 800 довольных клиентов» (только главная)
│   ├── MobileMenu.tsx      # мобильное меню (в т.ч. переключатель языка)
│   ├── Footer.tsx          # футер (t977 с главной)
│   ├── FloatingButtons.tsx # плавающие кнопки Phone/Telegram/WhatsApp (t898)
│   ├── HomePage.tsx        # контент главной (hero, преимущества, каталоги, «о нас», контакты)
│   ├── CatalogPage.tsx     # общий шаблон каталог-страницы (панель категорий t978, крошки, заголовок, сетка)
│   ├── CatalogSection.tsx  # секция каталога на главной (+ ProductCard + ProductModal)
│   ├── ProductCard.tsx     # карточка товара
│   ├── ProductModal.tsx    # быстрый просмотр товара
│   └── CartDrawer.tsx      # выезжающая корзина
├── context/
│   ├── LanguageContext.tsx # мультиязычность: lang ('ru'|'ro'), setLang, t(key), сохранение в localStorage
│   └── CartContext.tsx     # корзина: items, addItem, removeItem, updateQuantity, formatPrice
├── lib/
│   ├── i18n.ts             # СЛОВАРИ ru/ro (весь UI-текст), тип Dict
│   ├── product-ro.ts       # перевод ТОВАРОВ на румынский (по uid) + бейджи скидок + названия опций
│   ├── products.ts         # товары (статика, выгрузка с Tilda: title, text, descr, gallery, json_options…)
│   └── site.ts             # константы: CONTACTS, IMAGES, CURRENCY, PROMO, RATING
└── public/                 # статика (favicon и пр.)
```

---

## 4. Дизайн-система (app/globals.css)

```css
--color-brand:      #b15c2a;   /* терракота — полоса скидок */
--color-brand-dark: #914128;
--color-primary:    #3a4f6a;   /* тёмно-синий */
--color-accent:     #5c7494;   /* стальной синий */
--color-accent-light:#e9eef4;  /* панель категорий */
--color-text:       #242424;
--color-muted:      #808080;
--color-border:     #dedede;
--color-bg-soft:    #f2f2f2;   /* футер, карточки */
--color-mark:       #ced9e7;
--color-stars:      #d59c3f;   /* звёзды рейтинга */
--font: var(--font-nunito), "Inter Tight", Arial, sans-serif;
```

Все значения взяты из оригинального Tilda-сайта (файлы `../site/*.html`, блоки-стили `#recNNN …`).

---

## 5. Мультиязычность RU/RO

### Как работает
- `context/LanguageContext.tsx` — провайдер с хуком `useLang()` → `{ lang, setLang, t, dict }`.
- `t("путь.ключ")` достаёт строку из словаря текущего языка (`lib/i18n.ts`). Если ключа нет — вернёт сам ключ.
- Выбор языка сохраняется в `localStorage` (`anver-lang`); по умолчанию — язык браузера (ro/mo → румынский, иначе русский).
- Переключатель **RU / RO** — в шапке (Header) и мобильном меню.

### Как добавить перевод
1. В `lib/i18n.ts` добавь ключ в **оба** словаря (`ru` — русский, `ro` — румынский) с одинаковой структурой.
2. В компоненте: `const { t } = useLang();` … `{t("group.key")}`.
3. Компонент должен быть **client-компонентом** (`"use client"`). Если страница server-компонент с `metadata` — вынеси переводимый контент в отдельный client-компонент (пример: `app/page.tsx` → `components/HomePage.tsx`).

### Перевод товаров
- `lib/product-ro.ts`: `productRo[uid] = { title?, text?, descr? }` — румынские названия/описания по uid товара; `productMarkRo` — бейджи скидок; `optionTitleRo` — названия опций («Цвет» → «Culoare»).
- Используется в `ProductCard`, `ProductModal`, `CartDrawer` при `lang === "ro"` (fallback на русский оригинал).

### Правила перевода
- **Не переводить**: имена (Максим, Вера), бренды (Anver, Sateen, Ranforce, FanCourier, WhatsApp, Telegram, Viber), телефоны, адрес (mun. Ceadîr-Lunga, str. Cecanov 4B), юридические (IDNO, © 2025 SRL "Anver-Textil"), названия цветов (англ.), единицы (см).
- Опечатки оригинала (например `anvertextil@gmai.com`) сохраняются дословно (помечены комментариями в коде).

---

## 6. Страницы

| URL | Назначение | Источник в `../site/` |
|---|---|---|
| `/` | Главная: полоса скидок + рейтинг + hero + преимущества + 3 каталога + «о нас» + контакты | index.html |
| `/ranforce` | Бельё из Ранфорса (storepart 387894771902) | ranforce.html |
| `/sateen` | Сатин (storepart 377460312512), крошка «Сатин Премиум», рейтинг | sateen.html |
| `/sateen-stripe` | Сатин Страйп (storepart 330859305352) | sateen-stripe.html |
| `/sets` | Комплекты (category «Комплект») | sets.html |
| `/bundles` | Наборы (category «Комплект») | bundles.html |
| `/sheets` | Простыни (category «Простынь») | sheets.html |
| `/pillowcases` | Наволочки (category «Наволочки») | pillowcases.html |
| `/contacts` | Контакты: политика возврата, оплата/доставка, консультация, форма | contacts.html |
| `/feedback` | Обратная связь (форма) | feedback.html |
| `/success` | Страница «Спасибо, заказ принят» | success.html |

### Панель категорий (t978)
Каталог-страницы содержат панель: «Категории» (Комплекты, Наборы, Пододеяльники и покрывала, Простыни, Наволочки) и «Ткани» (Sateen Premium, Sateen Stripes, 100% Хлопок Ранфорс). Ссылки — из оригинала.

✅ **Решено (2026-08)**: битые ссылки убраны/замаплены — `/sateen-premium → /sateen`, `/sateen-stripes → /sateen-stripe`, `/pure-cotton-ranforce → /ranforce`; `/sateen-luxe` убрана (товаров нет в выгрузке); **`/duvet-covers` создана** (3 товара категории «Пододеяльник», страница `app/duvet-covers/page.tsx`).

---

## 7. Контакты и данные (lib/site.ts)

- Телефон: +37379476327 / +373 794 76 327 (tel:)
- Email: anvertextil@gmail.com
- Адрес: mun. Ceadîr-Lunga, str. Cecanov 4B
- График: «Отвечаем каждый день с 12:00 до 20:00»
- Менеджер: Вера
- Мессенджеры: WhatsApp, Telegram, Viber
- Instagram: @anver.moldova
- Реквизиты: © 2025 SRL "Anver-Textil", IDNO: 1018611000619

---

## 8. Акции и промо

- `TopBanner`: «ОСЕННИЕ СКИДКИ | СКИДКИ До 20%» + таймер обратного отсчёта.
  Дедлайн таймера — `const DEADLINE` в `components/TopBanner.tsx` (сейчас 2025-11-08, **уже прошёл** → полоса скрывается автоматически).
  Чтобы запустить новую акцию — обнови дату и текст (текст: `PROMO` в `lib/site.ts`, но лучше перевести в `lib/i18n.ts`).
- В hero-блоке главной текст «Комплекты с выгодой 20%…» (ключ `home.heroDescr`) — тоже про акцию, при необходимости обновить.

---

## 9. Что сделано / что осталось

### Сделано
- [x] Точная копия структуры и дизайна оригинального Tilda-сайта (все 11 страниц)
- [x] Дизайн приведён к оригиналу по палитре, шрифтам, отступам (значения из `site/*.html`)
- [x] Полная мультиязычность RU/RO (UI + товары + контакты + формы + success)
- [x] Переключатель языка в шапке и мобильном меню
- [x] Полоса скидок скрывается по окончании акции
- [x] Надпись «С 1 ПО 8 НОЯБРЯ» убрана из hero
- [x] Шрифт: Nunito (тёплый, округлый; кириллица + латиница + румынские диакритики)
- [x] Корзина (выдвижная), быстрый просмотр товара, плавающие кнопки

### Сделано позже (итерация 1, 2026-08)
- [x] Битые ссылки панели категорий: замаплены на существующие страницы, `/sateen-luxe` убрана, **создана `/duvet-covers`** (см. §6)
- [x] Разный футер: каталог-страницы показывают t977 каталога (`components/FooterCatalog.tsx`: «Все белье», «Наши ткани», «Для клиентов», тел. +373 794 76 327), главная — прежний футер; переводы в `i18n.ts` (ru+ro)
- [x] SEO-заголовки вынесены в словарь `seo` (`lib/i18n.ts`); страницы переведены на `generateMetadata`; title — из русского словаря (базовый язык)
- [x] Форма контактов: «Send / Phone / Username or phone number» → «Отправить / Телефон / Номер телефона или username»

### Сделано позже (итерация 2, 2026-08)
- [x] Supabase для заказов/обратной связи: `lib/supabase.ts` (клиент, ленивая инициализация), `app/api/order` и `app/api/feedback` (валидация, 503 без ключей), `supabase/schema.sql` (таблицы orders/feedback + RLS), `.env.example`
- [x] Фронт: корзина (`CartDrawer`) — поля «Имя/Контакт» + валидация + отправка POST /api/order, редирект на /success?id=…; формы контактов и feedback — POST /api/feedback; `/success` показывает номер заказа из URL
- [x] Пакет `@supabase/supabase-js@2.112.3` установлен

### Подключение вживую (2026-08, проверено)
- [x] Ключи в `anver-react/.env` (НЕ коммитится): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon JWT из Dashboard)
- [x] Схема `supabase/schema.sql` применена в SQL Editor (таблицы orders/feedback + RLS + политики anon_insert_*)
- [x] POST /api/order и /api/feedback пишут в БД (проверено: ok:true + id)
- [x] RLS работает: аноним может только INSERT; SELECT/DELETE закрыты (проверено)
- ⚠️ Технический нюанс: id заказа генерируется на сервере (`crypto.randomUUID()` в route) — insert без `.select()`, т.к. `return=representation` потребовал бы SELECT-политики RLS, а чтение заказов анонимам закрыто намеренно
- 🧹 В таблицах остались тестовые строки (Direct, DirectAnon, Тест Интеграции и др.) — можно удалить в Table Editor

### Изображения → Supabase Storage (2026-08)
- [x] Все 249 изображений (товары, логотипы, иконки, hero) перенесены с tildacdn в бакет **`anver-images`** (public) проекта Supabase
- [x] URL заменены в коде: `https://static.tildacdn.one/` → `https://zlnwlaubmcmhbwqkchzq.supabase.co/storage/v1/object/public/anver-images/` (файлы: `lib/products.ts`, `lib/site.ts`, `components/*`, `app/page.tsx`)
- [x] Бакет + политики RLS — скрипт `_anver-images-staging/storage.sql` (вне git): public bucket, аноним может загружать/читать/обновлять только в `anver-images`
- [x] Проверено: публичный доступ 200, сборка зелёная
- [ ] Двуязычный SEO на двух языках требует **`/ro`-префикса** (словарь `seo` уже содержит оба языка; cookies() в generateMetadata ломает статику — на одном URL двуязычный title невозможен)
- [ ] `metadata.title` — при необходимости поднять RO-заголовки через /ro
- [ ] Сравнение с живым сайтом anver.md — **недоступен из рабочей сети** (DNS резолвится, соединение нет); браузер-инструмент тоже недоступен; эталон — выгрузка `../site/`

---

## 10. Памятка по правкам

- **Не редактировать**: `app/globals.css` переменные без необходимости; `app/layout.tsx` (провайдеры); структуру словарей `lib/i18n.ts` без добавления ключа в оба языка.
- Стили компонентов — инлайн `<style>` внутри компонента (паттерн проекта).
- После любых правок: `npx next build` — все 12 страниц должны собираться.
- Проверка перевода: переключить RO в шапке и пройтись по страницам.

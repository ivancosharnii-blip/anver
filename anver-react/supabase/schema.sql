-- ============================================================
-- Миграция Supabase: заказы и обратная связь
-- Проект: zlnwlaubmcmhbwqkchzq
-- Применение: Supabase Dashboard → SQL Editor (выполнить файл целиком)
-- ============================================================

-- ---------- Таблица заказов ----------
-- Заказ из корзины: контактные данные покупателя и состав заказа.
create table if not exists public.orders (
  id         uuid        primary key default gen_random_uuid(), -- идентификатор заказа
  created_at timestamptz not null default now(),               -- дата и время создания
  name       text        not null,                             -- имя покупателя
  contact    text        not null,                             -- телефон / ник в мессенджере
  method     text,                                             -- выбранный способ связи
  message    text,                                             -- комментарий к заказу
  total      numeric,                                          -- итоговая сумма
  currency   text        not null default 'MDL',               -- валюта (молдавский лей)
  lang       text        not null default 'ru',                -- язык интерфейса (ru/ro)
  items      jsonb       not null default '[]'::jsonb          -- состав заказа: [{uid,title,qty,price,options}]
);

-- ---------- Таблица обратной связи ----------
-- Сообщения из формы на странице /feedback.
create table if not exists public.feedback (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text        not null,                             -- имя отправителя
  contact    text        not null,                             -- телефон / ник в мессенджере
  message    text,                                             -- текст сообщения
  lang       text        not null default 'ru'                 -- язык интерфейса (ru/ro)
);

-- ---------- Row Level Security ----------
-- Включаем RLS: без политик доступ к таблицам закрыт даже для роли anon.
alter table public.orders   enable row level security;
alter table public.feedback enable row level security;

-- Заказ/отзыв отправляет анонимный посетитель сайта — разрешаем только
-- INSERT для роли anon. Чтение/изменение/удаление доступны владельцу БД
-- и сервисному ключу (SUPABASE_SERVICE_ROLE_KEY), который обходит RLS.
create policy "anon_insert_orders" on public.orders
  for insert to anon
  with check (true);

create policy "anon_insert_feedback" on public.feedback
  for insert to anon
  with check (true);

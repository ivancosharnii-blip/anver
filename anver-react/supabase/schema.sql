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

-- ============================================================
-- Админ-панель: товары каталога + Storage (бакет anver-images)
-- Применение: Supabase Dashboard → SQL Editor (выполнить файл целиком)
-- ============================================================

-- ---------- Таблица товаров каталога ----------
-- Витрина читает каталог отсюда; админка /admin создаёт/правит/удаляет.
create table if not exists public.products (
  id         serial primary key,
  uid        bigint not null unique,             -- идентификатор товара (в т.ч. из выгрузки Tilda)
  title      text not null,
  price      numeric not null,                   -- текущая цена, MDL
  priceold   numeric,                            -- старая цена (для скидки), nullable
  mark       text not null default '',           -- бейдж, например «Выгода 10%»
  text       text not null default '',           -- описание (HTML)
  descr      text not null default '',           -- краткое описание (HTML)
  gallery    jsonb not null default '[]'::jsonb, -- массив URL фото
  category   text not null default '',           -- «Комплект»/«Пододеяльник»/«Простынь»/«Наволочки»
  fabric     text not null default '',           -- sateen / ranforce / sateen-stripe / ...
  storepart  bigint not null default 387894771902,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Витрина: аноним читает каталог.
create policy "anon_read_products" on public.products
  for select to anon using (true);

-- Админка: MVP работает на anon-ключе (см. lib/catalog.ts), поэтому анониму
-- разрешён полный CRUD над products. Защита — пароль ADMIN_PASSWORD на уровне
-- приложения (middleware + роуты /api/admin/*).
-- РЕКОМЕНДАЦИЯ: завести SUPABASE_SERVICE_ROLE_KEY в .env и ходить из админ-роутов
-- под service_role, тогда эти три политики на запись можно удалить.
create policy "admin_insert_products" on public.products
  for insert to anon with check (true);

create policy "admin_update_products" on public.products
  for update to anon using (true);

create policy "admin_delete_products" on public.products
  for delete to anon using (true);

-- ---------- Storage: бакет anver-images ----------
-- Существующие фото уже лежат в этом бакете и раздаются публично.
insert into storage.buckets (id, name, public)
values ('anver-images', 'anver-images', true)
on conflict (id) do nothing;

-- Публичное чтение объектов бакета.
drop policy if exists "public_read_images" on storage.objects;
create policy "public_read_images" on storage.objects
  for select to anon using (bucket_id = 'anver-images');

-- Загрузка и удаление фото админкой (через anon-ключ, защита — пароль админки).
drop policy if exists "admin_upload_images" on storage.objects;
create policy "admin_upload_images" on storage.objects
  for insert to anon with check (bucket_id = 'anver-images');

drop policy if exists "admin_delete_images" on storage.objects;
create policy "admin_delete_images" on storage.objects
  for delete to anon using (bucket_id = 'anver-images');

-- ============================================================
-- Миграция Supabase: отзывы (reviews)
-- Проект: zlnwlaubmcmhbwqkchzq
-- Применение: Supabase Dashboard → SQL Editor (выполнить файл целиком)
-- ============================================================

-- ---------- Таблица отзывов ----------
-- Отзыв от посетителя сайта: имя, текст, рейтинг, опциональное фото, привязка к товару, город.
create table if not exists public.reviews (
  id         uuid        primary key default gen_random_uuid(), -- идентификатор отзыва
  created_at timestamptz not null default now(),               -- дата и время создания
  name       text        not null,                             -- имя автора
  text       text        not null,                             -- текст отзыва
  rating     integer     not null check (rating >= 1 and rating <= 5), -- оценка от 1 до 5
  photo_url  text,                                             -- ссылка на фото (опционально)
  product_uid text,                                            -- uid товара (опционально)
  city       text,                                             -- город автора (опционально)
  moderated  boolean     not null default false                -- прошёл модерацию
);

-- ---------- Row Level Security ----------
-- Аноним может вставлять отзывы, но читать — только модерированные.
alter table public.reviews enable row level security;

create policy "anon_insert_reviews" on public.reviews
  for insert to anon
  with check (true);

create policy "anon_select_moderated_reviews" on public.reviews
  for select to anon
  using (moderated = true);
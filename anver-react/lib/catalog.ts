/**
 * lib/catalog.ts — серверный слой данных каталога (Supabase).
 *
 * Товары по умолчанию захардкожены в lib/products.ts (выгрузка с Tilda).
 * Админка (/admin) работает с таблицей public.products в Supabase:
 *   - витрина читает каталог отсюда (с фолбэком на хардкод, если БД не готова);
 *   - админка создаёт/правит/удаляет товары и фото.
 *
 * Используется только anon-ключ (см. .env). Для MVP RLS разрешает анониму
 * полный CRUD над products (политики в supabase/schema.sql), защита админки —
 * пароль ADMIN_PASSWORD на уровне приложения. РЕКОМЕНДАЦИЯ: завести
 * SUPABASE_SERVICE_ROLE_KEY и в админ-роутах ходить под ним, тогда RLS-политики
 * на запись анониму можно снять.
 */
import { products as hardcodedProducts, type Product, type ProductOption } from "@/lib/products";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const STORAGE_BUCKET = "anver-images";

/** Базовые заголовки для запросов к Supabase (REST + Storage). */
export function supabaseHeaders(extra?: Record<string, string>) {
  return {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/** fetch к API Supabase с заголовками авторизации. */
export async function supabaseFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { ...supabaseHeaders(), ...(init?.headers ?? {}) },
  });
}

/** Строка таблицы public.products. */
export type CatalogRow = {
  id: number;
  uid: number;
  title: string;
  price: number;
  priceold: number | null;
  mark: string;
  text: string;
  descr: string;
  gallery: string[];
  json_options?: ProductOption[];
  category: string;
  fabric: string;
  storepart: number;
  created_at: string;
};

/** Маппинг строки БД в Product (формат витрины). */
export function rowToProduct(r: CatalogRow): Product {
  return {
    uid: Number(r.uid),
    title: r.title,
    url: `https://anver.md/tproduct/${r.uid}`,
    price: Number(r.price),
    priceold: r.priceold != null ? Number(r.priceold) : null,
    mark: r.mark ?? "",
    text: r.text ?? "",
    descr: r.descr ?? "",
    gallery: Array.isArray(r.gallery) ? r.gallery : [],
    json_options: Array.isArray(r.json_options) ? r.json_options : [],
    partuids: [],
    storepart: Number(r.storepart),
    fabric: r.fabric ?? "",
    category: r.category ?? "",
  };
}

/**
 * Все товары из БД. Возвращает null, если таблицы нет / она пуста / ошибка —
 * тогда витрина использует захардкоженный каталог (фолбэк).
 */
export async function fetchProductsFromDb(): Promise<Product[] | null> {
  try {
    const res = await supabaseFetch("/rest/v1/products?select=*&order=id");
    if (!res.ok) return null;
    const rows = (await res.json()) as CatalogRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map(rowToProduct);
  } catch {
    return null;
  }
}

/** Каталог для витрины: БД, а если не готова — хардкод. */
export async function getCatalog(): Promise<Product[]> {
  const fromDb = await fetchProductsFromDb();
  return fromDb ?? hardcodedProducts;
}

/**
 * Удаляет файл из storage, если URL указывает на наш бакет (best-effort,
 * ошибки игнорируем — главное убрать ссылку из галереи).
 */
export async function deleteStorageFile(url: string): Promise<void> {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!url.startsWith(prefix)) return;
  const key = url.slice(prefix.length);
  try {
    await supabaseFetch(`/storage/v1/object/${STORAGE_BUCKET}/${key}`, {
      method: "DELETE",
    });
  } catch {
    // ignore
  }
}

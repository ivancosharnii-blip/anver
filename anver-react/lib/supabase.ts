/**
 * Клиент Supabase для серверного кода (route handlers).
 *
 * Пакет @supabase/supabase-js пока НЕ установлен, поэтому импорт сделан
 * динамическим. После установки (`npm i @supabase/supabase-js`) код заработает
 * без изменений.
 *
 * URL и anon-ключ читаются из env:
 *   NEXT_PUBLIC_SUPABASE_URL       — https://zlnwlaubmcmhbwqkchzq.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  — публичный anon-ключ проекта
 *
 * Если ключей нет в env — клиент не создаётся, getSupabaseClient() возвращает
 * null, и сайт продолжает работать без БД (route handlers отвечают 503).
 * Импорт модуля безопасен на сервере: никаких побочных эффектов на верхнем
 * уровне, только ленивая инициализация при первом вызове.
 */

/** Упрощённый результат запроса к Supabase (до установки пакета с типами). */
export type SupabaseResult<T = unknown> = {
  data: T | null;
  error: { message: string; code?: string; details?: string } | null;
};

/**
 * Минимальный интерфейс клиента — покрывает только используемые методы
 * (insert → select → single). Полные типы появятся после установки пакета.
 */
export interface SupabaseClientLike {
  from(table: string): {
    insert(values: Record<string, unknown>): {
      select(columns?: string): {
        single(): Promise<SupabaseResult>;
      };
    };
  };
}

/** Кэш созданного клиента: undefined — ещё не инициализирован. */
let cachedClient: SupabaseClientLike | null | undefined;

/** Проверяет, заданы ли ключи Supabase в env. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Возвращает клиент Supabase или null, если ключи не заданы или пакет
 * не установлен. Клиент создаётся лениво и кэшируется на время жизни процесса.
 */
export async function getSupabaseClient(): Promise<SupabaseClientLike | null> {
  if (!isSupabaseConfigured()) {
    // Ключей нет в env — сайт работает и без БД (503 в route handlers).
    return null;
  }
  if (cachedClient !== undefined) {
    return cachedClient;
  }
  try {
    // TODO: после `npm i @supabase/supabase-js` убрать @ts-ignore.
    // @ts-ignore — пакет @supabase/supabase-js ещё не установлен
    const { createClient } = await import("@supabase/supabase-js");
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      // as unknown as — реальные типы SupabaseClient не перекрываются с
      // упрощённым SupabaseClientLike (single() возвращает PostgrestBuilder,
      // а не Promise). Чисто типовая правка, на рантайм не влияет.
    ) as unknown as SupabaseClientLike;
  } catch (err) {
    // Например: пакет не установлен или ключи невалидны.
    console.error("[supabase] не удалось создать клиент:", err);
    cachedClient = null;
  }
  return cachedClient;
}

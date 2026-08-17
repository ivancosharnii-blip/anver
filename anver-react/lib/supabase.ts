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
 * Цепочка запроса SELECT с фильтрацией, сортировкой и ограничением.
 */
export interface SupabaseQueryChain<T = unknown> {
  eq(column: string, value: unknown): SupabaseQueryChain<T>;
  order(column: string, opts?: { ascending?: boolean }): SupabaseQueryChain<T>;
  limit(count: number): SupabaseQueryChain<T>;
  then<TResult = SupabaseResult<T[]>>(
    onfulfilled?: ((value: SupabaseResult<T[]>) => TResult) | null,
    onrejected?: ((reason: unknown) => TResult) | null,
  ): Promise<TResult>;
}

/**
 * Минимальный интерфейс клиента — покрывает используемые методы.
 * Полные типы появятся после установки пакета @supabase/supabase-js.
 */
export interface SupabaseClientLike {
  from(table: string): {
    /**
     * INSERT без select: return=minimal — не требует SELECT-политики RLS.
     */
    insert(values: Record<string, unknown>): Promise<SupabaseResult>;
    /**
     * SELECT с цепочкой фильтров.
     */
    select(columns?: string): SupabaseQueryChain;
    /**
     * UPDATE строк, удовлетворяющих условию (через eq).
     */
    update(values: Record<string, unknown>): {
      eq(column: string, value: unknown): Promise<SupabaseResult>;
    };
    /**
     * DELETE строк, удовлетворяющих условию (через eq).
     */
    delete(): {
      eq(column: string, value: unknown): Promise<SupabaseResult>;
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
    // Пакет @supabase/supabase-js установлен (npm i @supabase/supabase-js).
    // Каст на упрощённый SupabaseClientLike: реальные типы PostgrestBuilder
    // не перекрываются с минимальным интерфейсом — чисто типовая правка,
    // на рантайм не влияет.
    const { createClient } = await import("@supabase/supabase-js");
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    ) as unknown as SupabaseClientLike;
  } catch (err) {
    // Например: пакет не установлен или ключи невалидны.
    console.error("[supabase] не удалось создать клиент:", err);
    cachedClient = null;
  }
  return cachedClient;
}

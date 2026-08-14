/**
 * Отправка JSON на /api/* с таймаутом. Никогда не бросает исключение:
 * любой сбой (сеть недоступна, таймаут, 4xx/5xx) возвращает { ok: false }.
 * Нужно, чтобы UI не блокировал пользователя, если бэкенд не отвечает
 * (например, Supabase не сконфигурирован → 503).
 */
export async function postJson(
  url: string,
  payload: unknown,
  timeoutMs = 6000,
): Promise<{ ok: boolean; data: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as unknown;
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: null };
  } finally {
    clearTimeout(timer);
  }
}

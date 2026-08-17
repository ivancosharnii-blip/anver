import { getSupabaseClient } from "@/lib/supabase";
import {
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export const runtime = "nodejs";

/** Тело POST /api/feedback. */
type FeedbackPayload = {
  name?: unknown;
  contact?: unknown;
  message?: unknown;
  lang?: unknown;
};

/** Обрезает и проверяет строку; возвращает null, если значение не строка или пустое. */
function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/**
 * POST /api/feedback — сообщение из формы обратной связи.
 * Тело: { name, contact, message?, lang? }
 * Ответ: { ok: true, id } или { ok: false, error }.
 * Если Supabase не сконфигурирован (нет ключей в env) — 503: сайт работает и без БД.
 */
export async function POST(request: Request) {
  let body: FeedbackPayload;
  try {
    body = (await request.json()) as FeedbackPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = cleanString(body.name, 200);
  const contact = cleanString(body.contact, 200);
  const message = cleanString(body.message, 5000);
  const lang = cleanString(body.lang, 10) ?? "ru";

  // Обязательные поля: имя и контакт.
  if (!name || !contact) {
    return Response.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    // Ключей Supabase нет — БД недоступна, но сайт продолжает работать.
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    // id генерируем сами (crypto.randomUUID) и вставляем без .select():
    // `return=representation` потребовал бы SELECT-политики RLS, которой нет
    // (чтение сообщений анонимам закрыто — только INSERT).
    const id = crypto.randomUUID();
    const { error } = await supabase.from("feedback").insert({
      id,
      name,
      contact,
      message: message ?? null,
      lang,
    });

    if (error) {
      console.error("[api/feedback] ошибка записи в feedback:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    // Уведомление в Telegram о новом сообщении обратной связи
    if (isTelegramConfigured()) {
      const tgMessage = [
        `✉️ <b>Обратная связь</b>`,
        `👤 <b>Имя:</b> ${escapeHtml(name)}`,
        `📞 <b>Контакт:</b> ${escapeHtml(contact)}`,
        message ? `📝 <b>Сообщение:</b> ${escapeHtml(message.length > 300 ? message.slice(0, 300) + "…" : message)}` : null,
        `🌐 Язык: ${lang}`,
      ]
        .filter(Boolean)
        .join("\n");

      const tgResult = await sendTelegramMessage(tgMessage);
      if (!tgResult.ok) {
        console.error(
          "[api/feedback] сообщение #" + id + " сохранено, но уведомление в Telegram не ушло:",
          tgResult.error,
        );
      }
    }

    return Response.json({ ok: true, id });
  } catch (err) {
    console.error("[api/feedback] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }

/** Экранирует спецсимволы HTML для Telegram. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
}

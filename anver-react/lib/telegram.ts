/**
 * Отправка уведомлений в Telegram (бот → группа/чат).
 *
 * Настройки в env (anver-react/.env):
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather (вид 123456:ABC-DEF...)
 *   TELEGRAM_CHAT_ID   — id чата/группы (для группы/супергруппы — начинается с -100…)
 *
 * Если ключей нет в env — isTelegramConfigured() === false и
 * sendTelegramMessage() возвращает { ok: false } без исключений:
 * сайт продолжает работать без Telegram.
 */

/** Заданы ли токен бота и chat_id в env. */
export function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );
}

/** Экранирует спецсимволы HTML для parse_mode=HTML (безопасно для & < >). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Обрезает длинный текст и добавляет многоточие. */
function truncate(value: string, maxLength: number): string {
  return value.length > maxLength
    ? value.slice(0, maxLength - 1).trimEnd() + "…"
    : value;
}

/**
 * Отправляет текстовое сообщение в настроенный чат через Bot API.
 * Не бросает исключений: любая ошибка логируется и возвращается { ok: false }.
 */
export async function sendTelegramMessage(
  text: string,
  timeoutMs = 8000,
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "telegram_not_configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      },
    );
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
    } | null;
    if (!res.ok) {
      console.error(
        "[telegram] ошибка отправки:",
        res.status,
        data?.description ?? data,
      );
      return { ok: false, error: `tg_http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[telegram] ошибка отправки:", err);
    return { ok: false, error: "tg_error" };
  } finally {
    clearTimeout(timer);
  }
}

/** Одна позиция заказа для сообщения. */
export type TelegramOrderItem = {
  title: string;
  qty: number;
  price: number;
  options?: unknown;
};

/** Параметры заказа для форматирования уведомления. */
export type TelegramOrderPayload = {
  id: string;
  name: string;
  contact: string;
  method?: string | null;
  message?: string | null;
  items: TelegramOrderItem[];
  total: number;
  currency?: string;
  lang?: string;
};

/** Человекочитаемые названия известных ключей опций (остальные — как есть). */
const OPTION_LABELS: Record<string, string> = {
  color: "Цвет",
  size: "Размер",
  fabric: "Ткань",
};

/** Человекочитаемая строка опций товара: { color: "Синий" } → «Цвет: Синий». */
function formatOptions(options: unknown): string {
  if (typeof options !== "object" || options === null) return "";
  const entries = Object.entries(options as Record<string, unknown>).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return (
    " (" +
    entries
      .map(([k, v]) => `${OPTION_LABELS[k] ?? k}: ${String(v)}`)
      .join(", ") +
    ")"
  );
}

/**
 * Формирует текст уведомления о новом заказе (HTML для parse_mode=HTML).
 */
export function formatOrderMessage(order: TelegramOrderPayload): string {
  const currency = order.currency ?? "MDL";
  const lang = order.lang === "ro" ? "RO" : "RU";
  const method = order.method?.trim() ? order.method.trim() : null;
  const message = order.message?.trim() ? order.message.trim() : null;

  const lines: string[] = [];
  lines.push(`🛒 <b>Новый заказ</b> #${escapeHtml(order.id.slice(0, 8))}`);
  lines.push(`🌐 Язык: ${lang}`);
  lines.push("");
  lines.push(`👤 <b>Имя:</b> ${escapeHtml(truncate(order.name, 100))}`);
  lines.push(`📞 <b>Контакт:</b> ${escapeHtml(truncate(order.contact, 100))}`);
  if (method) lines.push(`💳 <b>Оплата:</b> ${escapeHtml(truncate(method, 50))}`);
  if (message) {
    lines.push(`📝 <b>Комментарий:</b> ${escapeHtml(truncate(message, 500))}`);
  }
  lines.push("");
  lines.push("<b>Состав:</b>");
  order.items.forEach((item, index) => {
    const opts = formatOptions(item.options);
    const title = escapeHtml(truncate(item.title, 120)) + opts;
    lines.push(`${index + 1}. ${title} ×${item.qty} — ${item.price * item.qty} ${currency}`);
  });
  lines.push("");
  lines.push(`💰 <b>Итого:</b> ${order.total} ${currency}`);

  return lines.join("\n");
}

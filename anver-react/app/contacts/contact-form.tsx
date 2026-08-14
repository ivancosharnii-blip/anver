"use client";

import { useState } from "react";
import { PhoneIcon, TelegramIcon, WhatsAppIcon, ViberIcon } from "./icons";
import { useLang } from "@/context/LanguageContext";

// Форма из оригинального блока t718 (rec1409480781 в site/contacts.html).
// Поля и тексты дословно из оригинала: «Удобный способ связи» (выбор
// мессенджера + поле ввода), «Как вас зовут?», textarea
// «Напишите нам! Читаем каждое сообщение и быстро отвечаем!», кнопка «Send».
const methods = [
  { key: "phone", labelKey: "form.methodPhone" as const, icon: <PhoneIcon size={18} /> },
  { key: "telegram", labelKey: "form.methodTelegram" as const, icon: <TelegramIcon size={18} /> },
  { key: "whatsapp", labelKey: "form.methodWhatsapp" as const, icon: <WhatsAppIcon size={18} /> },
  { key: "viber", labelKey: "form.methodViber" as const, icon: <ViberIcon size={18} /> },
] as const;

export default function ContactForm() {
  const { t } = useLang();
  const [method, setMethod] = useState<string>("phone");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "#f2f2f2",
    borderRadius: 8,
    border: "none",
    color: "#242424",
    fontSize: 16,
    fontFamily: "var(--font)",
  };

  return (
    <form action="/success" method="GET" style={{ display: "grid", gap: 16 }}>
      <div>
        <div
          style={{
            color: "#242424",
            fontSize: 16,
            lineHeight: 1.55,
            marginBottom: 8,
          }}
        >
          {t("form.contactMethod")}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {methods.map((m) => {
            const active = method === m.key;
            return (
              <button
                key={m.key}
                type="button"
                aria-pressed={active}
                onClick={() => setMethod(m.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: active ? "rgba(92,116,148,0.10)" : "#ffffff",
                  border: active ? "1px solid rgba(92,116,148,0.40)" : "1px solid #dedede",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#242424",
                  fontFamily: "var(--font)",
                }}
              >
                {m.icon}
                {t(m.labelKey)}
              </button>
            );
          })}
        </div>
        <input
          type={method === "phone" || method === "whatsapp" || method === "viber" ? "tel" : "text"}
          name="contact"
          autoComplete="tel"
          placeholder={method === "telegram" ? t("form.contactPlaceholder") : ""}
          aria-label={t("form.contactAria")}
          style={inputStyle}
        />
      </div>

      <div>
        <input
          type="text"
          name="Name"
          autoComplete="name"
          placeholder={t("form.namePlaceholder")}
          aria-label={t("form.nameAria")}
          style={inputStyle}
        />
      </div>

      <div>
        <textarea
          name="Textarea"
          rows={3}
          placeholder={t("form.messagePlaceholder")}
          aria-label={t("form.messageAria")}
          style={{ ...inputStyle, height: 102, resize: "vertical" }}
        />
      </div>

      <div>
        <button
          type="submit"
          style={{
            color: "#ffffff",
            background: "#5c7494",
            borderRadius: 8,
            border: "none",
            fontFamily: "var(--font)",
            fontWeight: 500,
            fontSize: 16,
            padding: "12px 40px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3a4f6a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#5c7494")}
        >
          {t("form.send")}
        </button>
      </div>
    </form>
  );
}

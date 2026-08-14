"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { postJson } from "@/lib/post-json";

// Форма обратной связи перенесена из site/feedback.html (Tilda Zero form,
// rec1481375721). Поля и тексты дословно из оригинала:
//   1) слайдер «Какова вероятность что вы посоветуете нас вашим знакомым? (от 1 до 10)»
//   2) поле ввода (в оригинале — поле без подписи, 1 строка)
//   3) чекбоксы «Что бы нам следовало улучшить?» + вариант «Другое»
//   4) textarea «Поделитесь вашим опытом, мы читаем каждое сообщение!»
//   5) кнопка «Отправить»
// Стили формы из оригинала: поля #ffffff, рамка #dedede, радиус 8px, высота 50px,
// заголовки полей #808080, кнопка #3a4f6a (200×48px).

const improvementOptionKeys = [
  "feedback.optAllGood",
  "feedback.optMaterials",
  "feedback.optSpeed",
  "feedback.optCommunication",
  "feedback.optPackaging",
  "feedback.optDeliverySpeed",
  "feedback.optDeliveryQuality",
  "feedback.optSite",
] as const;

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: 50,
  padding: "0 16px",
  background: "#ffffff",
  border: "1px solid #dedede",
  borderRadius: 8,
  color: "#242424",
  fontSize: 16,
  fontWeight: 400,
  fontFamily: "var(--font)",
  boxSizing: "border-box",
};

export default function FeedbackForm() {
  const { t } = useLang();
  const router = useRouter();
  const [score, setScore] = useState<number>(5);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const fd = new FormData(e.currentTarget);
    // Контракт /api/feedback: { name, contact, message } — бэкенд требует
    // и имя, и контакт (иначе 400), поэтому у формы есть поле контакта.
    const payload = {
      name: String(fd.get("name") ?? ""),
      contact: String(fd.get("contact") ?? ""),
      message: String(fd.get("Textarea") ?? ""),
    };

    setSending(true);
    // Отправляем в бэкенд (503 / сбой сети / таймаут не блокируют переход).
    await postJson("/api/feedback", payload);
    // Как раньше: все поля формы (name, contact, recommend, improve…) уходят в URL /success.
    const params = new URLSearchParams();
    fd.forEach((value, key) => {
      const v = String(value);
      if (v !== "") params.append(key, v);
    });
    router.push(`/success?${params.toString()}`);
  };

  const toggle = (option: string) => {
    const next = new Set(checked);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    setChecked(next);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 20 }}>
      {/* 1. Слайдер оценки (рекомендация от 1 до 10) */}
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#808080",
            fontFamily: "var(--font)",
            marginBottom: 5,
          }}
        >
          {t("feedback.scoreQuestion")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            name="recommend"
            aria-label={t("feedback.scoreAria")}
            style={{ flex: 1, accentColor: "#3a4f6a", height: 4 }}
          />
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#ffffff",
              border: "1px solid #dedede",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 400,
              color: "#242424",
              flexShrink: 0,
            }}
          >
            {score}
          </span>
        </div>
      </div>

      {/* 2. Поле ввода (в оригинале — без подписи, 1 строка) */}
      <div>
        <input
          type="text"
          name="name"
          autoComplete="name"
          aria-label={t("feedback.nameAria")}
          style={fieldStyle}
        />
      </div>

      {/* 2а. Контакт для ответа — бэкенд /api/feedback требует поле contact */}
      <div>
        <input
          type="text"
          name="contact"
          autoComplete="tel"
          placeholder={t("feedback.contactPlaceholder")}
          aria-label={t("feedback.contactAria")}
          style={fieldStyle}
        />
      </div>

      {/* 3. Чекбоксы «Что бы нам следовало улучшить?» */}
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#808080",
            fontFamily: "var(--font)",
            marginBottom: 5,
          }}
        >
          {t("feedback.improveQuestion")}
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {improvementOptionKeys.map((key) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                fontWeight: 400,
                color: "#242424",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="improve"
                value={t(key)}
                checked={checked.has(key)}
                onChange={() => toggle(key)}
                style={{ width: 18, height: 18, accentColor: "#3a4f6a", flexShrink: 0 }}
              />
              {t(key)}
            </label>
          ))}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 400,
              color: "#242424",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="improve"
              value={t("feedback.other")}
              checked={otherChecked}
              onChange={() => setOtherChecked(!otherChecked)}
              style={{ width: 18, height: 18, accentColor: "#3a4f6a", flexShrink: 0 }}
            />
            {t("feedback.other")}
          </label>
          {otherChecked && (
            <input
              type="text"
              name="improve-other"
              placeholder={t("feedback.other")}
              aria-label={t("feedback.other")}
              style={fieldStyle}
            />
          )}
        </div>
      </div>

      {/* 4. Текст отзыва */}
      <div>
        <textarea
          name="Textarea"
          rows={3}
          placeholder={t("feedback.messagePlaceholder")}
          aria-label={t("feedback.messageAria")}
          style={{ ...fieldStyle, height: 96, padding: "12px 16px", resize: "vertical" }}
        />
      </div>

      {/* 5. Кнопка «Отправить» */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          type="submit"
          disabled={sending}
          style={{
            color: "#ffffff",
            background: "#3a4f6a",
            borderRadius: 8,
            border: "none",
            width: 200,
            height: 48,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font)",
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.6 : 1,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2e3f55")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3a4f6a")}
        >
          {t("feedback.submit")}
        </button>
      </div>
    </form>
  );
}

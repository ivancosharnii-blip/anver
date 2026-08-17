"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { postJson } from "@/lib/post-json";

/** Структура отзыва из API. */
type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  photo_url: string | null;
  product_uid: string | null;
  city: string | null;
  moderated: boolean;
  created_at: string;
};

type FormState = {
  name: string;
  text: string;
  rating: number;
  city: string;
};

const EMPTY_FORM: FormState = { name: "", text: "", rating: 5, city: "" };

export default function ReviewsPageClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const reqId = useRef(0);

  const load = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = (await res.json()) as { reviews?: Review[] };
        if (reqId.current === id) setReviews(data.reviews ?? []);
      }
    } catch {
      // ignore
    } finally {
      if (reqId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Пожалуйста, укажите имя");
      return;
    }
    if (!form.text.trim()) {
      setFormError("Пожалуйста, напишите отзыв");
      return;
    }
    if (form.text.trim().length < 10) {
      setFormError("Текст отзыва должен содержать хотя бы 10 символов");
      return;
    }

    setSending(true);
    try {
      const result = await postJson("/api/reviews", {
        name: form.name.trim(),
        text: form.text.trim(),
        rating: form.rating,
        city: form.city.trim() || undefined,
      });
      if (result.ok) {
        setSent(true);
        setForm(EMPTY_FORM);
      } else {
        const data = result.data as { error?: string } | null;
        setFormError(data?.error ?? "Не удалось отправить отзыв. Попробуйте позже.");
      }
    } catch {
      setFormError("Сеть недоступна. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  const starsHtml = (rating: number): string => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div>
      <style>{`
        .rv-list { display: grid; gap: 20px; margin-bottom: 60px; }
        .rv-card {
          background: #fff; border-radius: 12px; padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .rv-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px; gap: 12px; flex-wrap: wrap;
        }
        .rv-name { font-weight: 700; font-size: 16px; color: #242424; }
        .rv-city { font-size: 14px; color: #888; }
        .rv-stars { font-size: 18px; color: #f5a623; letter-spacing: 2px; }
        .rv-date { font-size: 13px; color: #aaa; }
        .rv-text {
          font-size: 15px; line-height: 1.6; color: #333;
          white-space: pre-wrap;
        }
        .rv-empty {
          text-align: center; padding: 48px 16px; color: #888;
          font-size: 16px;
        }
        .rv-loading {
          text-align: center; padding: 48px 16px; color: #888;
        }

        .rv-form-wrap {
          background: #fff; border-radius: 12px; padding: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          max-width: 600px; margin: 0 auto;
        }
        .rv-form-title {
          font-size: 20px; font-weight: 700; color: #242424;
          text-align: center; margin-bottom: 24px;
        }
        .rv-field { margin-bottom: 18px; }
        .rv-label {
          display: block; font-size: 14px; font-weight: 600;
          color: #555; margin-bottom: 6px;
        }
        .rv-input {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px; border: 1px solid #dedede;
          border-radius: 8px; background: #fafafa;
          font-size: 15px; color: #242424;
          font-family: var(--font-nunito);
        }
        .rv-input:focus {
          outline: none; border-color: #3a4f6a;
          box-shadow: 0 0 0 2px rgba(58,79,106,0.12);
        }
        .rv-textarea {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px; border: 1px solid #dedede;
          border-radius: 8px; background: #fafafa;
          font-size: 15px; color: #242424; resize: vertical;
          min-height: 100px; font-family: var(--font-nunito);
        }
        .rv-textarea:focus {
          outline: none; border-color: #3a4f6a;
          box-shadow: 0 0 0 2px rgba(58,79,106,0.12);
        }
        .rv-stars-input {
          display: flex; gap: 4px; flex-direction: row-reverse;
          justify-content: flex-end;
        }
        .rv-star-btn {
          background: none; border: none; cursor: pointer;
          font-size: 28px; line-height: 1; padding: 0; color: #ddd;
          transition: color 0.15s;
        }
        .rv-star-btn.active,
        .rv-star-btn:hover,
        .rv-star-btn:hover ~ .rv-star-btn { color: #f5a623; }
        .rv-error { color: #c0392b; font-size: 14px; margin-bottom: 12px; text-align: center; }
        .rv-btn {
          width: 100%; padding: 14px; border-radius: 8px; border: none;
          background: #3a4f6a; color: #fff; font-size: 16px;
          font-weight: 600; cursor: pointer;
          font-family: var(--font-nunito);
          transition: background-color 0.2s;
        }
        .rv-btn:hover { background: #2e3f55; }
        .rv-btn:disabled { opacity: 0.6; cursor: default; }
        .rv-sent {
          text-align: center; padding: 32px; color: #555; font-size: 16px;
        }
        .rv-sent-icon { font-size: 48px; margin-bottom: 12px; }
      `}</style>

      {/* Список отзывов */}
      {loading ? (
        <div className="rv-loading">Загрузка отзывов…</div>
      ) : reviews.length === 0 ? (
        <div className="rv-empty">
          Пока нет отзывов. Будьте первым, кто поделится впечатлениями!
        </div>
      ) : (
        <div className="rv-list">
          {reviews.map((r) => (
            <div className="rv-card" key={r.id}>
              <div className="rv-card-header">
                <div>
                  <span className="rv-name">{r.name}</span>
                  {r.city && <span className="rv-city">, {r.city}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="rv-stars">{starsHtml(r.rating)}</span>
                  <span className="rv-date">
                    {new Date(r.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {r.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.photo_url}
                  alt="Фото отзыва"
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
              )}
              <div className="rv-text">{r.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Форма «Оставить отзыв» */}
      <div className="rv-form-wrap">
        {sent ? (
          <div className="rv-sent">
            <div className="rv-sent-icon" style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>
              Спасибо, ваш отзыв отправлен!
            </p>
            <p>Он появится на сайте после проверки модератором.</p>
            <button
              className="rv-btn"
              style={{ width: "auto", marginTop: 16, padding: "10px 24px" }}
              onClick={() => setSent(false)}
            >
              Написать ещё
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => void submitReview(e)}>
            <h3 className="rv-form-title">Оставить отзыв</h3>

            <div className="rv-field">
              <label className="rv-label" htmlFor="rv-name">
                Ваше имя
              </label>
              <input
                id="rv-name"
                className="rv-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Как вас зовут?"
                autoComplete="name"
              />
            </div>

            <div className="rv-field">
              <label className="rv-label" htmlFor="rv-city">
                Город
              </label>
              <input
                id="rv-city"
                className="rv-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Например: Кишинёв"
              />
            </div>

            <div className="rv-field">
              <label className="rv-label">Оценка</label>
              <div className="rv-stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={"rv-star-btn" + (star <= form.rating ? " active" : "")}
                    onClick={() => setForm({ ...form, rating: star })}
                    aria-label={`Оценка ${star} из 5`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="rv-field">
              <label className="rv-label" htmlFor="rv-text">
                Ваш отзыв
              </label>
              <textarea
                id="rv-text"
                className="rv-textarea"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Поделитесь впечатлениями о нашем постельном белье..."
              />
            </div>

            {formError && <div className="rv-error">{formError}</div>}

            <button className="rv-btn" type="submit" disabled={sending}>
              {sending ? "Отправка…" : "Отправить отзыв"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
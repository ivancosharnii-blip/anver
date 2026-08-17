"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

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

type ReviewsBlockProps = {
  /** Если передан — показывает отзывы только для этого товара. Иначе — последние 3. */
  productUid?: string;
  /** Максимальное количество отзывов (по умолчанию 3, если без productUid, иначе 5). */
  limit?: number;
};

export default function ReviewsBlock({ productUid, limit }: ReviewsBlockProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const reqId = useRef(0);

  const maxReviews = limit ?? (productUid ? 5 : 3);

  const load = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const url = productUid
        ? `/api/reviews?product_uid=${encodeURIComponent(productUid)}`
        : "/api/reviews";
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { reviews?: Review[] };
        if (reqId.current === id) {
          setReviews((data.reviews ?? []).slice(0, maxReviews));
        }
      }
    } catch {
      // ignore
    } finally {
      if (reqId.current === id) setLoading(false);
    }
  }, [productUid, maxReviews]);

  useEffect(() => {
    void load();
  }, [load]);

  const starsHtml = (rating: number): string => "★".repeat(rating) + "☆".repeat(5 - rating);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0", color: "#888", fontSize: 14 }}>
        Загрузка отзывов…
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // Не показываем блок, если отзывов нет
  }

  return (
    <div>
      <style>{`
        .rvb-title {
          font-size: 22px; font-weight: 700; color: #242424;
          text-align: center; margin-bottom: 24px;
          font-family: var(--font-nunito);
        }
        .rvb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .rvb-card {
          background: #fff; border-radius: 10px; padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          display: flex; flex-direction: column; gap: 8px;
        }
        .rvb-card-header {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .rvb-name { font-weight: 700; font-size: 15px; color: #242424; }
        .rvb-city { font-size: 13px; color: #888; }
        .rvb-stars { font-size: 16px; color: #f5a623; letter-spacing: 1px; white-space: nowrap; }
        .rvb-text {
          font-size: 14px; line-height: 1.5; color: #444;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rvb-footer {
          display: flex; justify-content: center; gap: 20px;
          margin-top: 24px; flex-wrap: wrap;
        }
        .rvb-link {
          color: #3a4f6a; font-size: 15px; font-weight: 600;
          text-decoration: underline; text-underline-offset: 3px;
          font-family: var(--font-nunito);
        }
        .rvb-link:hover { color: #2e3f55; }
      `}</style>

      <h3 className="rvb-title">
        {productUid ? "Отзывы о товаре" : "Отзывы наших клиентов"}
      </h3>

      <div className="rvb-grid">
        {reviews.map((r) => (
          <div className="rvb-card" key={r.id}>
            <div className="rvb-card-header">
              <div>
                <span className="rvb-name">{r.name}</span>
                {r.city && <span className="rvb-city">, {r.city}</span>}
              </div>
              <span className="rvb-stars">{starsHtml(r.rating)}</span>
            </div>
            <div className="rvb-text">{r.text}</div>
          </div>
        ))}
      </div>

      <div className="rvb-footer">
        {!productUid && (
          <Link className="rvb-link" href="/reviews">
            Читать все отзывы
          </Link>
        )}
        <Link className="rvb-link" href="/reviews#">
          Оставить отзыв
        </Link>
      </div>
    </div>
  );
}
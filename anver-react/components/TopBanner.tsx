"use client";

import { useEffect, useState } from "react";

// Оригинал: rec1480778381 (Tilda t396).
// Полоса 36px, видимый фон #914128 (артборд #b15c2a перекрыт полноширинной фигурой #914128).
// Слева текст «ОСЕННИЕ СКИДКИ | СКИДКИ До 20%» (12px, uppercase, letter-spacing 2px, weight 500),
// справа — живой счётчик в «пилюле» (border #783621, radius 8, bg rgba(0,0,0,0.1), 14px/600).
// Счётчик подтверждён JS rec1480418391: дедлайн 2025-11-08 23:59:59, дни без паддинга,
// часы/минуты/секунды с ведущим нулём; при завершении — «0 0 0 0».

const DEADLINE = new Date("2025-11-08T23:59:59").getTime();

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

type Unit = { value: string; label: string };

function getUnits(remaining: number): Unit[] {
  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remaining % MINUTE_MS) / 1000);

  return [
    { value: String(days), label: "д" },
    { value: String(hours).padStart(2, "0"), label: "ч" },
    { value: String(minutes).padStart(2, "0"), label: "м" },
    { value: String(seconds).padStart(2, "0"), label: "с" },
  ];
}

export default function TopBanner() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, DEADLINE - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = getUnits(remaining);

  // Акция закончилась — полосу скидок не показываем вовсе (не "0 0 0 0", а скрываем).
  if (remaining <= 0) return null;

  return (
    <div className="anver-tb">
      <style>{`
        .anver-tb {
          background: #914128;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .anver-tb__row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .anver-tb__text {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
        }
        .anver-tb__timer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 2px 8px;
          border: 1px solid #783621;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.1);
        }
        .anver-tb__unit {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }
        @media (max-width: 639px) {
          .anver-tb__text {
            font-size: 10px;
          }
        }
        @media (max-width: 479px) {
          .anver-tb {
            height: 63px;
          }
          .anver-tb__row {
            flex-direction: column;
            gap: 4px;
          }
          .anver-tb__unit {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="anver-tb__row">
        <span className="anver-tb__text">ОСЕННИЕ СКИДКИ | СКИДКИ До 20%</span>

        <div
          className="anver-tb__timer"
          role="timer"
          aria-label="Обратный отсчёт до конца акции"
        >
          {units.map((unit) => (
            <span key={unit.label} className="anver-tb__unit">
              {unit.value}
              {unit.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLang } from "@/context/LanguageContext";

type SizeTablePopupProps = {
  onClose: () => void;
};

const SIZES_RU = [
  { label: "1.5-спальный", duvet: "200×220", sheet: "180×220", pillows: "50×70 (2)" },
  { label: "2-спальный", duvet: "200×220", sheet: "220×240", pillows: "50×70 (2)" },
  { label: "Евро", duvet: "240×260", sheet: "240×280", pillows: "50×70 (2)" },
  { label: "Семейный", duvet: "200×220 (2)", sheet: "240×280", pillows: "50×70 (2)" },
];

const SIZES_RO = [
  { label: "1,5 pers.", duvet: "200×220", sheet: "180×220", pillows: "50×70 (2)" },
  { label: "2 pers.", duvet: "200×220", sheet: "220×240", pillows: "50×70 (2)" },
  { label: "Euro", duvet: "240×260", sheet: "240×280", pillows: "50×70 (2)" },
  { label: "Familial", duvet: "200×220 (2)", sheet: "240×280", pillows: "50×70 (2)" },
];

export default function SizeTable({ onClose }: SizeTablePopupProps) {
  const { t, lang } = useLang();
  const sizes = lang === "ro" ? SIZES_RO : SIZES_RU;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#242424" }}>
            {t("modal.sizeTable")}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f2f2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              lineHeight: 1,
              border: "none",
              cursor: "pointer",
            }}
            aria-label={t("modal.close")}
          >
            ×
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #dedede" }}>
                {t("modal.size")}
              </th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #dedede" }}>
                Пододеяльник
              </th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #dedede" }}>
                Простыня
              </th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #dedede" }}>
                Наволочки
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row, idx) => (
              <tr
                key={row.label}
                style={{
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: "10px 12px", fontWeight: 500, color: "#242424" }}>
                  {row.label}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#242424" }}>
                  {row.duvet}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#242424" }}>
                  {row.sheet}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "#242424" }}>
                  {row.pillows}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 16, fontSize: 12, color: "#808080", lineHeight: 1.5 }}>
          {lang === "ro"
            ? "Dimensiunile sunt în centimetri (cm). Vă rugăm să măsurați salteaua și plapuma înainte de a alege."
            : "Размеры указаны в сантиметрах (см). Пожалуйста, измерьте матрас и одеяло перед выбором."}
        </p>
      </div>
    </div>
  );
}
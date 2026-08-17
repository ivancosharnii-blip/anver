"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { productRo, productMarkRo, optionTitleRo } from "@/lib/product-ro";
import SizeTable from "./SizeTable";
import styles from "./ProductModal.module.css";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalInner key={product.uid} product={product} onClose={onClose} />;
}

/** Аккордеон — раскрывающиеся секции с деталями товара */
function Accordion({
  sections,
}: {
  sections: { title: string; content: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ borderTop: "1px solid #eee", marginTop: 8 }}>
      {sections.map((sec, idx) => {
        const isOpen = open === idx;
        return (
          <div key={sec.title} style={{ borderBottom: "1px solid #eee" }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "12px 0",
                fontSize: 14,
                fontWeight: 500,
                color: "#242424",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font)",
              }}
              aria-expanded={isOpen}
            >
              <span style={{ flex: 1 }}>{sec.title}</span>
              <span
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  fontSize: 12,
                  color: "#808080",
                }}
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0 0 12px 28px",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#808080",
                }}
              >
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductModalInner({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { t, lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [sizeTableOpen, setSizeTableOpen] = useState(false);

  // Размеры (кухня): вариант с ценой; при выборе цена в модалке обновляется.
  const sizeOptions = product.sizeOptions ?? [];
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]?.label ?? "");
  const effectivePrice =
    sizeOptions.find((s) => s.label === selectedSize)?.price ?? product.price;

  // Опция «Цвет» — единственная у всех товаров.
  const colorOption =
    product.json_options.find((o) => o.title.toLowerCase().includes("цвет")) ??
    product.json_options[0];
  const colors = colorOption?.values ?? [];
  const perColor =
    colors.length > 0
      ? Math.round(product.gallery.length / colors.length)
      : product.gallery.length;
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const colorIdx = colors.indexOf(selectedColor);

  // Фото ТОЛЬКО выбранной расцветки.
  const colorGallery =
    colorIdx >= 0 && perColor > 0
      ? product.gallery.slice(colorIdx * perColor, (colorIdx + 1) * perColor)
      : product.gallery;

  // Перевод товара на румынский (по uid)
  const ro = lang === "ro" ? productRo[product.uid] : undefined;
  const title = ro?.title ?? product.title;
  const text = ro?.text ?? product.text;
  const mark = product.mark
    ? lang === "ro"
      ? productMarkRo[product.mark] ?? product.mark
      : product.mark
    : null;
  const optionTitle = (t: string) => (lang === "ro" ? optionTitleRo[t] ?? t : t);

  // Является ли товар постельным (есть цветовые опции) — показываем таблицу размеров
  const isBedding = product.json_options.length > 0 || product.category !== "Кухня";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const gallery = colorGallery.length > 0 ? colorGallery : [""];
  const mainImage = gallery[activeIdx];

  const selectColor = (value: string) => {
    setSelectedColor(value);
    setActiveIdx(0);
  };

  const handleAdd = () => {
    addItem(product, selectedColor, 1, sizeOptions.length > 0 ? selectedSize : undefined);
  };

  // Секции аккордеона
  const accordionSections = [
    {
      title: t("modal.composition"),
      content: t("modal.compositionText"),
    },
    {
      title: t("modal.care"),
      content: t("modal.careText"),
    },
    {
      title: t("modal.delivery"),
      content: t("modal.deliveryText"),
    },
  ];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.card} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("modal.close")}
          >
            ×
          </button>
          <div className={styles.body}>
            <div>
              {mainImage ? (
                <div className={styles.mainImage}>
                  <img src={mainImage} alt={title} loading="lazy" />
                </div>
              ) : null}
              {gallery.length > 1 ? (
                <div className={styles.thumbs}>
                  {gallery.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      className={`${styles.thumb} ${
                        idx === activeIdx ? styles.thumbActive : ""
                      }`}
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`${t("modal.photo")} ${idx + 1}`}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{title}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(effectivePrice)}</span>
                {product.priceold ? (
                  <span className={styles.priceOld}>{formatPrice(product.priceold)}</span>
                ) : null}
              </div>
              {mark ? <span className={styles.badge}>{mark}</span> : null}

              {/* Аккордеон вместо plain text */}
              <Accordion sections={accordionSections} />

              {text ? (
                <div
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: text }}
                  style={{ marginTop: 8 }}
                />
              ) : null}

              {/* Карточки расцветок */}
              {colorOption ? (
                <div className={styles.option}>
                  <span className={styles.optionLabel}>
                    {optionTitle(colorOption.title)}
                  </span>
                  <div className={styles.colorCards}>
                    {colors.map((value, ci) => {
                      const active = selectedColor === value;
                      const preview = product.gallery[ci * perColor];
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`${styles.colorCard} ${
                            active ? styles.colorCardActive : ""
                          }`}
                          onClick={() => selectColor(value)}
                          aria-pressed={active}
                        >
                          {preview ? (
                            <img
                              className={styles.colorCardImg}
                              src={preview}
                              alt=""
                              loading="lazy"
                            />
                          ) : null}
                          <span className={styles.colorCardName}>{value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {product.json_options
                .filter((o) => o !== colorOption)
                .map((option) => (
                  <div key={option.title} className={styles.option}>
                    <span className={styles.optionLabel}>
                      {optionTitle(option.title)}
                    </span>
                    <div className={styles.optionValues}>
                      {option.values.map((value) => {
                        const active = selectedColor === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            className={`${styles.colorBtn} ${
                              active ? styles.colorBtnActive : ""
                            }`}
                            onClick={() => selectColor(value)}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              {sizeOptions.length > 0 ? (
                <div className={styles.option}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={styles.optionLabel}>{t("modal.size")}</span>
                    {isBedding ? (
                      <button
                        type="button"
                        onClick={() => setSizeTableOpen(true)}
                        style={{
                          fontSize: 12,
                          color: "#5c7494",
                          textDecoration: "underline",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font)",
                        }}
                      >
                        {t("modal.sizeTable")}
                      </button>
                    ) : null}
                  </div>
                  <div className={styles.optionValues}>
                    {sizeOptions.map((s) => {
                      const active = selectedSize === s.label;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          className={`${styles.colorBtn} ${active ? styles.colorBtnActive : ""}`}
                          onClick={() => setSelectedSize(s.label)}
                          aria-pressed={active}
                        >
                          {s.label}{" "}
                          <span style={{ opacity: 0.65, fontSize: 12 }}>
                            {formatPrice(s.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                className={`btn btn-primary ${styles.addBtn}`}
                onClick={handleAdd}
              >
                {t("modal.addToCart")}
              </button>

              {/* Гарантии под кнопкой */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 4,
                  fontSize: 12,
                  color: "#808080",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {t("guarantees.shipping")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {t("guarantees.returns")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {t("guarantees.cotton")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильный sticky add-to-cart */}
      <MobileStickyBar
        title={title}
        price={effectivePrice}
        onAdd={handleAdd}
        addLabel={t("modal.addToCart")}
      />

      {/* Попап таблицы размеров */}
      {sizeTableOpen && (
        <SizeTable onClose={() => setSizeTableOpen(false)} />
      )}
    </>
  );
}

/** Sticky add-to-cart bar — только на мобильных (≤768px) */
function MobileStickyBar({
  title,
  price,
  onAdd,
  addLabel,
}: {
  title: string;
  price: number;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .anv-modal-sticky {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1100;
            background: #ffffff;
            border-top: 1px solid #dedede;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          }
          .anv-modal-sticky__info {
            flex: 1;
            min-width: 0;
          }
          .anv-modal-sticky__title {
            font-size: 14px;
            font-weight: 500;
            color: #242424;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .anv-modal-sticky__price {
            font-size: 16px;
            font-weight: 700;
            color: #b15c2a;
          }
          .anv-modal-sticky__btn {
            flex-shrink: 0;
            padding: 10px 20px;
            background: #242424;
            color: #fff;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            font-family: var(--font);
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            white-space: nowrap;
          }
          .anv-modal-sticky__btn:hover {
            background: #000;
          }
          .anv-modal-sticky__btn:active {
            transform: scale(0.97);
          }
        }
      `}</style>
      <div className="anv-modal-sticky" onClick={onAdd}>
        <div className="anv-modal-sticky__info">
          <div className="anv-modal-sticky__title">{title}</div>
          <div className="anv-modal-sticky__price">{formatPrice(price)}</div>
        </div>
        <button type="button" className="anv-modal-sticky__btn">
          {addLabel}
        </button>
      </div>
    </>
  );
}
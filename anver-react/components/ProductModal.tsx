"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { productRo, productMarkRo, optionTitleRo } from "@/lib/product-ro";
import styles from "./ProductModal.module.css";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalInner key={product.uid} product={product} onClose={onClose} />;
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

  // Опция «Цвет» — единственная у всех товаров. Галерея нарезана по цветам
  // строго последовательно (проверено по данным: 4/7/3/6 фото на цвет).
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

  // Фото ТОЛЬКО выбранной расцветки — чтобы в модалке не мелькали все цвета.
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
    addItem(product, selectedColor);
  };

  return (
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
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.priceold ? (
                <span className={styles.priceOld}>{formatPrice(product.priceold)}</span>
              ) : null}
            </div>
            {mark ? <span className={styles.badge}>{mark}</span> : null}
            {text ? (
              <div
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ) : null}
            {/* Карточки расцветок: превью + название (фото конкретного цвета) */}
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
            <button
              type="button"
              className={`btn btn-primary ${styles.addBtn}`}
              onClick={handleAdd}
            >
              {t("modal.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

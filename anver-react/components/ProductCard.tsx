"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { productRo, productMarkRo } from "@/lib/product-ro";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
  onQuickView?: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { t, lang } = useLang();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Расцветки товара: первый option с «цвет» в названии (как в ProductModal).
  const colorOption =
    product.json_options.find((o) => o.title.toLowerCase().includes("цвет")) ??
    product.json_options[0];
  const colors = colorOption?.values ?? [];
  const perColor =
    colors.length > 0 ? Math.round(product.gallery.length / colors.length) : 0;
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const colorIdx = colors.indexOf(selectedColor);

  // Перевод товара на румынский (по uid)
  const ro = lang === "ro" ? productRo[product.uid] : undefined;
  const title = ro?.title ?? product.title;
  const mark = product.mark ? (lang === "ro" ? productMarkRo[product.mark] ?? product.mark : product.mark) : null;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = (e?: React.MouseEvent) => {
    // Клик не должен открывать модалку быстрого просмотра (кнопка на фото).
    e?.stopPropagation();
    // Цвет передаём в корзину, если у товара есть расцветки.
    addItem(
      product,
      colors.length > 0 ? selectedColor : undefined,
      1,
      product.sizeOptions?.[0]?.label, // размер на карточке не выбираем — берём первый
    );
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };

  // Фото выбранной расцветки (первое в её слайсе галереи), hover — второе.
  const base = colorIdx >= 0 && perColor > 0 ? colorIdx * perColor : 0;
  const first = product.gallery[base];
  const second = product.gallery[base + 1];

  return (
    <div className={styles.card}>
      <div
        className={`${styles.media} ${second ? styles.hasSecond : ""}`}
        onClick={() => onQuickView?.(product)}
        role="button"
        tabIndex={0}
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onQuickView?.(product);
          }
        }}
      >
        {mark ? <span className={styles.badge}>{mark}</span> : null}
        <span className={styles.quickView} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        <img className={`${styles.img} ${styles.imgFirst}`} src={first} alt={title} loading="lazy" />
        {second ? (
          <img className={`${styles.img} ${styles.imgSecond}`} src={second} alt="" loading="lazy" />
        ) : null}
        {/* Компактная кнопка «В корзину»: иконка на фото, без текста — карточка ниже */}
        <button
          type="button"
          className={`${styles.addFab} ${added ? styles.added : ""}`}
          onClick={handleAdd}
          aria-label={added ? t("card.added") : t("card.addToCart")}
          title={t("card.addToCart")}
        >
          {added ? <CheckIcon /> : <CartIcon />}
        </button>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {product.price > 0 ? (
          <div className={styles.prices}>
            <span className={`${styles.price} ${product.priceold ? styles.discount : ""}`}>
              {formatPrice(product.price)}
            </span>
            {product.priceold ? (
              <span className={styles.priceOld}>{formatPrice(product.priceold)}</span>
            ) : null}
          </div>
        ) : null}
        {colors.length > 1 ? (
          <div className={styles.colors}>
            <span className={styles.colorName}>{selectedColor}</span>
            <div className={styles.colorSwatches}>
              {colors.map((value, ci) => {
                const preview = product.gallery[ci * perColor];
                const active = value === selectedColor;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.swatch} ${active ? styles.swatchActive : ""}`}
                    onClick={() => setSelectedColor(value)}
                    aria-label={value}
                    title={value}
                  >
                    {preview ? (
                      <img src={preview} alt={value} loading="lazy" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-12L5 3H2" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

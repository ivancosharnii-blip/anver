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

  // Перевод товара на румынский (по uid)
  const ro = lang === "ro" ? productRo[product.uid] : undefined;
  const title = ro?.title ?? product.title;
  const mark = product.mark ? (lang === "ro" ? productMarkRo[product.mark] ?? product.mark : product.mark) : null;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };

  const first = product.gallery[0];
  const second = product.gallery[1];

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
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.prices}>
          <span className={`${styles.price} ${product.priceold ? styles.discount : ""}`}>
            {formatPrice(product.price)}
          </span>
          {product.priceold ? (
            <span className={styles.priceOld}>{formatPrice(product.priceold)}</span>
          ) : null}
        </div>
        <button
          type="button"
          className={`btn btn-primary ${styles.addBtn} ${added ? styles.added : ""}`}
          onClick={handleAdd}
        >
          {added ? t("card.added") : t("card.addToCart")}
        </button>
      </div>
    </div>
  );
}

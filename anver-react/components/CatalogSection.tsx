"use client";

import { useState } from "react";
import { products, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import styles from "./CatalogSection.module.css";

type CatalogSectionProps = {
  storepart: number;
  title: string;
  description?: string;
  anchor?: string;
};

export default function CatalogSection({
  storepart,
  title,
  description,
  anchor,
}: CatalogSectionProps) {
  const [active, setActive] = useState<Product | null>(null);

  const items = products.filter((p) => p.storepart === storepart);

  return (
    <section id={anchor} className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <div className={styles.grid}>
          {items.map((p) => (
            <ProductCard key={p.uid} product={p} onQuickView={setActive} />
          ))}
        </div>
      </div>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}

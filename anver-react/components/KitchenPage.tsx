"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { kitchenProducts } from "@/lib/kitchen";
import { IMAGES } from "@/lib/site";
import { useLang } from "@/context/LanguageContext";

const PAGE_CSS = `
.anv-crumbs { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-family:var(--font); font-size:12px; line-height:1.2; color:#242424; margin-bottom:28px; }
.anv-crumbs a { display:inline-flex; align-items:center; gap:6px; color:#242424; transition:color 0.3s ease-in-out,opacity 0.3s ease-in-out; }
.anv-crumbs a:hover { color:#5c7494; }
.anv-crumbs__divider { color:#858585; }
.anv-crumbs__current { color:#5c7494; font-weight:500; }
.anv-page-title { font-family:var(--font); font-size:36px; font-weight:500; line-height:1.55; color:#000000; margin:12px 0 6px; }
.anv-page-desc { font-family:var(--font); font-size:14px; font-weight:400; line-height:1.55; color:#000000; opacity:0.6; max-width:560px; margin:0 0 28px; }
@media (max-width:959px){ .anv-page-title { font-size:24px; } }
@media (max-width:639px){ .anv-page-title { font-size:20px; } .anv-page-desc { font-size:12px; } }
`;

export default function KitchenPage() {
  const { t } = useLang();
  const [active, setActive] = useState<Product | null>(null);

  return (
    <section className="section" style={{ padding: "40px 0 60px" }}>
      <style>{PAGE_CSS}</style>
      <div className="container">
        <nav aria-label={t("nav.home")} className="anv-crumbs">
          <Link href="/">
            <img src={IMAGES.homeIcon} alt="" style={{ height: 12, width: "auto" }} />
            {t("nav.home")}
          </Link>
          <span className="anv-crumbs__divider" aria-hidden="true">/</span>
          <span className="anv-crumbs__current">{t("nav.kitchen")}</span>
        </nav>

        <p className="anv-page-desc">{t("page.kitchenDescr")}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {kitchenProducts.map((product) => (
            <ProductCard key={product.uid} product={product} onQuickView={setActive} />
          ))}
        </div>
      </div>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}

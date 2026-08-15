"use client";

import Link from "next/link";
import { useCatalogItems } from "@/lib/useCatalog";
import { IMAGES } from "@/lib/site";
import ProductCard from "./ProductCard";
import { useLang } from "@/context/LanguageContext";

// Панель категорий — точная копия t978 (rec1386247771) из site/ranforce.html.
const CATEGORY_GROUPS = [
  {
    labelKey: "nav.categories",
    items: [
      { labelKey: "nav.sets", href: "/sets" },
      { labelKey: "nav.bundles", href: "/bundles" },
      { labelKey: "nav.duvet", href: "/duvet-covers" },
      { labelKey: "nav.sheets", href: "/sheets" },
      { labelKey: "nav.pillowcases", href: "/pillowcases" },
    ],
  },
  {
    labelKey: "nav.fabrics",
    items: [
      // Оригинальные ссылки t978 вели на /sateen-premium, /sateen-luxe,
      // /sateen-stripes, /pure-cotton-ranforce — страниц нет (см. PROJECT.md §6).
      // Маппинг: sateen-premium→/sateen, sateen-stripes→/sateen-stripe,
      // pure-cotton-ranforce→/ranforce; Sateen Luxe убран (товаров нет в выгрузке).
      { labelKey: "nav.sateenPremium", href: "/sateen" },
      { labelKey: "nav.sateenStripes", href: "/sateen-stripe" },
      { labelKey: "nav.pureCottonRanforce", href: "/ranforce" },
    ],
  },
];

const PAGE_CSS = `
.anv-catpanel { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }
.anv-catpanel__group { position:relative; }
.anv-catpanel__trigger { display:inline-flex; align-items:center; gap:7px; padding:8px 14px; font-family:var(--font); font-size:13px; font-weight:500; line-height:1.55; color:#242424; border-radius:30px; transition:color 0.3s ease-in-out,background-color 0.2s ease-in-out; }
.anv-catpanel__group:hover .anv-catpanel__trigger, .anv-catpanel__group:focus-within .anv-catpanel__trigger { color:#5c7494; background:#f2f2f2; }
.anv-catpanel__arrow { width:0; height:0; border-left:4px solid #242424; border-top:4px solid transparent; border-bottom:4px solid transparent; transition:border-left-color 0.3s ease-in-out; }
.anv-catpanel__group:hover .anv-catpanel__arrow, .anv-catpanel__group:focus-within .anv-catpanel__arrow { border-left-color:#5c7494; }
.anv-catpanel__sub { position:absolute; top:calc(100% + 6px); left:0; min-width:230px; background:#e9eef4; border-radius:8px; box-shadow:0px 15px 30px -10px rgba(0,11,48,0.2); padding:10px; display:none; z-index:60; }
.anv-catpanel__group:hover .anv-catpanel__sub, .anv-catpanel__group:focus-within .anv-catpanel__sub { display:block; }
.anv-catpanel__sub a { display:block; padding:8px 12px; border-radius:4px; font-family:var(--font); font-size:13px; font-weight:500; line-height:1.55; color:#242424; white-space:nowrap; transition:color 0.3s ease-in-out,background-color 0.2s ease-in-out; }
.anv-catpanel__sub a:hover { color:#5c7494; background:rgba(255,255,255,0.55); }
@media (max-width:640px){ .anv-catpanel__sub { position:static; min-width:0; } }

.anv-crumbs { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-family:var(--font); font-size:12px; line-height:1.2; color:#242424; margin-bottom:28px; }
.anv-crumbs a { display:inline-flex; align-items:center; gap:6px; color:#242424; transition:color 0.3s ease-in-out,opacity 0.3s ease-in-out; }
.anv-crumbs a:hover { color:#5c7494; }
.anv-crumbs__divider { color:#858585; }
.anv-crumbs__current { color:#5c7494; font-weight:500; }

.anv-page-title { font-family:var(--font); font-size:36px; font-weight:500; line-height:1.55; color:#000000; margin:12px 0 6px; }
.anv-page-desc { font-family:var(--font); font-size:14px; font-weight:400; line-height:1.55; color:#000000; opacity:0.6; max-width:560px; margin:0 0 28px; }
.anv-rating-line { display:flex; align-items:center; gap:8px; margin:0 0 28px; }
.anv-rating-line__stars { color:#d59c3f; font-size:14px; font-weight:500; line-height:1.55; }
.anv-rating-line__text { color:#3a4f6a; font-size:12px; font-weight:500; line-height:1.55; }
@media (max-width:959px){ .anv-page-title { font-size:24px; } }
@media (max-width:639px){ .anv-page-title { font-size:20px; } .anv-page-desc { font-size:12px; } }
`;

type CatalogPageProps = {
  titleKey: string;
  crumbKey: string;
  descrKey?: string;
  storepart?: number;
  category?: string;
  showRating?: boolean;
};

export default function CatalogPage({
  titleKey,
  crumbKey,
  descrKey,
  storepart,
  category,
  showRating = false,
}: CatalogPageProps) {
  const { t } = useLang();

  const items = useCatalogItems({ storepart, category });

  return (
    <section className="section" style={{ padding: "40px 0 60px" }}>
      <style>{PAGE_CSS}</style>
      <div className="container">
        {/* Панель категорий (t978) */}
        <div className="anv-catpanel" role="navigation" aria-label={t("nav.categories")}>
          {CATEGORY_GROUPS.map((group) => (
            <div className="anv-catpanel__group" key={group.labelKey}>
              <button type="button" className="anv-catpanel__trigger">
                {t(group.labelKey)}
                <span className="anv-catpanel__arrow" aria-hidden="true" />
              </button>
              <div className="anv-catpanel__sub">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Хлебные крошки (t758) */}
        <nav aria-label={t("nav.home")} className="anv-crumbs">
          <Link href="/">
            <img src={IMAGES.homeIcon} alt="" style={{ height: 12, width: "auto" }} />
            {t("nav.home")}
          </Link>
          <span className="anv-crumbs__divider" aria-hidden="true">
            /
          </span>
          <span className="anv-crumbs__current">{t(crumbKey)}</span>
        </nav>

        <h1 className="anv-page-title">{t(titleKey)}</h1>
        {descrKey ? <p className="anv-page-desc">{t(descrKey)}</p> : null}
        {showRating ? (
          <div className="anv-rating-line">
            <span className="anv-rating-line__stars">★★★★★</span>
            <span className="anv-rating-line__text">{t("home.rating")}</span>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((product) => (
            <ProductCard key={product.uid} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import TopBanner from "./TopBanner";
import MobileMenu from "./MobileMenu";

// Оригинал главной: rec1480769801 (тёмная шапка поверх hero) + rec1497155991 (белая, фикс. при скролле).
// Меню главной: «Постельное белье • Кухня (скоро) • Контакты» — БЕЗ «Подарок» и «Распродажа».
// На каталог-страницах (rec1386247761): «Постель • Кухня (скоро) • Подарок • Распродажа (+до -50%) • Контакты».
// Правые «пилюли»: корзина и язык — #f2f2f2, radius 8, высота 32px (rec1497155991).

// Блок рейтинга rec1506370021 перенесён в components/HomePage.tsx — под hero-секцию главной
// (по просьбе: надпись «800 довольных клиентов» не должна висеть над шапкой).

export default function Header() {
  const ctx = useCart();
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <>
      <TopBanner />

      <header className="anver-hd">
        <style>{`
          .anver-hd {
            position: sticky;
            top: 0;
            z-index: 900;
            background: rgba(255, 255, 255, 0.8);
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
          }
          .anver-hd__bar {
            height: 68px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .anver-hd__brand {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
          }
          .anver-hd__nav {
            display: flex;
            align-items: center;
            gap: 0;
            font-size: 14px;
          }
          .anver-hd__nav a,
          .anver-hd__nav span {
            color: #242424;
            font-weight: 500;
            line-height: 1.55;
            border-radius: 30px;
            padding: 6px 14px;
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          .anver-hd__nav a:hover {
            background: #f2f2f2;
            color: #242424;
          }
          .anver-hd__soon {
            opacity: 0.6;
            cursor: default;
          }
          .anver-hd__sale {
            position: relative;
          }
          .anver-hd__badge {
            display: inline-block;
            margin-left: 2px;
            padding: 2px 8px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 400;
            line-height: 1.55;
            color: #808080;
            white-space: nowrap;
          }
          .anver-hd__actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
          }
          .anver-hd__pill {
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #f2f2f2;
            border-radius: 8px;
            padding: 0 12px;
            white-space: nowrap;
          }
          .anver-hd__lang {
            font-size: 14px;
            color: #242424;
            opacity: 0.5;
            line-height: 1;
          }
          .anver-hd__lang img {
            opacity: 0.5;
          }
          .anver-hd__cart {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 12px;
          }
          .anver-hd__count {
            font-size: 14px;
            color: #242424;
            line-height: 1;
          }
          .anver-hd__burger {
            display: none;
            align-items: center;
            padding: 4px;
            margin-left: 2px;
          }
          @media (max-width: 959px) {
            .anver-hd__nav {
              display: none;
            }
            .anver-hd__langpill {
              display: none;
            }
            .anver-hd__burger {
              display: flex;
            }
          }
          @media (max-width: 640px) {
            .anver-hd__made {
              display: none;
            }
          }
        `}</style>

        <div className="anver-hd__bar">
          <Link
            href="/"
            className="anver-hd__brand"
            aria-label="Anver"
            onClick={(e) => {
              // Уже на главной — просто прокрутить вверх к началу страницы.
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src="https://zlnwlaubmcmhbwqkchzq.supabase.co/storage/v1/object/public/anver-images/tild3936-6637-4939-b739-313337343731/anver_logo.svg"
              alt="Anver"
              width={80}
              height={17}
            />
            <img
              className="anver-hd__made"
              src="https://zlnwlaubmcmhbwqkchzq.supabase.co/storage/v1/object/public/anver-images/tild3035-3264-4036-b637-346263373036/Made_in_Moldova_Tag.svg"
              alt="Made in Moldova"
              width={100}
              height={22}
            />
          </Link>

          <nav className="anver-hd__nav">
            {isHome ? (
              <>
                <Link href="/#bedding">{t("nav.beddingHome")}</Link>
                <Link href="/kitchen">{t("nav.kitchen")}</Link>
                <Link href="/reviews">{t("nav.reviews")}</Link>
                <Link href="/contacts">{t("nav.contacts")}</Link>
              </>
            ) : (
              <>
                <Link href="/#bedding">{t("nav.bedding")}</Link>
                <Link href="/kitchen">{t("nav.kitchen")}</Link>
                <Link href="/reviews">{t("nav.reviews")}</Link>
                <Link href="/contacts">{t("nav.contacts")}</Link>
              </>
            )}
          </nav>

          <div className="anver-hd__actions">
            <div className="anver-hd__pill anver-hd__langpill">
              <LangIcon />
              <span className="anver-hd__lang" style={{ opacity: 1 }}>
                <button
                  type="button"
                  onClick={() => setLang(lang === "ru" ? "ro" : "ru")}
                  style={{
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    fontFamily: "inherit",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0,
                    color: "#242424",
                  }}
                >
                  {lang === "ru" ? "RO" : "RU"}
                </button>
              </span>
            </div>

            <button
              type="button"
              className="anver-hd__pill anver-hd__cart"
              onClick={ctx.openCart}
              aria-label={t("cart.title")}
            >
              <CartIcon />
              <span className="anver-hd__count">{ctx.count}</span>
            </button>

            <button
              type="button"
              className="anver-hd__burger"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.contacts")}
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function CartIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#242424"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-12L5 3H2" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

function LangIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#242424"
      strokeWidth="1.6"
      strokeLinecap="round"
      style={{ opacity: 0.5 }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#242424"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

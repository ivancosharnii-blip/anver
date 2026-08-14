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

// Блок рейтинга rec1506370021: 98px, фон #ffffff, внизу полоса #e9eef4 30px,
// «★★★★★» (#d59c3f, 14px) + «Уже больше 800 довольных клиентов!» (#3a4f6a, 12px), по центру.
// В оригинале он фиксированный и выезжает при скролле; по ТЗ на главной — статичный блок
// сразу после полосы скидок и перед шапкой.
function RatingBar() {
  const { t } = useLang();
  return (
    <div className="anver-rating" aria-hidden="false">
      <style>{`
        .anver-rating {
          position: relative;
          height: 98px;
          background: #ffffff;
        }
        .anver-rating__inner {
          position: absolute;
          top: 72px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .anver-rating__stars {
          color: #d59c3f;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.55;
        }
        .anver-rating__text {
          color: #3a4f6a;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.55;
        }
        .anver-rating__strip {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 30px;
          background: #e9eef4;
        }
      `}</style>
      <div className="anver-rating__inner">
        <span className="anver-rating__stars">★★★★★</span>
        <span className="anver-rating__text">{t("home.rating")}</span>
      </div>
      <div className="anver-rating__strip" />
    </div>
  );
}

export default function Header() {
  const ctx = useCart();
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <>
      <TopBanner />
      {isHome ? <RatingBar /> : null}

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
          <Link href="/" className="anver-hd__brand" aria-label="Anver">
            <img
              src="https://static.tildacdn.one/tild3936-6637-4939-b739-313337343731/anver_logo.svg"
              alt="Anver"
              width={80}
              height={17}
            />
            <img
              className="anver-hd__made"
              src="https://static.tildacdn.one/tild3035-3264-4036-b637-346263373036/Made_in_Moldova_Tag.svg"
              alt="Made in Moldova"
              width={100}
              height={22}
            />
          </Link>

          <nav className="anver-hd__nav">
            {isHome ? (
              <>
                <Link href="/#bedding">{t("nav.beddingHome")}</Link>
                <span className="anver-hd__soon">{t("nav.kitchen")}</span>
                <Link href="/contacts">{t("nav.contacts")}</Link>
              </>
            ) : (
              <>
                <Link href="/#bedding">{t("nav.bedding")}</Link>
                <span className="anver-hd__soon">{t("nav.kitchen")}</span>
                <Link href="/gift">{t("nav.gift")}</Link>
                <Link href="/sale" className="anver-hd__sale">
                  {t("nav.sale")}
                  <span className="anver-hd__badge">{t("nav.saleBadge")}</span>
                </Link>
                <Link href="/contacts">{t("nav.contacts")}</Link>
              </>
            )}
          </nav>

          <div className="anver-hd__actions">
            <div className="anver-hd__pill anver-hd__langpill">
              <LangIcon />
              <span className="anver-hd__lang">
                <button
                  type="button"
                  onClick={() => setLang("ru")}
                  style={{
                    fontWeight: lang === "ru" ? 700 : 400,
                    opacity: lang === "ru" ? 1 : 0.5,
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
                  RU
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  onClick={() => setLang("ro")}
                  style={{
                    fontWeight: lang === "ro" ? 700 : 400,
                    opacity: lang === "ro" ? 1 : 0.5,
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
                  RO
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

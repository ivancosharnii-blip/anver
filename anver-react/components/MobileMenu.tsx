"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";

const LOGO_URL =
  "https://static.tildacdn.one/tild3936-6637-4939-b739-313337343731/anver_logo.svg";

// Оригинал: rec1386253291 (попап #menu, t1093, фон rgba(36,36,36,0.20) + blur 4px).
// На главной: «Постельное белье» (подменю с миниатюрами), «Кухня (скоро)», «Контакты»,
// «Конструктор белья (скоро)» (чёрная пилюля). На каталог-страницах — расширенное меню.
// Жёлтые акценты #fff705 (5px) над пунктами — из оригинала.

const HOME_FABRICS = [
  {
    key: "nav.ranforce",
    href: "/#bedding",
    image: "https://static.tildacdn.one/tild6262-6438-4533-a361-346439393565/12_6.jpg",
  },
  {
    key: "nav.sateen",
    href: "/#bedding-sateen",
    image: "https://static.tildacdn.one/tild3461-6233-4637-a661-663661326437/10_4.jpg",
  },
  {
    key: "nav.stripe",
    href: "/#bedding-stripe",
    image: "https://static.tildacdn.one/tild3461-3032-4061-a334-313433636439/7_2.jpg",
  },
];

const CATALOG_CATEGORIES = [
  { key: "nav.sets", href: "/sets" },
  { key: "nav.bundles", href: "/bundles" },
  { key: "nav.duvet", href: "/duvet-covers" },
  { key: "nav.pillowcases", href: "/pillowcases" },
  { key: "nav.sheets", href: "/sheets" },
];

type MobileMenuProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function MobileMenu({ open = false, onClose = () => {} }: MobileMenuProps) {
  const ctx = useCart();
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [beddingOpen, setBeddingOpen] = useState(true);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className="anver-mm"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={onClose}
    >
      <style>{`
        .anver-mm {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(36, 36, 36, 0.2);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .anver-mm[data-open="true"] {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .anver-mm__panel {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          max-width: 480px;
          background: #fff;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        .anver-mm[data-open="true"] .anver-mm__panel {
          transform: translateX(0);
        }
        .anver-mm__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #eaeaea;
        }
        .anver-mm__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .anver-mm__pill {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f2f2f2;
          border-radius: 8px;
          padding: 0 12px;
          white-space: nowrap;
          font-size: 14px;
          color: #242424;
        }
        .anver-mm__cart {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 12px;
          cursor: pointer;
        }
        .anver-mm__count {
          font-size: 14px;
          color: #242424;
          line-height: 1;
        }
        .anver-mm__close {
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .anver-mm__nav {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }
        .anver-mm__item {
          border-bottom: 1px solid #f2f2f2;
          padding: 0 20px;
        }
        .anver-mm__accent {
          width: 100px;
          height: 5px;
          background: #fff705;
          margin: 14px 0 10px;
        }
        .anver-mm__acc {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #242424;
          cursor: pointer;
        }
        .anver-mm__soon {
          display: block;
          padding: 12px 0;
          font-size: 16px;
          opacity: 0.5;
        }
        .anver-mm__link {
          display: block;
          padding: 12px 0;
          font-size: 16px;
          color: #242424;
        }
        .anver-mm__sub {
          list-style: none;
          padding: 0 0 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .anver-mm__sub a {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #242424;
        }
        .anver-mm__sub img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
        }
        .anver-mm__chev {
          display: flex;
          align-items: center;
          transition: transform 0.25s ease;
        }
        .anver-mm__chev[data-open="true"] {
          transform: rotate(180deg);
        }
        .anver-mm__constructor {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 14px 0 18px;
          padding: 13px 24px;
          background: #000000;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.55;
          border-radius: 30px;
          cursor: default;
        }
        .anver-mm__bottom {
          padding: 20px;
          border-top: 1px solid #eaeaea;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .anver-mm__phone {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #242424;
        }
        .anver-mm__socials {
          display: flex;
          gap: 10px;
        }
        .anver-mm__socials a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f2f2f2;
          color: #242424;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .anver-mm__socials a:hover {
          background: #e9eef4;
          color: #3a4f6a;
        }
      `}</style>

      <div className="anver-mm__panel" onClick={(e) => e.stopPropagation()}>
        <div className="anver-mm__top">
          <img src={LOGO_URL} alt="Anver" width={80} />

          <div className="anver-mm__actions">
            <div className="anver-mm__pill">
              <LangIcon />
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
              <span aria-hidden="true" style={{ opacity: 0.5 }}>/</span>
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
            </div>

            <button
              type="button"
              className="anver-mm__pill anver-mm__cart"
              onClick={() => {
                onClose();
                ctx.openCart();
              }}
              aria-label="Открыть корзину"
            >
              <CartIcon />
              <span className="anver-mm__count">{ctx.count}</span>
            </button>

            <button
              type="button"
              className="anver-mm__close"
              onClick={onClose}
              aria-label="Закрыть меню"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <nav className="anver-mm__nav">
          <div className="anver-mm__item">
            <div className="anver-mm__accent" />
            <button
              type="button"
              className="anver-mm__acc"
              aria-expanded={beddingOpen}
              onClick={() => setBeddingOpen((v) => !v)}
            >
              {isHome ? t("nav.beddingHome") : t("nav.bedding")}
              <ChevronIcon open={beddingOpen} />
            </button>

            {beddingOpen && (
              <ul className="anver-mm__sub">
                {isHome
                  ? HOME_FABRICS.map((category) => (
                      <li key={category.href}>
                        <Link href={category.href} onClick={onClose}>
                          <img src={category.image} alt={t(category.key)} />
                          <span>{t(category.key)}</span>
                        </Link>
                      </li>
                    ))
                  : CATALOG_CATEGORIES.map((category) => (
                      <li key={category.href}>
                        <Link href={category.href} onClick={onClose}>
                          <span>{t(category.key)}</span>
                          <span aria-hidden="true"> →</span>
                        </Link>
                      </li>
                    ))}
              </ul>
            )}
          </div>

          <div className="anver-mm__item">
            <div className="anver-mm__accent" />
            <span className="anver-mm__soon">{t("nav.kitchen")}</span>
          </div>

          {!isHome ? (
            <div className="anver-mm__item">
              <div className="anver-mm__accent" />
              <Link href="/gift" className="anver-mm__link" onClick={onClose}>
                {t("nav.gift")}
              </Link>
            </div>
          ) : null}

          {!isHome ? (
            <div className="anver-mm__item">
              <div className="anver-mm__accent" />
              <Link href="/sale" className="anver-mm__link" onClick={onClose}>
                {t("nav.sale")}&nbsp;<span style={{ opacity: 0.6 }}>{t("nav.saleBadge")}</span>
              </Link>
            </div>
          ) : null}

          <div className="anver-mm__item">
            <div className="anver-mm__accent" />
            <Link href="/contacts" className="anver-mm__link" onClick={onClose}>
              {t("nav.contacts")}
            </Link>
          </div>

          {isHome ? (
            <div className="anver-mm__item">
              <div className="anver-mm__accent" />
              <span className="anver-mm__constructor">{t("nav.constructor")}</span>
            </div>
          ) : null}
        </nav>

        <div className="anver-mm__bottom">
          <a className="anver-mm__phone" href="tel:+37378282508">
            <CallIcon />
            <span>078 28 25 08</span>
          </a>

          <div className="anver-mm__socials">
            <a href="#" aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href="#" aria-label="Viber">
              <ViberIcon />
            </a>
            <a href="#" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
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

function CallIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span className="anver-mm__chev" data-open={open}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#242424"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.4 1.67c.7-.11 1.42-.11 2.14-.09 2.05.03 3.87.56 5.44 1.79 1.16.93 1.95 2.13 2.4 3.5.43 1.32.54 2.68.53 4.06-.02 1.16-.08 2.31-.42 3.42-.64 2.1-1.9 3.78-3.76 4.92-.91.55-1.88.93-2.94 1.13-1.34.25-2.68.28-4.02.19-1.33-.09-2.58-.5-3.73-1.16-.45-.27-.88-.58-1.3-.9-.66.28-1.27.66-1.89 1.03-.03-.6.01-1.22-.02-1.85.33-.23.65-.49.96-.76.4.6.91 1.12 1.47 1.56.46.35.96.62 1.51.79.88.27 1.79.33 2.71.3 1.42-.05 2.77-.4 4.02-1.05 1.54-.79 2.76-1.99 3.5-3.55.55-1.16.85-2.39.91-3.66.06-1.29-.1-2.55-.54-3.75-.44-1.19-1.14-2.23-2.17-2.95-1.41-.99-3-1.38-4.73-1.31-1.49.06-2.89.45-4.1 1.36-1.15.87-2 1.99-2.55 3.32-.39.95-.58 1.93-.57 2.95 0 .39.01.78.04 1.16-1.04.17-2-.55-2.32-1.54-.18-.55-.22-1.12-.18-1.69.05-.76.19-1.5.44-2.21.42-1.19 1.04-2.28 1.91-3.19C8.3 2.35 9.81 1.66 11.4 1.67zM9.05 16.5c.5.66 1.14 1.17 1.88 1.48.6.24 1.24.33 1.88.29.5-.03.99-.12 1.46-.3.87-.34 1.6-.93 2.13-1.7.38-.56.63-1.17.78-1.83.12-.55.1-1.09-.05-1.63-.14-.5-.46-.9-.94-1.05-.25-.08-.51-.07-.76.02-.28.1-.49.3-.62.56-.08.17-.12.36-.22.52-.06.11-.13.23-.25.28-.13.06-.27.02-.39-.05-.18-.1-.36-.23-.53-.36-.45-.36-.87-.76-1.27-1.19-.34-.36-.63-.78-.84-1.23-.09-.2-.15-.4-.1-.62.04-.18.16-.31.3-.42.2-.15.44-.24.66-.37.13-.07.23-.19.29-.33.08-.2.07-.42-.01-.62-.13-.36-.31-.7-.52-1.01-.22-.34-.54-.56-.91-.65-.38-.09-.78-.08-1.15.06-.44.17-.78.5-.98.93-.18.39-.19.83-.02 1.22.4.95 1.02 1.75 1.79 2.4 1.01.85 2.19 1.41 3.52 1.7.3.07.62.1.93.08.55-.04 1.02-.26 1.32-.74.14-.23.19-.5.14-.77-.02-.1-.1-.17-.2-.19-.34-.08-.69-.08-1.02-.18-.9-.27-1.7-.76-2.31-1.45-.44-.5-.73-1.09-.83-1.75-.02-.15-.06-.3-.13-.44l-.02-.04v-.02c-.05-.14-.19-.22-.33-.21-.12.01-.21.07-.26.17-.1.19-.1.42-.06.63.12.68.41 1.31.85 1.82.54.63 1.24 1.08 2.05 1.31.3.08.6.1.9.03.4-.09.67-.39.73-.79.03-.19.03-.39.01-.58 0-.17-.06-.33-.14-.48-.24-.4-.55-.76-.94-1.02-.19-.13-.4-.22-.61-.29-.29-.1-.58-.06-.83.1-.23.14-.3.43-.19.67l.07.13c.24.44.62.77 1.07.94.21.08.43.09.64.02.2-.07.3-.28.23-.48-.06-.16-.17-.3-.3-.4l-.02-.01.04.02c-.25-.22-.5-.44-.78-.62-.46-.3-1.02-.43-1.56-.35-.66.1-1.14.5-1.4 1.1-.18.4-.2.84-.04 1.25.2.55.55 1.02 1.01 1.37l.03.03c.27.2.56.36.87.5.58.26 1.21.36 1.83.29.53-.06 1-.29 1.36-.68.13-.14.23-.3.31-.48.04-.08.1-.14.19-.16.08-.02.16 0 .23.03.13.06.25.15.35.25.18.18.34.37.49.57.13.18.29.33.47.45.04.02.09.05.14.06.08.02.16-.02.2-.1.04-.07.07-.15.09-.23.11-.42.06-.86-.12-1.26-.13-.29-.3-.56-.5-.8-.28-.33-.58-.64-.91-.92l-.25-.21c-.17-.14-.34-.27-.53-.39-.11-.07-.25-.1-.37-.06-.2.07-.3.28-.22.47.03.07.07.13.12.18.07.07.14.13.22.18.21.16.43.3.66.42.19.1.38.17.59.2.16.02.32.01.47-.03.13-.04.23-.15.27-.28.04-.14 0-.29-.11-.4-.08-.08-.17-.15-.27-.21-.11-.06-.22-.1-.34-.14-.32-.09-.65-.11-.98-.06-.36.05-.68.21-.9.5-.25.32-.32.73-.18 1.11l.02.05c.05.12.12.23.21.32.1.1.21.19.33.27.3.19.62.33.96.41.47.11.96.06 1.4-.15.42-.2.73-.56.86-1 .1-.37.07-.76-.09-1.11-.22-.47-.57-.85-1.01-1.1-.21-.12-.43-.22-.65-.3-.14-.05-.29-.09-.44-.11-.2-.02-.4.02-.57.13-.2.13-.33.33-.36.56-.03.24.06.48.24.64.07.07.15.11.24.13.02 0 .04.01.07.02z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

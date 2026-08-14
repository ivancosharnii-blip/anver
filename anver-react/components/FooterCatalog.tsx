"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CONTACTS, IMAGES } from "@/lib/site";
import { useLang } from "@/context/LanguageContext";

// Оригинал каталога: t977 (rec1451505561) в site/ranforce.html и во всех каталог-страницах (одинаковый).
// Фон #f2f2f2, padding 60px. Колонки: «Все белье» (Комплекты/Пододеяльники/Простынь/Наволочки),
// «Наши ткани» (Сатин Премиум/Сатин Люкс/Сатин Страйп/100% Хлопок Ранфорс),
// «Для клиентов» (Обмен и возврат/Оплата и доставка), «Контакты» (+373 794 76 327 / anvertextil@gmai.com).
// Заголовки 16px/500/#242424, ссылки 14px/#808080, соцсети 28px (#525252): Facebook, Instagram, TikTok.

// Телефон и почта в оригинале — обычный текст (без ссылок), почта с опечаткой «anvertextil@gmai.com»,
// сохранена дословно (см. PROJECT.md §5: опечатки оригинала сохраняются).
const CATALOG_PHONE = "+373 794 76 327";
const CATALOG_EMAIL = "anvertextil@gmai.com";

const NAV = {
  bedding: [
    { key: "footer.sets", href: "/sets" },
    { key: "footer.duvet", href: "/duvet-covers" },
    { key: "footer.sheets", href: "/sheets" },
    { key: "footer.pillowcases", href: "/pillowcases" },
  ],
  fabrics: [
    // «Сатин Люкс» из оригинала убран: страницы /sateen-luxe не существует (см. PROJECT.md §6).
    // Ссылки маппированы: sateen-premium → /sateen, sateen-stripes → /sateen-stripe,
    // pure-cotton-ranforce → /ranforce.
    { key: "footer.fabricSateenPremium", href: "/sateen" },
    { key: "footer.fabricSateenStripe", href: "/sateen-stripe" },
    { key: "footer.fabricRanforce", href: "/ranforce" },
  ],
  clients: [
    { key: "footer.returns", href: "/contacts#returns" },
    { key: "footer.delivery", href: "/contacts#delivery" },
  ],
} as const;

const titleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: "#242424",
  margin: "0 0 14px",
};

const listStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const itemStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 14,
  color: "#808080",
  marginBottom: 15,
  transition: "color 0.2s ease",
};

export default function FooterCatalog() {
  const { t } = useLang();
  return (
    <footer style={{ background: "#f2f2f2", padding: "60px 0" }}>
      <style>{`
        .fc-grid { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .fc-left { width: 260px; max-width: 260px; flex-shrink: 0; }
        .fc-menu { display: flex; gap: 40px; flex-wrap: wrap; }
        .fc-right { width: 190px; max-width: 100%; flex-shrink: 0; }
        .fc-link:hover { color: #242424; }
        .fc-logo:hover img { opacity: 0.85; }
        .fc-socials { display: flex; flex-wrap: wrap; gap: 11px; }
        .fc-socials a { display: inline-block; width: 28px; height: 28px; transition: opacity 0.2s ease; }
        .fc-socials a:hover { opacity: 0.9; }
        @media (max-width: 900px) {
          .fc-grid { flex-direction: column; }
          .fc-left, .fc-right { width: 100%; max-width: none; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div className="fc-grid">
          <div className="fc-left">
            <Link href="/" className="fc-logo" style={{ display: "inline-block", maxWidth: 120 }}>
              <img
                src={IMAGES.logoFooter}
                alt="Anver"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Link>
            <p style={{ margin: "30px 0 0", fontSize: 12, color: "#808080", lineHeight: 1.55 }}>
              {CONTACTS.copyright}
              <br />
              {CONTACTS.idno}
            </p>
          </div>

          <div className="fc-menu">
            <nav>
              <h3 style={titleStyle}>{t("footer.allBedding")}</h3>
              <ul style={listStyle}>
                {NAV.bedding.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="fc-link" style={itemStyle}>
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav>
              <h3 style={titleStyle}>{t("footer.ourFabrics")}</h3>
              <ul style={listStyle}>
                {NAV.fabrics.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="fc-link" style={itemStyle}>
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav>
              <h3 style={titleStyle}>{t("footer.forClients")}</h3>
              <ul style={listStyle}>
                {NAV.clients.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="fc-link" style={itemStyle}>
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav>
              <h3 style={titleStyle}>{t("footer.contacts")}</h3>
              <ul style={listStyle}>
                <li>
                  <span style={itemStyle}>{CATALOG_PHONE}</span>
                </li>
                {/* Пустой пункт из оригинала — отступ между телефоном и почтой */}
                <li style={{ marginBottom: 15 }} aria-hidden="true" />
                <li>
                  <span style={itemStyle}>{CATALOG_EMAIL}</span>
                </li>
              </ul>
            </nav>
          </div>

          <div className="fc-right">
            <div className="fc-socials">
              {/* В оригинале Facebook и TikTok — заглушки без реальных ссылок */}
              <a aria-label="Facebook" title="Facebook">
                <FacebookIcon />
              </a>
              <a
                href={CONTACTS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon />
              </a>
              <a aria-label="TikTok" title="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 100 100",
  fill: "none",
} as const;

function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M43.3077 14.1204C46.4333 11.1506 50.8581 10.1412 55.0516 10.0244C59.4777 9.98539 63.9037 10.0049 68.3285 10.0049C68.348 14.683 68.348 19.3416 68.3285 24.0197C65.4757 24.0197 62.6021 24.0197 59.7492 24.0197C57.9435 23.9028 56.0805 25.2811 55.7505 27.0868C55.7116 30.2125 55.7311 33.3369 55.7311 36.4625C59.9233 36.482 64.1168 36.4625 68.3091 36.482C67.9986 41.0042 67.436 45.5082 66.7761 49.9732C63.0684 50.0122 59.3608 49.9732 55.6531 49.9927C55.6142 63.3281 55.6726 76.6439 55.6336 89.9805C50.1203 90 44.6276 89.961 39.1142 90C39.0168 76.6646 39.1142 63.3293 39.0558 49.9927C36.377 49.9732 33.6788 50.0122 31 49.9732C31.0195 45.4887 31 41.0054 31 36.5404C33.6788 36.5015 36.377 36.5404 39.0558 36.521C39.1337 32.1728 38.9778 27.8052 39.1337 23.4571C39.4259 19.9833 40.7263 16.5082 43.3077 14.1204Z"
        fill="#525252"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M66.9644 10H33.04C20.3227 10 10 20.3227 10 32.9573V67.1167C10 79.6816 20.3227 90 33.04 90H66.96C79.6816 90 90 79.6816 90 67.0384V32.9616C90.0044 20.3227 79.6816 10 66.9644 10ZM29.2 50.0022C29.2 38.5083 38.5257 29.2 50.0022 29.2C61.4786 29.2 70.8 38.5083 70.8 50.0022C70.8 61.4961 61.4743 70.8 50.0022 70.8C38.5257 70.8 29.2 61.4961 29.2 50.0022ZM72.8854 31.2027C70.2079 31.2027 68.0789 29.0824 68.0789 26.4049C68.0789 23.7273 70.2035 21.6027 72.8854 21.6027C75.5586 21.6027 77.6833 23.7273 77.6833 26.4049C77.6833 29.0824 75.5586 31.2027 72.8854 31.2027Z"
        fill="#525252"
      />
      <path
        d="M50.0022 36.4011C42.4659 36.4011 36.4011 42.4876 36.4011 50.0022C36.4011 57.5124 42.4659 63.6033 50.0022 63.6033C57.5429 63.6033 63.6033 57.5124 63.6033 50.0022C63.6033 42.492 57.4514 36.4011 50.0022 36.4011Z"
        fill="#525252"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M51.5101 10.0675C55.8728 10 60.2106 10.04 64.5433 10C64.8058 15.1028 66.6409 20.3005 70.3761 23.9082C74.1038 27.6059 79.3766 29.2985 84.5069 29.8711V43.2943C79.6991 43.1368 74.8688 42.1367 70.5061 40.0666C68.606 39.2066 66.8359 38.099 65.1033 36.9664C65.0808 46.707 65.1433 56.435 65.0408 66.1355C64.7808 70.7957 63.2432 75.4335 60.5331 79.2737C56.1728 85.6665 48.6049 89.8343 40.832 89.9643C36.0643 90.2368 31.3015 88.9367 27.2388 86.5416C20.5059 82.5714 15.7682 75.3035 15.0782 67.5031C14.9981 65.8355 14.9706 64.1704 15.0381 62.5428C15.6382 56.2 18.7759 50.1321 23.6461 46.0044C29.1664 41.1967 36.8993 38.9065 44.1397 40.2616C44.2072 45.1994 44.0097 50.1321 44.0097 55.0699C40.702 53.9998 36.8368 54.2999 33.9467 56.3075C31.8365 57.675 30.234 59.7702 29.3989 62.1403C28.7089 63.8304 28.9064 65.708 28.9464 67.5031C29.7389 72.9734 34.9992 77.5711 40.6145 77.0736C44.3372 77.0336 47.9049 74.8735 49.845 71.7108C50.4725 70.6032 51.1751 69.4707 51.2126 68.1681C51.5401 62.2053 51.4101 56.2675 51.4501 50.3046C51.4776 36.8664 51.4101 23.4657 51.5126 10.07L51.5101 10.0675Z"
        fill="#525252"
      />
    </svg>
  );
}

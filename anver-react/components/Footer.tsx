"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { CONTACTS, IMAGES } from "@/lib/site";
import { useLang } from "@/context/LanguageContext";
import FooterCatalog from "./FooterCatalog";

// Оригинал главной: t977 (rec1451505561). Фон #f2f2f2, padding 60px.
// Колонки: «Все белье» (Ранфорс/Сатин/Сатин Страйп), «Для клиентов» (Обмен и возврат/Оплата и доставка),
// «Контакты» (078 28 25 08 / anvertextil@gmail.com) + соцсети иконками 28px (#525252).
// Заголовки 16px/500/#242424, ссылки 16px/#808080.

const NAV = {
  bedding: [
    { key: "nav.ranforce", href: "/#bedding" },
    { key: "nav.sateen", href: "/#bedding-sateen" },
    { key: "nav.stripe", href: "/#bedding-stripe" },
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

const linkStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 16,
  color: "#808080",
  marginBottom: 15,
  transition: "color 0.2s ease",
};

// Каталог-страницы (в оригинале — t977 каталога) показывают отдельный футер FooterCatalog;
// остальные страницы (главная, контакты, обратная связь, спасибо) — футер главной (ниже).
const CATALOG_PATHS = new Set([
  "/ranforce",
  "/sateen",
  "/sateen-stripe",
  "/sets",
  "/bundles",
  "/sheets",
  "/pillowcases",
  "/duvet-covers",
]);

export default function Footer() {
  const pathname = usePathname();
  if (pathname && CATALOG_PATHS.has(pathname)) {
    return <FooterCatalog />;
  }
  return <MainFooter />;
}

function MainFooter() {
  const { t } = useLang();
  return (
    <footer style={{ background: "#f2f2f2", padding: "60px 0" }}>
      <style>{`
        .f-grid { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .f-left { width: 260px; max-width: 260px; flex-shrink: 0; }
        .f-menu { display: flex; gap: 60px; flex-wrap: wrap; }
        .f-right { width: 190px; max-width: 100%; flex-shrink: 0; }
        .f-link:hover { color: #242424; }
        .f-logo:hover img { opacity: 0.85; }
        .f-socials { display: flex; flex-wrap: wrap; gap: 11px; }
        .f-socials a { display: inline-block; width: 28px; height: 28px; transition: opacity 0.2s ease; }
        .f-socials a:hover { opacity: 0.9; }
        @media (max-width: 900px) {
          .f-grid { flex-direction: column; }
          .f-left, .f-right { width: 100%; max-width: none; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div className="f-grid">
          <div className="f-left">
            <Link href="/" className="f-logo" style={{ display: "inline-block", maxWidth: 120 }}>
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

          <div className="f-menu">
            <nav>
              <h3 style={titleStyle}>{t("footer.allBedding")}</h3>
              <ul style={listStyle}>
                {NAV.bedding.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="f-link" style={linkStyle}>
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
                    <Link href={item.href} className="f-link" style={linkStyle}>
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
                  <a href={CONTACTS.phoneLink} className="f-link" style={linkStyle}>
                    {CONTACTS.phoneFooter}
                  </a>
                </li>
                <li>
                  <a href={CONTACTS.emailLink} className="f-link" style={linkStyle}>
                    {CONTACTS.email}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="f-right">
            <div className="f-socials">
              <a
                href={CONTACTS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                title="Telegram"
              >
                <TelegramIcon />
              </a>
              <a
                href={CONTACTS.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a href={CONTACTS.viber} aria-label="Viber" title="Viber">
                <ViberIcon />
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

function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M66.9644 10H33.04C20.3227 10 10 20.3227 10 32.9573V67.1167C10 79.6816 20.3227 90 33.04 90H66.96C79.6816 90 90 79.6816 90 67.0384V32.9616C90.0044 20.3227 79.6816 10 66.9644 10ZM29.2 50.0022C29.2 38.5083 38.5257 29.2 50.0022 29.2C61.4786 29.2 70.8 38.5083 70.8 50.0022C70.8 61.4961 61.4743 70.8 50.0022 70.8C38.5257 70.8 29.2 61.4961 29.2 50.0022ZM72.8854 31.2027C70.2079 31.2027 68.0789 29.0824 68.0789 26.4049C68.0789 23.7273 70.2035 21.6027 72.8854 21.6027C75.5586 21.6027 77.6833 23.7273 77.6833 26.4049C77.6833 29.0824 75.5586 31.2027 72.8854 31.2027Z"
        fill="#525252"
      />
      <path
        d="M50.0022 36.4011C42.4659 36.4011 36.4011 42.4876 36.4011 50.0022C36.4011 57.5124 42.4659 63.6033 50.0022 63.6033C57.5429 63.6033 63.6033 57.5124 63.6033 50.0022C63.6033 42.492 57.5429 36.4011 50.0022 36.4011Z"
        fill="#525252"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0ZM71.977 31.944C72.363 27.564 67.737 29.368 67.737 29.368C64.322 30.782 60.8 32.218 57.24 33.67C46.2 38.173 34.796 42.825 25.081 47.404C19.813 49.336 22.897 51.268 22.897 51.268L31.248 53.845C35.103 55.005 37.158 53.716 37.158 53.716L55.146 41.478C61.57 37.098 60.028 38.705 58.486 40.251L45.006 53.133C42.95 54.937 43.978 56.483 44.877 57.256C47.427 59.505 53.697 63.62 56.434 65.416C57.146 65.883 57.619 66.194 57.726 66.274C58.368 66.789 61.837 69.108 64.15 68.593C66.463 68.077 66.72 65.114 66.72 65.114L69.803 44.888C70.265 41.377 70.796 38.002 71.22 35.306C71.62 32.76 71.591 32.324 71.977 31.944Z"
        fill="#525252"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M50 0C22.3858 0 0 22.3858 0 50C0 61.05 3.55531 71.2483 9.61392 79.6249L3.21375 96.6193L20.6126 90.2476C28.9725 96.1278 39.0997 100 50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0ZM50 92.3077C39.7 92.3077 30.35 88.3972 23.1277 81.8792L21.8287 80.7053L10.7518 84.239L14.3146 73.2369L13.0157 71.9597C6.18659 64.7193 2.05128 55.4622 2.05128 45.2564C2.05128 21.2821 21.641 1.69231 50 1.69231C78.359 1.69231 97.9487 21.2821 97.9487 50C97.9487 78.7179 78.359 92.3077 50 92.3077ZM72.0513 59.4872C71.0769 58.9744 65.1282 56.0513 64.2564 55.6923C63.3846 55.3333 62.7179 55.1795 62.1026 56.2051C61.4872 57.2308 59.4872 60.1026 58.9744 60.7179C58.4615 61.3846 57.9487 61.4359 56.9744 60.9231C56 60.4103 52.1026 59.0256 47.5385 54.9231C43.9487 51.6923 41.5385 47.6923 41.0256 46.6154C40.5128 45.5385 40.9744 45.0769 41.4359 44.5641C41.8462 44.1026 42.359 43.4359 42.8205 42.8718C43.2821 42.3077 43.4359 41.8462 43.6923 41.1795C43.9487 40.5128 43.8205 39.8974 43.641 39.3846C43.4615 38.8718 41.0513 32.8718 40.0513 30.359C39.1026 27.9487 38.1026 28.2564 37.3846 28.2051C36.7179 28.1538 35.9487 28.1538 35.1795 28.1538C34.4103 28.1538 33.2308 28.4615 32.2051 29.5897C31.1795 30.7179 28.2564 33.4359 28.2564 38.9744C28.2564 44.5128 32.3077 49.8974 32.9231 50.6667C33.5385 51.4359 41.5385 64.1026 54.1026 69.4872C56.8718 70.6667 59.0256 71.3333 60.6667 71.8462C63.4359 72.7179 65.9487 72.5128 67.9487 72.1026C70.2051 71.641 74.9231 69.0256 75.8462 66.1538C76.7692 63.2821 76.7692 60.8205 76.5128 60.359C76.2564 59.8974 75.6923 59.641 75.0256 59.4359C74.359 59.2308 72.0513 59.4872 72.0513 59.4872Z"
        fill="#525252"
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M49.9188 2.5C45.3825 2.5 40.9951 3.09625 36.8214 4.27062C15.9895 10.2181 3.75 29.5244 3.75 50.4169C3.75 57.7238 5.87699 64.8628 9.83325 71.0119L2.5 97.5L29.3926 90.25C35.5011 94.0769 42.5487 96.2356 50.0779 96.2356C54.9917 96.2356 59.7638 95.4631 64.2585 94.0319C84.6304 87.2906 96.25 68.5525 96.25 50.4169C96.25 23.9875 75.5726 2.5 49.9188 2.5ZM81.077 67.9431C80.1502 71.4056 74.9475 74.1787 70.9446 75.1694C68.1844 75.8394 64.6184 76.3456 53.3946 72.0669C39.7316 66.8244 30.3306 54.2331 29.7325 53.4931C29.1864 52.7525 23.3879 44.8931 23.3879 36.8594C23.3879 28.8256 27.5972 25.4925 29.4743 23.635C31.3514 21.7781 33.6546 21.2881 35.0754 21.2881C36.4957 21.2881 37.6971 21.2931 38.7367 21.3875C39.4926 21.4525 40.3107 21.5413 41.2122 24.3906C42.2959 27.8325 44.7466 35.0394 45.0355 35.7644C45.3244 36.4887 45.5222 37.3394 45.1124 38.1763C44.7042 39.0169 44.2642 39.4725 43.5621 40.3025C42.8594 41.1325 41.9753 42.1531 41.3163 42.8769C40.7356 43.5219 40.1012 44.2587 40.7519 45.4094C41.4031 46.56 43.8628 50.5644 47.7182 54.0331C52.6163 58.4344 56.7388 59.8994 57.8749 60.4025C59.0106 60.9063 59.8389 60.7306 60.4522 59.9563C61.1885 59.025 62.6263 57.1856 63.6297 55.8244C64.3036 54.9175 65.0416 54.8444 65.8891 55.2187C66.7397 55.595 73.3674 58.8775 74.2554 59.3225C75.1454 59.7681 75.7337 59.99 75.8919 60.4094C76.0515 60.8287 76.0031 64.4806 81.077 67.9431Z"
        fill="#525252"
      />
    </svg>
  );
}

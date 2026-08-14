"use client";

import Link from "next/link";
import Accordion from "./accordion";
import type { AccordionItem } from "./accordion";
import ContactForm from "./contact-form";
import ConsultBlock from "./consult";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "./icons";
import { useLang } from "@/context/LanguageContext";

// Всё содержимое перенесено дословно из site/contacts.html:
// breadcrumbs (rec1409471471), заголовок (rec1409471481), блок контактов + форма
// (rec1409480781), «Политика обмена и возврата» (rec1409605221 + rec1409612051),
// «Оплата и доставка» (rec1500215341 + rec1500215561), «Консультируем…» (rec1507679391).

const socialLinks = [
  { label: "facebook", href: "https://google.com", icon: <FacebookIcon /> },
  { label: "twitter", href: "https://google.com", icon: <TwitterIcon /> },
  { label: "instagram", href: "https://google.com", icon: <InstagramIcon /> },
];

export default function ContactsContent() {
  const { t } = useLang();

  const returnsItems: AccordionItem[] = [
    {
      title: t("contacts.returns.item1Title"),
      content: (
        <>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item1P1") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item1P2") }} />
          <ul
            style={{ paddingLeft: 20, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: t("contacts.returns.item1List") }}
          />
          <p style={{ margin: 0 }}>{t("contacts.returns.item1P3")}</p>
        </>
      ),
    },
    {
      title: t("contacts.returns.item2Title"),
      content: (
        <>
          <p style={{ margin: 0 }}>{t("contacts.returns.item2P1")}</p>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item2P2") }} />
          <ol
            style={{ paddingLeft: 20, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: t("contacts.returns.item2List") }}
          />
          <p style={{ margin: 0 }}>{t("contacts.returns.item2P3")}</p>
        </>
      ),
    },
    {
      title: t("contacts.returns.item3Title"),
      content: (
        <>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item3P1") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item3P2") }} />
        </>
      ),
    },
    {
      title: t("contacts.returns.item4Title"),
      content: (
        <>
          <p style={{ margin: 0 }}>{t("contacts.returns.item4P1")}</p>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item4P2") }} />
        </>
      ),
    },
    {
      title: t("contacts.returns.item5Title"),
      content: (
        <>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item5P1") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item5P2") }} />
          <ul
            style={{ paddingLeft: 20, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: t("contacts.returns.item5List") }}
          />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item5P3") }} />
        </>
      ),
    },
    {
      title: t("contacts.returns.item6Title"),
      content: (
        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.returns.item6P1") }} />
      ),
    },
  ];

  const deliveryItems: AccordionItem[] = [
    {
      title: t("contacts.delivery.item1Title"),
      content: (
        <>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item1P1") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item1P2") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item1P3") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item1P4") }} />
        </>
      ),
    },
    {
      title: t("contacts.delivery.item2Title"),
      content: (
        <>
          <ul
            style={{ paddingLeft: 20, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item2List") }}
          />
          <p style={{ margin: 0 }}>{t("contacts.delivery.item2P1")}</p>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item2P2") }} />
        </>
      ),
    },
    {
      title: t("contacts.delivery.item3Title"),
      content: (
        <>
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item3P1") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item3P2") }} />
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item3P3") }} />
        </>
      ),
    },
    {
      title: t("contacts.delivery.item4Title"),
      content: (
        <ul
          style={{ paddingLeft: 20, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t("contacts.delivery.item4List") }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* Хлебные крошки (rec1409471471): «Главная / Контакты» */}
      <section style={{ paddingTop: 120 }}>
        <div className="container">
          <style>{`
            .uc-crumb:hover { color: #5c7494 !important; }
          `}</style>
          <nav aria-label={t("contacts.breadcrumbsAria")}>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                margin: 0,
                padding: 0,
                flexWrap: "wrap",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link
                  href="/"
                  className="uc-crumb"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontFamily: "var(--font)",
                    fontWeight: 400,
                    color: "#242424",
                    transition: "color 0.3s ease-in-out",
                  }}
                >
                  <svg
                    className="t758__list-item__icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 11.5L12 4l9 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.5 10v9.5h13V10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("nav.home")}
                </Link>
                <span
                  aria-hidden="true"
                  style={{ fontSize: 12, fontFamily: "var(--font)", color: "#858585" }}
                >
                  /
                </span>
              </li>
              <li>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font)",
                    fontWeight: 500,
                    color: "#5c7494",
                  }}
                >
                  {t("nav.contacts")}
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Заголовок «Контакты» (rec1409471481) */}
      <section style={{ paddingTop: 15 }}>
        <div className="container">
          <h1 className="h-section" style={{ fontSize: 36, color: "#000000" }}>
            {t("nav.contacts")}
          </h1>
        </div>
      </section>

      {/* Контакты + форма (rec1409480781) */}
      <section style={{ paddingTop: 60 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px 40px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  color: "#242424",
                  fontFamily: "var(--font)",
                  lineHeight: 1.55,
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 14, color: "#808080" }}>{t("contacts.phoneLabel")}</span>
                <br />
                +373 794 76 327
                <br />
                <span style={{ fontSize: 14, color: "#808080" }}>{t("contacts.emailLabel")}</span>
                <br />
                anvertextil@gmail.com
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#808080",
                  fontFamily: "var(--font)",
                  marginBottom: 24,
                }}
              >
                mun. Ceadîr-Lunga, str. Cecanov 4B
              </div>
              <ul
                role="list"
                aria-label={t("contacts.socialAria")}
                style={{ listStyle: "none", display: "flex", gap: 12, margin: 0, padding: 0 }}
              >
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="nofollow"
                      aria-label={link.label}
                      style={{ display: "block" }}
                    >
                      {link.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Политика обмена и возврата (rec1409605221) */}
      <section style={{ paddingTop: 120 }}>
        <div className="container">
          <style>{`
            .pol-intro { font-size: 16px; }
            @media screen and (max-width: 479px) { .pol-intro { font-size: 12px; } }
          `}</style>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#000000",
              fontFamily: "var(--font)",
              lineHeight: 1.55,
              marginBottom: 12,
            }}
          >
            {t("contacts.returnsPolicyTitle")}
          </h2>
          <p
            className="pol-intro"
            style={{
              fontWeight: 500,
              color: "#808080",
              fontFamily: "var(--font)",
              lineHeight: 1.55,
              maxWidth: 960,
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: t("contacts.returnsPolicyIntro") }}
          />
        </div>
      </section>

      {/* Аккордеон возврата (rec1409612051) */}
      <section style={{ paddingTop: 30 }} id="returns">
        <div className="container">
          <Accordion items={returnsItems} />
        </div>
      </section>

      {/* Оплата и доставка (rec1500215341) */}
      <section style={{ paddingTop: 60 }} id="delivery">
        <div className="container">
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#000000",
              fontFamily: "var(--font)",
              lineHeight: 1.55,
              marginBottom: 0,
            }}
          >
            {t("footer.delivery")}
          </h2>
        </div>
      </section>

      {/* Аккордеон доставки (rec1500215561) */}
      <section style={{ paddingTop: 30, paddingBottom: 90 }}>
        <div className="container">
          <Accordion items={deliveryItems} />
        </div>
      </section>

      {/* Консультируем по размерам, ткани и наличию (rec1507679391) */}
      <ConsultBlock />
    </div>
  );
}

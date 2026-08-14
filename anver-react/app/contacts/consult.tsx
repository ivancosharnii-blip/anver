"use client";

// Блок «Консультируем по размерам, ткани и наличию».
// Воспроизведён по оригиналу Tilda-сайта (rec1507679391 в site/contacts.html,
// site/feedback.html, site/success.html). Все тексты дословно из оригинала.
import { PhoneIcon, TelegramIcon, WhatsAppIcon, ViberIcon } from "./icons";
import { useLang } from "@/context/LanguageContext";

const AVATAR_SRC =
  "https://static.tildacdn.one/tild3861-6637-4330-b733-616265306533/telegram-peer-photo-.jpg";

export default function ConsultBlock() {
  const { t } = useLang();
  return (
    <section className="section" style={{ paddingTop: 60, paddingBottom: 90 }}>
      <div className="container">
        <div
          style={{
            background: "#f2f2f2",
            border: "1px solid #dedede",
            borderRadius: 8,
            padding: "40px 60px 30px",
          }}
        >
          <style>{`
            .consult-phone:hover { background-color: #3a4f6a !important; }
            @keyframes consult-dot { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            .consult-dot { animation: consult-dot 1.4s ease-in-out infinite; }
            @media screen and (max-width: 639px) {
              .consult-title { font-size: 16px !important; }
              .consult-sub { font-size: 12px !important; }
            }
          `}</style>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 560 }}>
              <h2
                className="consult-title"
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#000000",
                  lineHeight: 1.55,
                  marginBottom: 8,
                }}
              >
                {t("home.consultTitle")}
              </h2>
              <p
                className="consult-sub"
                style={{ fontSize: 16, fontWeight: 400, color: "#000000", opacity: 0.6, lineHeight: 1.55 }}
              >
                {t("home.consultDescr")}
              </p>
            </div>
            <div
              style={{
                background: "#ffffff",
                borderRadius: 4,
                padding: "4px 8px",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 400, color: "#000000", opacity: 0.6, lineHeight: 1.55 }}>
                {t("home.consultNote")}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
              marginTop: 30,
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href="tel:+37378282508"
                className="consult-phone"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#5c7494",
                  border: "1px solid #3a4f6a",
                  borderRadius: 8,
                  padding: "8px 20px",
                  color: "#ffffff",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                }}
              >
                <PhoneIcon size={24} color="#ffffff" />
                <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>078282508</span>
              </a>
              <a
                href="https://wa.me/qr/Y7IWXEYL46C3N1"
                target="_blank"
                rel="nofollow"
                aria-label="WhatsApp"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #dedede",
                  borderRadius: 8,
                  padding: "8px 24px",
                }}
              >
                <WhatsAppIcon size={24} />
              </a>
              <a
                href="https://t.me/+37378282508"
                target="_blank"
                rel="nofollow"
                aria-label="Telegram"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #dedede",
                  borderRadius: 8,
                  padding: "8px 24px",
                }}
              >
                <TelegramIcon size={24} />
              </a>
              <div
                aria-label="Viber"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #dedede",
                  borderRadius: 8,
                  padding: "8px 24px",
                }}
              >
                <ViberIcon size={24} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#000000", lineHeight: 1.3 }}>
                    Максим
                  </span>
                  <span
                    className="consult-dot"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#a4e018",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "#000000", opacity: 0.8, lineHeight: 1.3 }}>
                  {t("home.managerRole")}
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_SRC}
                alt=""
                width={48}
                height={48}
                style={{ borderRadius: 4, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

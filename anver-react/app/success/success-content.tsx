"use client";

import Accordion from "./accordion";
import type { AccordionItem } from "./accordion";
import ConsultBlock from "../contacts/consult";
import { useLang } from "@/context/LanguageContext";

// Содержимое перенесено дословно из site/success.html:
// «Спасибо, ваш заказ принят!» (rec1506615501), «Уход за тканями»
// (rec1506769491 + rec1506769501), «Консультируем…» (rec1507679391).
// Кнопки «На главную» в оригинале нет — убрана.

export default function SuccessContent() {
  const { t } = useLang();

  const careItems: AccordionItem[] = [
    {
      title: t("success.care.ranforceTitle"),
      content: (
        <ul
          style={{ paddingLeft: 20, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t("success.care.ranforceList") }}
        />
      ),
    },
    {
      title: t("success.care.sateenTitle"),
      content: (
        <ul
          style={{ paddingLeft: 20, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t("success.care.sateenList") }}
        />
      ),
    },
    {
      title: t("success.care.stripeTitle"),
      content: (
        <ul
          style={{ paddingLeft: 20, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t("success.care.stripeList") }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* «Спасибо, ваш заказ принят!» (rec1506615501) */}
      <section style={{ paddingTop: 120, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 840 }}>
            <h1
              className="h-section"
              style={{ fontSize: 36, color: "#242424", marginBottom: 20 }}
            >
              {t("success.title")}
            </h1>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#242424",
                fontFamily: "var(--font)",
                lineHeight: 1.55,
                marginBottom: 24,
              }}
            >
              {t("success.subtitle")}
            </p>

            <div style={{ marginBottom: 32 }}>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 500 }}>{t("success.nextTitle")}</span>
              </p>
              <ol style={{ paddingLeft: 20, margin: "0 0 0 0" }}>
                <li>{t("success.nextStep1")}</li>
                <li>{t("success.nextStep2")}</li>
              </ol>
            </div>

            <div>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 500 }}>{t("success.fixTitle")}</span>
              </p>
              <p style={{ margin: 0 }}>{t("success.fixText")}</p>
              <p style={{ margin: 0 }}>
                {t("success.phoneLabel")}{" "}
                <a
                  href="tel:+37378282508"
                  style={{
                    borderBottom: "1px solid rgb(36, 36, 36)",
                    boxShadow: "none",
                    textDecoration: "none",
                  }}
                >
                  +373 78 28 25 08
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Уход за тканями (rec1506769491 + rec1506769501) */}
      <section style={{ paddingTop: 60, paddingBottom: 0 }}>
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
            {t("success.careTitle")}
          </h2>
        </div>
      </section>

      <section style={{ paddingTop: 30, paddingBottom: 90 }}>
        <div className="container">
          <Accordion items={careItems} />
        </div>
      </section>

      {/* Консультируем по размерам, ткани и наличию (rec1507679391) */}
      <ConsultBlock />
    </div>
  );
}

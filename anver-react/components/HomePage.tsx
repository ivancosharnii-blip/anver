"use client";

import CatalogSection from "./CatalogSection";
import { IMAGES } from "@/lib/site";
import { useLang } from "@/context/LanguageContext";

// Преимущества — rec1496187971 (десктоп) / rec1496286691 (мобильный):
// белый текст 12px поверх нижней части hero-изображения, иконки 36px (28px на мобильных),
// внизу hero — градиентная подложка 80px (rgba(0,0,0,0.2) → прозрачный).
const ADVANTAGES = [
  { icon: IMAGES.deliveryIcon, lines: ["home.advDelivery", "home.advDeliverySub"] },
  { icon: IMAGES.moldovaIcon, lines: ["home.advHandmade", "home.advHandmadeSub"] },
  { icon: IMAGES.syncIcon, lines: ["home.advReturns", "home.advReturnsSub"] },
  { icon: IMAGES.oekoIcon, lines: ["home.advCotton", "home.advCottonSub"] },
];

// Кнопки связи — rec1507679391: телефон (заливка #5c7494, номер +373 794 76 327),
// WhatsApp/Telegram/Viber — белые с рамкой #dedede, только иконки.
const CONTACT_BUTTONS = [
  {
    label: "+373 794 76 327",
    href: "tel:+37379476327",
    external: false,
    icon: "https://static.tildacdn.one/tild3833-3332-4065-a631-636137383066/icons8-call-90.png",
    filled: true,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/qr/Y7IWXEYL46C3N1",
    external: true,
    icon: "https://static.tildacdn.one/tild3166-3662-4665-b830-353239333965/icons8-whatsapp-100.png",
    filled: false,
  },
  {
    label: "Telegram",
    href: "https://t.me/+37379476327",
    external: true,
    icon: "https://static.tildacdn.one/tild3561-3539-4135-a230-303239356461/icons8-telegram-100.png",
    filled: false,
  },
  {
    label: "Viber",
    href: "viber://chat?number=%2B37379476327",
    external: false,
    icon: "https://static.tildacdn.one/tild6635-3535-4930-a433-323734323465/icons8-viber-100.png",
    filled: false,
  },
];

// Блок рейтинга rec1506370021: 98px, фон #ffffff, внизу полоса #e9eef4 30px,
// «★★★★★» (#d59c3f, 14px) + «Уже больше 800 довольных клиентов!» (#3a4f6a, 12px), по центру.
// На главной стоит под hero-секцией (по просьбе — не над шапкой, а ниже).
function RatingBar() {
  const { t } = useLang();
  return (
    <div className="anv-rating" aria-hidden="false">
      <style>{`
        .anv-rating {
          position: relative;
          height: 98px;
          background: #ffffff;
        }
        .anv-rating__inner {
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
        .anv-rating__stars {
          color: #d59c3f;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.55;
        }
        .anv-rating__text {
          color: #3a4f6a;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.55;
        }
        .anv-rating__strip {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 30px;
          background: #e9eef4;
        }
      `}</style>
      <div className="anv-rating__inner">
        <span className="anv-rating__stars">★★★★★</span>
        <span className="anv-rating__text">{t("home.rating")}</span>
      </div>
      <div className="anv-rating__strip" />
    </div>
  );
}

export default function HomePage() {
  const { t } = useLang();

  const aboutParagraphs = t("home.aboutText").split("\n\n");

  return (
    <>
      <style>{`
        /* Hero — t001 (rec1385544051): контент по центру, 720px (главное фото с постелью — увеличено в высоту по просьбе) */
        .anv-hero {
          position: relative;
          width: 100%;
          height: 720px;
          background-image: url(${IMAGES.heroBg});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
        }
        .anv-hero__filter {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(41,18,5,0.20), rgba(41,18,5,0.20));
        }
        .anv-hero__bottom-shade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 80px;
          opacity: 0.2;
          background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          pointer-events: none;
        }
        .anv-hero__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          text-align: center;
          padding: 0 10px;
        }
        .anv-hero__title {
          color: #fff;
          letter-spacing: 0.5px;
          font-size: 72px;
          line-height: 1.17;
          font-weight: 700;
          padding: 24px 0 38px;
        }
        .anv-hero__descr {
          color: #fff;
          font-size: 24px;
          line-height: 1.5;
          font-weight: 400;
          max-width: 700px;
          margin: 0 auto;
          padding: 0 0 60px;
        }
        .anv-hero__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1ch;
          height: 50px;
          padding: 0 44px;
          background: #ffffff;
          color: #242424;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .anv-hero__btn:hover {
          background: #f2f2f2;
        }
        .anv-hero__btn-icon {
          width: 21px;
          height: 21px;
          flex-shrink: 0;
          background-image: url(https://static.tildacdn.one/lib/icons/tilda/-/paint/242424--3-0-100/discount_percent_benefit_offer.svg);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .anv-hero__advantages {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 20px;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .anv-hero__adv {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .anv-hero__adv img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .anv-hero__adv-text {
          color: #ffffff;
          font-size: 12px;
          line-height: 1.55;
          font-weight: 400;
          text-align: left;
        }
        @media (max-width: 1200px) {
          .anv-hero__title { font-size: 68px; }
          .anv-hero__descr { font-size: 22px; }
        }
        @media (max-width: 960px) {
          .anv-hero__advantages { grid-template-columns: repeat(2, 1fr); gap: 16px 24px; }
        }
        @media (max-width: 640px) {
          .anv-hero__title { font-size: 32px; }
          .anv-hero__descr { font-size: 20px; line-height: 1.4; padding-bottom: 30px; }
          .anv-hero__advantages { gap: 12px 16px; bottom: 12px; }
          .anv-hero__adv img { width: 28px; height: 28px; }
          .anv-hero__adv { gap: 12px; }
        }
        @media (max-width: 480px) {
          .anv-hero__title { font-size: 30px; }
        }

        /* О нас — rec1390182871: заголовок 24px/500, текст 16px #000 opacity 0.6 */
        .anv-about {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 60px;
          align-items: start;
        }
        .anv-about__left { max-width: 749px; }
        .anv-about__title {
          font-size: 24px;
          font-weight: 500;
          color: #000000;
          line-height: 1.23;
          margin-bottom: 16px;
        }
        .anv-about__text {
          font-size: 16px;
          line-height: 1.55;
          color: #000000;
          opacity: 0.6;
          font-weight: 400;
        }
        .anv-about__img-wide {
          margin-top: 40px;
          border-radius: 8px;
          width: 100%;
          max-width: 760px;
          height: auto;
        }
        .anv-about__img-tall {
          border-radius: 8px;
          width: 360px;
          max-width: 100%;
          height: auto;
        }
        @media (max-width: 960px) {
          .anv-about { grid-template-columns: 1fr; }
          .anv-about__img-tall { width: 100%; }
        }

        /* Контакты — rec1507679391: карточка #f2f2f2, рамка #dedede, radius 8 */
        .anv-contacts { background: #ffffff; padding: 0 0 60px; }
        .anv-contacts__card {
          background: #f2f2f2;
          border: 1px solid #dedede;
          border-radius: 8px;
          padding: 40px 60px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .anv-contacts__title {
          font-size: 24px;
          font-weight: 500;
          color: #000000;
          line-height: 1.55;
        }
        .anv-contacts__descr {
          margin-top: 8px;
          font-size: 16px;
          color: #000000;
          opacity: 0.6;
          line-height: 1.55;
        }
        .anv-contacts__buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 28px;
        }
        .anv-contacts__btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          height: 42px;
          padding: 0 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .anv-contacts__btn img { width: 24px; height: 24px; }
        .anv-contacts__btn_filled {
          background: #5c7494;
          color: #ffffff;
          padding: 0 20px;
        }
        .anv-contacts__btn_filled:hover { background: #3a4f6a; }
        .anv-contacts__btn_outline {
          background: #ffffff;
          color: #242424;
          border: 1px solid #dedede;
          padding: 0 24px;
        }
        .anv-contacts__btn_outline:hover { border-color: #5c7494; }
        .anv-contacts__right { display: flex; flex-direction: column; align-items: flex-end; gap: 28px; }
        .anv-contacts__note {
          font-size: 12px;
          color: #000000;
          opacity: 0.6;
          line-height: 1.55;
          white-space: nowrap;
        }
        .anv-contacts__manager { display: flex; align-items: center; gap: 16px; }
        .anv-contacts__manager-info { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .anv-contacts__manager-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          line-height: 1.3;
        }
        .anv-contacts__manager-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #a4e018;
          flex-shrink: 0;
        }
        .anv-contacts__manager-role {
          font-size: 12px;
          color: #000000;
          opacity: 0.8;
          line-height: 1.3;
        }
        @media (max-width: 960px) {
          .anv-contacts__card { flex-direction: column; }
          .anv-contacts__right { align-items: flex-start; }
          .anv-contacts__manager-info { align-items: flex-start; }
        }
      `}</style>

      {/* Рейтинг «800 довольных клиентов» — под шапкой, над hero (rec1506370021) */}
      <RatingBar />

      {/* 1. Hero + преимущества поверх низа */}
      <section className="anv-hero">
        <div className="anv-hero__filter" />
        <div className="anv-hero__bottom-shade" />

        <div className="anv-hero__inner">
          <h1 className="anv-hero__title">{t("home.heroTitle")}</h1>
          <p className="anv-hero__descr">{t("home.heroDescr")}</p>
          <a href="#bedding" className="anv-hero__btn">
            <span className="anv-hero__btn-icon" aria-hidden="true" />
            <span>{t("home.heroBtn")}</span>
          </a>
        </div>

        <div className="anv-hero__advantages">
          {ADVANTAGES.map((item) => (
            <div key={item.lines[0]} className="anv-hero__adv">
              <img src={item.icon} alt="" />
              <div className="anv-hero__adv-text">
                {t(item.lines[0])}
                <br />
                {t(item.lines[1])}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2-4. Каталоги */}
      <CatalogSection
        storepart={387894771902}
        title={t("home.catRanforce")}
        description={t("home.catRanforceDescr")}
        anchor="bedding"
      />
      <CatalogSection
        storepart={377460312512}
        title={t("home.catSateen")}
        description={t("home.catSateenDescr")}
        anchor="bedding-sateen"
      />
      <CatalogSection
        storepart={330859305352}
        title={t("home.catStripe")}
        description={t("home.catStripeDescr")}
        anchor="bedding-stripe"
      />

      {/* 5. Немного о нас */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="anv-about">
            <div className="anv-about__left">
              <h2 className="anv-about__title">{t("home.aboutTitle")}</h2>
              <div className="anv-about__text">
                {aboutParagraphs.map((paragraph, idx) => (
                  <p key={idx} style={idx > 0 ? { marginTop: 24 } : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <img
                src="https://static.tildacdn.one/tild3663-6534-4362-a162-653230373664/84948565_10212897115.jpg"
                alt="Семейное производство постельного белья Anver"
                className="anv-about__img-wide"
              />
            </div>
            <div>
              <img
                src="https://static.tildacdn.one/tild3431-3662-4130-a239-386235636535/122091802_1224158167.jpg"
                alt="Семейное производство постельного белья Anver"
                className="anv-about__img-tall"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Консультация */}
      <section className="anv-contacts">
        <div className="container">
          <div className="anv-contacts__card">
            <div>
              <h2 className="anv-contacts__title">{t("home.consultTitle")}</h2>
              <p className="anv-contacts__descr">{t("home.consultDescr")}</p>
              <div className="anv-contacts__buttons">
                {CONTACT_BUTTONS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`anv-contacts__btn ${
                      link.filled
                        ? "anv-contacts__btn_filled"
                        : "anv-contacts__btn_outline"
                    }`}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <img src={link.icon} alt="" aria-hidden="true" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="anv-contacts__right">
              <p className="anv-contacts__note">{t("home.consultNote")}</p>
              <div className="anv-contacts__manager">
                <div className="anv-contacts__manager-info">
                  <div className="anv-contacts__manager-name">
                    Вера
                    <span className="anv-contacts__manager-dot" />
                  </div>
                  <div className="anv-contacts__manager-role">
                    {t("home.managerRole")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { CONTACTS } from "@/lib/site";

// Оригинал: t898 (rec1460420401). Главная кнопка — круг 60px #3a4f6a с Call_Icon_White.svg,
// bottom 50px / right 65px. При открытии фон становится белым, показывается крестик.
// Вверх выезжают 3 круга 50px: Phone (чёрный), Telegram (#1d98dc), WhatsApp (белый круг + #27D061).
// Подсказки «Phone/Telegram/WhatsApp» — только при наведении (белая, текст #808080).

const BUTTONS = [
  { key: "phone", label: "Phone", href: CONTACTS.phoneLink },
  { key: "telegram", label: "Telegram", href: CONTACTS.telegram },
  { key: "whatsapp", label: "WhatsApp", href: CONTACTS.whatsappQr },
] as const;

const PHONE_D =
  "M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM50.0089 29H51.618C56.4915 29.0061 61.1633 30.9461 64.6073 34.3938C68.0512 37.8415 69.9856 42.5151 69.9856 47.3879V48.9968C69.9338 49.5699 69.6689 50.1027 69.2433 50.49C68.8177 50.8772 68.2623 51.0908 67.6868 51.0884H67.5029C66.8966 51.0358 66.3359 50.745 65.9437 50.2796C65.5516 49.8143 65.36 49.2124 65.4109 48.6061V47.3879C65.4109 43.7303 63.9578 40.2225 61.3711 37.6362C58.7844 35.0499 55.2761 33.597 51.618 33.597H50.3997C49.79 33.6488 49.1847 33.4563 48.7169 33.0619C48.2492 32.6675 47.9573 32.1035 47.9054 31.4939C47.8536 30.8843 48.0461 30.279 48.4406 29.8114C48.835 29.3437 49.3992 29.0518 50.0089 29ZM56.889 49.0132C56.4579 48.5821 56.2157 47.9975 56.2157 47.3879C56.2157 46.1687 55.7313 44.9994 54.869 44.1373C54.0068 43.2752 52.8374 42.7909 51.618 42.7909C51.0083 42.7909 50.4236 42.5488 49.9925 42.1177C49.5614 41.6867 49.3192 41.102 49.3192 40.4924C49.3192 39.8828 49.5614 39.2982 49.9925 38.8672C50.4236 38.4361 51.0083 38.1939 51.618 38.1939C54.0568 38.1939 56.3956 39.1626 58.1201 40.8868C59.8445 42.611 60.8133 44.9495 60.8133 47.3879C60.8133 47.9975 60.5711 48.5821 60.14 49.0132C59.7089 49.4442 59.1242 49.6864 58.5145 49.6864C57.9048 49.6864 57.3201 49.4442 56.889 49.0132ZM66.4011 69.0663L66.401 69.0846C66.3999 69.5725 66.2967 70.0547 66.0981 70.5003C65.8998 70.9451 65.611 71.3435 65.2499 71.67C64.8674 72.0182 64.4123 72.2771 63.9176 72.428C63.4516 72.5702 62.9613 72.6132 62.4782 72.5546C58.2475 72.53 53.4102 70.5344 49.1802 68.1761C44.8871 65.7827 41.0444 62.915 38.8019 60.9903L38.7681 60.9613L38.7367 60.9299C32.3303 54.5198 28.2175 46.1735 27.0362 37.186C26.9623 36.6765 27.0018 36.157 27.1519 35.6645C27.3027 35.1695 27.5615 34.7142 27.9094 34.3314C28.2397 33.9658 28.6436 33.6742 29.0944 33.4757C29.5447 33.2775 30.0316 33.1766 30.5234 33.1796H37.4967C38.299 33.1636 39.0826 33.4244 39.7156 33.9184C40.3527 34.4156 40.7979 35.1184 40.9754 35.9071L41.0038 36.0335V36.1631C41.0038 36.4901 41.0787 36.795 41.1847 37.2268C41.2275 37.4012 41.2755 37.5965 41.3256 37.8221L41.326 37.8238C41.583 38.9896 41.925 40.1351 42.3491 41.251L42.7322 42.259L38.4899 44.26L38.4846 44.2625C38.204 44.3914 37.986 44.6263 37.8784 44.9157L37.8716 44.934L37.8642 44.952C37.7476 45.236 37.7476 45.5545 37.8642 45.8385L37.9144 45.9608L37.9359 46.0912C38.0802 46.9648 38.5603 48.0981 39.4062 49.4169C40.243 50.7215 41.3964 52.1437 42.808 53.5872C45.6206 56.4634 49.3981 59.3625 53.5798 61.5387C53.8533 61.6395 54.1552 61.6343 54.4257 61.5231L54.4437 61.5157L54.462 61.5089C54.7501 61.4016 54.9842 61.1848 55.1133 60.9057L55.1148 60.9023L57.0232 56.6591L58.0397 57.03C59.1934 57.4509 60.3737 57.7947 61.5729 58.0592L61.5785 58.0605L61.5841 58.0618C62.152 58.1929 62.7727 58.3042 63.3802 58.3942L63.4231 58.4006L63.4654 58.4101C64.2537 58.5877 64.956 59.0332 65.453 59.6706C65.9429 60.2991 66.2033 61.0758 66.1916 61.8721L66.4011 69.0663Z";

const TG_D =
  "M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z";

const WA_D =
  "M25 50a25 25 0 100-50 25 25 0 000 50zM26.1 12a12.1 12.1 0 00-10.25 18.53l.29.46-1.22 4.46 4.57-1.2.45.27a12.1 12.1 0 106.16-22.51V12zm6.79 17.22c-.3.85-1.72 1.62-2.41 1.72-.62.1-1.4.14-2.25-.14-.7-.22-1.37-.47-2.03-.77-3.59-1.57-5.93-5.24-6.1-5.48-.19-.24-1.47-1.97-1.47-3.76 0-1.79.93-2.67 1.25-3.03.33-.37.72-.46.96-.46.23 0 .47 0 .68.02.22 0 .52-.09.8.62l1.1 2.7c.1.18.16.4.04.64s-.18.39-.36.6c-.18.21-.38.47-.54.64-.18.18-.36.38-.15.74.2.36.92 1.55 1.98 2.52 1.37 1.23 2.52 1.62 2.88 1.8.35.18.56.15.77-.1.2-.23.9-1.05 1.13-1.42.24-.36.48-.3.8-.18.33.12 2.09 1 2.44 1.18.36.19.6.28.69.43.09.15.09.88-.21 1.73z";

const WA_BG_D =
  "M25 0a25 25 0 100 50 25 25 0 000-50zm1.03 38.37c-2.42 0-4.8-.6-6.9-1.76l-7.67 2 2.05-7.45a14.3 14.3 0 01-1.93-7.2c0-7.92 6.49-14.38 14.45-14.38a14.4 14.4 0 110 28.79z";

function Icon({ name, size = 50 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 100 100", fill: "none" } as const;
  switch (name) {
    case "phone":
      return (
        <svg {...common} aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d={PHONE_D} fill="#000" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common} aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d={TG_D} fill="#1d98dc" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} aria-hidden="true">
          <path d={WA_D} fill="#fff" />
          <path d={WA_D} fill="#27D061" />
          <path d={WA_BG_D} fill="#27D061" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .fb-main {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3a4f6a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease-in-out;
          position: relative;
          overflow: hidden;
        }
        .fb-main:hover { box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.4); }
        .fb-main[data-open="true"] { background: #fff !important; }
        .fb-main__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transition: all 0.2s linear;
        }
        .fb-main[data-open="true"] .fb-main__bg { opacity: 0; visibility: hidden; }
        .fb-main__close {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #242424;
          opacity: 0;
          visibility: hidden;
          transform: scale(0.1);
          transition: all 0.2s ease-in-out;
        }
        .fb-main[data-open="true"] .fb-main__close {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }
        .fb-item {
          position: relative;
          display: block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
          opacity: 0;
          visibility: hidden;
          transition: all 0.25s ease-in-out;
        }
        .fb-item:nth-of-type(1) { transform: translateY(0); }
        .fb-item:nth-of-type(2) { transform: translateY(0); }
        .fb-item:nth-of-type(3) { transform: translateY(0); }
        .fb-list[data-open="true"] .fb-item { opacity: 1; visibility: visible; }
        .fb-list[data-open="true"] .fb-item:nth-of-type(1) { transform: translateY(-135%); transition-delay: 0.1s; }
        .fb-list[data-open="true"] .fb-item:nth-of-type(2) { transform: translateY(-270%); transition-delay: 0.05s; }
        .fb-list[data-open="true"] .fb-item:nth-of-type(3) { transform: translateY(-405%); }
        .fb-item:hover { box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.4); }
        .fb-item__tip {
          position: absolute;
          top: 50%;
          right: 70px;
          transform: translateY(-50%);
          white-space: nowrap;
          padding: 9px 13px;
          font-size: 15px;
          border-radius: 3px;
          background: #ffffff;
          color: #808080;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all 0.1s linear;
        }
        .fb-item__tip::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border: solid transparent;
          border-width: 10px;
          top: 50%;
          right: -20px;
          transform: translateY(-50%);
          border-left-color: #ffffff;
        }
        .fb-item:hover .fb-item__tip { opacity: 1; visibility: visible; }
        .fb-svg-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          background-color: #fff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 50,
          right: 65,
          zIndex: 100000,
          pointerEvents: "none",
        }}
      >
        <div className="fb-list" data-open={open}>
          {BUTTONS.map((button) => (
            <a
              key={button.key}
              className="fb-item"
              href={button.href}
              {...(button.key === "phone"
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              style={{ pointerEvents: open ? "auto" : "none" }}
            >
              <span className="fb-item__tip">{button.label}</span>
              <span className="fb-svg-bg" />
              <Icon name={button.key} />
            </a>
          ))}
        </div>

        <button
          type="button"
          className="fb-main"
          data-open={open}
          onClick={() => setOpen((o) => !o)}
          aria-label="Связаться с нами"
          aria-expanded={open}
          style={{ pointerEvents: "auto" }}
        >
          <span
            className="fb-main__bg"
            style={{
              backgroundImage:
                "url(https://static.tildacdn.one/tild3239-3961-4164-b639-326432373634/Call_Icon_White.svg)",
            }}
          />
          <span className="fb-main__close">
            <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
              <g fillRule="evenodd">
                <path d="M10.314 -3.686H12.314V26.314H10.314z" transform="rotate(-45 11.314 11.314)" />
                <path d="M10.314 -3.686H12.314V26.314H10.314z" transform="rotate(45 11.314 11.314)" />
              </g>
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}

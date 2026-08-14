// Перевод товаров (данных, не UI) на румынский язык (Молдова).
// Ключ записи в productRo — числовой uid товара из lib/products.ts.
// HTML-разметка (div/span/br) и символы ✓ / ⓘ сохранены как в оригинале.
// Названия цветов и бренды (Ranforce, Satin, Anver) не переводятся.

export type ProductRo = { title?: string; text?: string; descr?: string };

// перевод по uid товара
export const productRo: Record<number, ProductRo> = {
  // ── Ранфорс (Ranforce) ────────────────────────────────────────────────
  745921079202: {
    title: "Husă de pilota",
    text:
      "Lenjerie delicată, ușoară și respirabilă din 100% bumbac Ranforce – pentru cei care prețuiesc confortul natural și senzația de prospețime.<br />Țesătura are un ușor foșnet și o suprafață mată, răcoroasă la atingere și plăcută pentru piele. Ea rămâne netedă și curată chiar și după zeci de spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie întotdeauna confortabil, durabil și cu adevărat ca acasă.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes"><span style="font-weight: 400; color: rgb(128, 128, 128);">Ranforce</span></div>',
  },
  413013353812: {
    title: "Cearșaf",
    text:
      "Lenjerie delicată, ușoară și respirabilă din 100% bumbac Ranforce – pentru cei care prețuiesc confortul natural și senzația de prospețime.<br />Țesătura are un ușor foșnet și o suprafață mată, răcoroasă la atingere și plăcută pentru piele. Ea rămâne netedă și curată chiar și după zeci de spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie întotdeauna confortabil, durabil și cu adevărat ca acasă.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes"><span style="font-weight: 400; color: rgb(128, 128, 128);">Ranforce</span></div>',
  },
  559109497162: {
    title: "Fețe de pernă",
    text:
      "Lenjerie delicată, ușoară și respirabilă din 100% bumbac Ranforce – pentru cei care prețuiesc confortul natural și senzația de prospețime.<br />Țesătura are un ușor foșnet și o suprafață mată, răcoroasă la atingere și plăcută pentru piele. Ea rămâne netedă și curată chiar și după zeci de spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie întotdeauna confortabil, durabil și cu adevărat ca acasă.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes"><span style="font-weight: 400; color: rgb(128, 128, 128);">Ranforce</span></div>',
  },
  509058731492: {
    title: "Set de lenjerie de pat din Ranforce",
    text:
      "Lenjeria de pat din 100% bumbac Ranforce – delicată, ușoară și respirabilă, creată pentru cei care prețuiesc confortul natural și senzația de prospețime. Țesătura are un ușor foșnet și o suprafață mată, răcoroasă la atingere și plăcută pentru piele. Ea rămâne netedă și curată chiar și după zeci de spălări, păstrând un aspect îngrijit și moliciunea. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie confortabil, durabil și cu adevărat ca acasă.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde. <br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr: '<div style="font-size: 14px;" data-customstyle="yes"></div>',
  },

  // ── Сатин (Satin) ─────────────────────────────────────────────────────
  565706235402: {
    title: "Set de lenjerie de pat",
    text:
      "Lenjeria de pat din 100% bumbac Satin – netedă, moale și cu un luciu nobil. Ea îmbină rezistența cu mătăsositatea, oferind o senzație de confort și de răcoare ușoară. Țesătura satinată, densă, face materialul rezistent la uzură și la spălări frecvente, păstrând forma și intensitatea culorii. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie perfect neted, durabil și cu adevărat ca acasă.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde. <br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin</div>',
  },
  442866643102: {
    title: "Cearșaf",
    text:
      "Lenjeria de pat din 100% bumbac Satin – netedă, moale și cu un luciu nobil. Ea îmbină rezistența cu mătăsositatea, oferind o senzație de confort și de răcoare ușoară. Țesătura satinată, densă, face materialul rezistent la uzură și la spălări frecvente, păstrând forma și intensitatea culorii. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie perfect neted, durabil și cu adevărat ca acasă.<br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin</div>',
  },
  385522014892: {
    title: "Fețe de pernă",
    text:
      "Lenjeria de pat din 100% bumbac Satin – netedă, moale și cu un luciu nobil. Ea îmbină rezistența cu mătăsositatea, oferind o senzație de confort și de răcoare ușoară. Țesătura satinată, densă, face materialul rezistent la uzură și la spălări frecvente, păstrând forma și intensitatea culorii. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie perfect neted, durabil și cu adevărat ca acasă.<br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin</div>',
  },
  485227950472: {
    title: "Husă de pilota",
    text:
      "Lenjeria de pat din 100% bumbac Satin – netedă, moale și cu un luciu nobil. Ea îmbină rezistența cu mătăsositatea, oferind o senzație de confort și de răcoare ușoară. Țesătura satinată, densă, face materialul rezistent la uzură și la spălări frecvente, păstrând forma și intensitatea culorii. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să fie perfect neted, durabil și cu adevărat ca acasă.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde. <br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin</div>',
  },

  // ── Сатин Страйп (Satin Stripe) ───────────────────────────────────────
  585012466922: {
    title: "Set de lenjerie de pat",
    text:
      "Lenjeria de pat din 100% bumbac Satin Stripe – o combinație elegantă de luciu și textură. Netezimea moale a satinului este completată de dungi delicate, care creează un joc rafinat de lumină și un efect de ușoară volumetrie. Țesătura este plăcută pentru piele, respirabilă și răcoroasă la atingere, păstrând totodată rezistența și forma chiar și după numeroase spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să arate impecabil și să ofere o senzație de confort liniștit.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde.<br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin Stripe</div>',
  },
  627145228782: {
    title: "Cearșaf",
    text:
      "Lenjeria de pat din 100% bumbac Satin Stripe – o combinație elegantă de luciu și textură. Netezimea moale a satinului este completată de dungi delicate, care creează un joc rafinat de lumină și un efect de ușoară volumetrie. Țesătura este plăcută pentru piele, respirabilă și răcoroasă la atingere, păstrând totodată rezistența și forma chiar și după numeroase spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să arate impecabil și să ofere o senzație de confort liniștit.<br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin Stripe</div>',
  },
  665933501622: {
    title: "Fețe de pernă",
    text:
      "Lenjeria de pat din 100% bumbac Satin Stripe – o combinație elegantă de luciu și textură. Netezimea moale a satinului este completată de dungi delicate, care creează un joc rafinat de lumină și un efect de ușoară volumetrie. Țesătura este plăcută pentru piele, respirabilă și răcoroasă la atingere, păstrând totodată rezistența și forma chiar și după numeroase spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să arate impecabil și să ofere o senzație de confort liniștit.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde.<br /><br />ⓘ Nuanța țesăturii poate varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin Stripe</div>',
  },
  816996603712: {
    title: "Husă de pilota",
    text:
      "Lenjeria de pat din 100% bumbac Satin Stripe – o combinație elegantă de luciu și textură. Netezimea moale a satinului este completată de dungi delicate, care creează un joc rafinat de lumină și un efect de ușoară volumetrie. Țesătura este plăcută pentru piele, respirabilă și răcoroasă la atingere, păstrând totodată rezistența și forma chiar și după numeroase spălări. Fiecare produs îl coasem manual la Ceadîr-Lunga, cu atenție la detalii, pentru ca așternutul să arate impecabil și să ofere o senzație de confort liniștit.<br /><br />✓ Husa de pilota este prevăzută cu fermoar de la un capăt la altul și cu o clapetă îngrijită care îl ascunde.<br /><br />ⓘ Nuanța țesăturii și direcția dungilor pot varia ușor din cauza luminii și a setărilor ecranului.",
    descr:
      '<div style="font-size: 14px;" data-customstyle="yes">Satin Stripe</div>',
  },
};

// перевод бейджей скидок
export const productMarkRo: Record<string, string> = {
  "Выгода 10%": "Reducere 10%",
  "Выгода 20%": "Reducere 20%",
};

// перевод названий опций
export const optionTitleRo: Record<string, string> = {
  Цвет: "Culoare",
};

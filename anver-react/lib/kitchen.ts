import type { Product } from "./products";

/**
 * Раздел «Кухня» — скатерти.
 *
 * 4 карточки = 4 расцветки (коллекции). У каждой скатерти одинаковый набор
 * размеров (sizeOptions) с собственной ценой: при выборе размера на карточке
 * и в модалке цена обновляется. Выбранный размер попадает в корзину и в
 * уведомление заказа в Telegram (options.size).
 *
 * У каждой карточки 2 фото:
 *   gallery[0] — чистая скатерть (фото на карточке)
 *   gallery[1] — сервированная композиция (салфетки, стаканы) — при наведении.
 * Фото в /public/kitchen/ (kitchen-N-main.png / kitchen-N-hover.png).
 */

/** Общий набор размеров скатертей с ценами. */
const SIZES = [
  { label: "1,20×1,80", price: 300 },
  { label: "1,80×2,20", price: 400 },
  { label: "Ø 1,80", price: 350 },
  { label: "1,80×3,00", price: 500 },
];

const COMMON_TEXT =
  "Скатерть ручной работы из плотного 100% хлопка — тёплая, приятная на ощупь и прочная.<br />" +
  "Красивая кантовка по краю, аккуратная строчка и натуральная ткань, которая выдерживает частые стирки и долго сохраняет вид.<br />" +
  "Каждое изделие мы шьём вручную в Чадыр-Лунге, с вниманием к деталям, чтобы ваш стол выглядел опрятно и уютно каждый день.<br />" +
  "Доступно несколько размеров — подберите удобный под ваш стол.";

/** Карта соответствия: imgIndex main → номер hover-файла */
const HOVER_MAP: Record<number, number> = { 1: 3, 2: 4, 3: 2, 4: 1 };

function kitchen(title: string, uid: number, imgIndex: number): Product {
  const hoverIdx = HOVER_MAP[imgIndex];
  return {
    uid,
    title,
    url: "/kitchen",
    price: SIZES[0].price, // базовая цена (первый размер); обновляется при выборе
    priceold: null,
    mark: "",
    text: COMMON_TEXT,
    descr: "",
    gallery: [
      `/kitchen/kitchen-${imgIndex}-main.png`,
      `/kitchen/kitchen-${hoverIdx}-hover.png`,
    ],
    json_options: [],
    sizeOptions: SIZES,
    partuids: [],
    storepart: 0,
    fabric: "Хлопок",
    category: "Кухня",
  };
}

export const kitchenProducts: Product[] = [
  kitchen("Лаванда", 90001, 1),
  kitchen("Прованс", 90002, 2),
  kitchen("Шато", 90003, 3),
  kitchen("Лимонный сад", 90004, 4),
];

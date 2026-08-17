"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
  uid: number;
  title: string;
  price: number;
  mark?: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  addItem: (
    product: Product,
    color?: string,
    quantity?: number,
    size?: string,
  ) => void;
  removeItem: (uid: number) => void;
  updateQuantity: (uid: number, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (product: Product, color?: string, quantity = 1, size?: string) => {
      setItems((prev) => {
        // Цена позиции = цена выбранного размера (если есть sizeOptions), иначе базовая.
        const chosen = product.sizeOptions?.find((s) => s.label === size);
        const price = chosen ? chosen.price : product.price;

        const idx = prev.findIndex(
          (i) => i.uid === product.uid && i.color === color && i.size === size,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            uid: product.uid,
            title: product.title,
            price,
            mark: product.mark,
            image: product.gallery[0] ?? "",
            color,
            size,
            quantity,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((uid: number) => {
    setItems((prev) => prev.filter((i) => i.uid !== uid));
  }, []);

  const updateQuantity = useCallback((uid: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.uid !== uid)
        : prev.map((i) => (i.uid === uid ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      openCart,
      closeCart,
    }),
    [items, isOpen, addItem, removeItem, updateQuantity, clear, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function formatPrice(amount: number): string {
  return `${amount} MDL`;
}

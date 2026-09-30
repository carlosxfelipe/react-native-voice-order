/**
 * stores/cart-store.ts
 *
 * Store do carrinho usando Zustand.
 * Acumulação de itens reconhecidos pelo parser de voz.
 */

import { create } from "zustand";

import type { Product } from "@/services/voice-order/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Total de unidades no carrinho. */
  totalItems: number;
  /** Valor total do carrinho. */
  totalPrice: number;
  /** Adiciona ou incrementa um item pelo produto. */
  addItem: (product: Product, quantity?: number) => void;
  /** Remove uma unidade. Se chegar a 0, remove o item. */
  removeItem: (productId: string) => void;
  /** Remove o item inteiro. */
  deleteItem: (productId: string) => void;
  /** Esvazia o carrinho. */
  clearCart: () => void;
}

function computeTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  };
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      const items = existing
        ? state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [...state.items, { product, quantity }];
      return { items, ...computeTotals(items) };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = state.items
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
      return { items, ...computeTotals(items) };
    }),

  deleteItem: (productId) =>
    set((state) => {
      const items = state.items.filter((i) => i.product.id !== productId);
      return { items, ...computeTotals(items) };
    }),

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));

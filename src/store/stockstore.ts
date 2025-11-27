import { create } from "zustand";
import type { Stock } from "../types/Stock";

type StockState = {
  stocks: Record<number, Stock>;
  setStock: (s: Stock) => void;
};

export const useStockStore = create<StockState>((set) => ({
  stocks: {},
  setStock: (s) => set((st) => ({ stocks: { ...st.stocks, [s.productId]: s } })),
}));

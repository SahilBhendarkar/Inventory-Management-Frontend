import { create } from "zustand";
import type { Product } from "../types/Product";

type ProductState = {
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProductLocal: (p: Product) => void;
  removeProductLocal: (id: number) => void;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (p) => set({ products: p }),
  addProductLocal: (p) => set((s) => ({ products: [...s.products, p] })),
  removeProductLocal: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
}));

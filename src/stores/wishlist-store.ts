import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";

interface WishlistStoreState {
  items: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product: Product) => {
        const current = get().items;
        const exists = current.some((p) => p.id === product.id);

        if (exists) {
          set({ items: current.filter((p) => p.id !== product.id) });
          return false;
        } else {
          set({ items: [...current, product] });
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((p) => p.id === productId);
      },

      removeFromWishlist: (productId: string) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "saubhagya-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Coupon } from "@/types/cart";
import { Product } from "@/types/product";
import { ShippingMethodType } from "@/types/checkout";
import { DEMO_COUPONS } from "@/data/coupons";
import { calculateCartTotals } from "@/lib/cart-calculations";

interface CartStoreState {
  items: CartItem[];
  activeCoupon: Coupon | null;
  shippingMethod: ShippingMethodType;
  isDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setShippingMethod: (method: ShippingMethodType) => void;
  setDrawerOpen: (isOpen: boolean) => void;

  // Computed / Accessors
  getItemCount: () => number;
  getTotals: () => {
    subtotal: number;
    shipping: number;
    discount: number;
    taxableAmount: number;
    taxAmount: number;
    grandTotal: number;
  };
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      activeCoupon: null,
      shippingMethod: "standard",
      isDrawerOpen: false,

      addItem: (product, quantity = 1, selectedSize = "One Size") => {
        if (!product.inStock) return;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === selectedSize
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = currentItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
              : item
          );
        } else {
          newItems = [...currentItems, { product, quantity, selectedSize }];
        }

        set({ items: newItems });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const clampedQuantity = Math.min(10, Math.max(1, quantity));
        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: clampedQuantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], activeCoupon: null });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = DEMO_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

        if (!found) {
          return {
            success: false,
            message: `Invalid coupon "${code}". Try "WELCOME10", "FESTIVE500", or "SAUBHAGYA".`,
          };
        }

        const subtotal = get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        if (found.minSubtotal && subtotal < found.minSubtotal) {
          return {
            success: false,
            message: `Coupon "${found.code}" requires a minimum order of ₹${found.minSubtotal.toLocaleString("en-IN")}. Current: ₹${subtotal.toLocaleString("en-IN")}.`,
          };
        }

        set({ activeCoupon: found });
        return {
          success: true,
          message: `Coupon "${found.code}" applied! ${found.description}`,
        };
      },

      removeCoupon: () => {
        set({ activeCoupon: null });
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
      },

      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotals: () => {
        const { items, activeCoupon, shippingMethod } = get();
        const shippingCost = shippingMethod === "express" ? 500 : 0;
        return calculateCartTotals(items, activeCoupon, shippingCost);
      },
    }),
    {
      name: "saubhagya-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        activeCoupon: state.activeCoupon,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);

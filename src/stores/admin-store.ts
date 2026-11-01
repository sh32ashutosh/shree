import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import { Coupon } from "@/types/cart";
import { PRODUCTS } from "@/data/products";
import { DEMO_COUPONS } from "@/data/coupons";

export interface WeaverGuild {
  id: string;
  name: string;
  cluster: string;
  state: string;
  activeWeavers: number;
  specialty: string;
  leadArtisan: string;
  contact: string;
  monthlyLoomCapacity: number;
  giCertified: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: "product" | "order" | "coupon" | "system";
}

export interface StoreSettings {
  storeName: string;
  gstRate: number;
  freeShippingThreshold: number;
  expressShippingFee: number;
  conciergePhone: string;
  conciergeEmail: string;
  demoMode: boolean;
}

interface AdminStoreState {
  products: Product[];
  coupons: Coupon[];
  weaverGuilds: WeaverGuild[];
  activityLogs: ActivityLog[];
  settings: StoreSettings;

  // Product Actions
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;

  // Coupon Actions
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Settings Actions
  updateSettings: (settings: Partial<StoreSettings>) => void;

  // Logging
  addLog: (action: string, type: ActivityLog["type"]) => void;
}

const INITIAL_GUILDS: WeaverGuild[] = [
  {
    id: "guild-1",
    name: "Kanchipuram Silk Weavers Co-operative",
    cluster: "Pillayar Palayam",
    state: "Tamil Nadu",
    activeWeavers: 140,
    specialty: "Korvai Pure Mulberry Silk & Silver Zari",
    leadArtisan: "Shri M. Ramanathan",
    contact: "+91 98401 23456",
    monthlyLoomCapacity: 85,
    giCertified: true,
  },
  {
    id: "guild-2",
    name: "Varanasi Katan Heritage Guild",
    cluster: "Madanpura & Chowk",
    state: "Uttar Pradesh",
    activeWeavers: 185,
    specialty: "Kadwa Antique Brocades & Shikargah Motifs",
    leadArtisan: "Ustad Haji Nooruddin",
    contact: "+91 94500 87654",
    monthlyLoomCapacity: 110,
    giCertified: true,
  },
  {
    id: "guild-3",
    name: "Yeola Paithani Artisans Trust",
    cluster: "Yeola Weaving Cluster",
    state: "Maharashtra",
    activeWeavers: 65,
    specialty: "Mor-Bangadi (Peacock & Kaleidoscopic Pallu)",
    leadArtisan: "Smt. Shaila Sonawane",
    contact: "+91 98220 99881",
    monthlyLoomCapacity: 40,
    giCertified: true,
  },
  {
    id: "guild-4",
    name: "Patan Patola Master Guild",
    cluster: "Salvi Wad, Patan",
    state: "Gujarat",
    activeWeavers: 28,
    specialty: "Authentic Double Ikat 8-Ply Silk Weave",
    leadArtisan: "Shri Rohitbhai Salvi",
    contact: "+91 98251 44332",
    monthlyLoomCapacity: 15,
    giCertified: true,
  },
];

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      coupons: DEMO_COUPONS,
      weaverGuilds: INITIAL_GUILDS,
      activityLogs: [
        {
          id: "log-1",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          user: "Atelier Director",
          action: "Verified Silk Mark batch for Ruby Red Kanjivaram Silk Saree",
          type: "product",
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          user: "Atelier Director",
          action: "Activated FESTIVE500 discount promotion",
          type: "coupon",
        },
      ],
      settings: {
        storeName: "Saubhagya Sarees Atelier",
        gstRate: 18,
        freeShippingThreshold: 10000,
        expressShippingFee: 500,
        conciergePhone: "+91 98200 12345",
        conciergeEmail: "concierge@saubhagyasarees.com",
        demoMode: true,
      },

      addProduct: (newProdData) => {
        const id = `prod-${Date.now()}`;
        const newProduct: Product = {
          ...newProdData,
          id,
        };
        set({ products: [newProduct, ...get().products] });
        get().addLog(`Added new creation: ${newProduct.title} (${newProduct.sku})`, "product");
        return newProduct;
      },

      updateProduct: (updated) => {
        set({
          products: get().products.map((p) => (p.id === updated.id ? updated : p)),
        });
        get().addLog(`Updated product details: ${updated.title}`, "product");
      },

      deleteProduct: (id) => {
        const p = get().products.find((prod) => prod.id === id);
        set({
          products: get().products.filter((prod) => prod.id !== id),
        });
        if (p) {
          get().addLog(`Archived / Removed product: ${p.title} (${p.sku})`, "product");
        }
      },

      toggleStock: (id) => {
        const p = get().products.find((prod) => prod.id === id);
        if (!p) return;
        const newStock = !p.inStock;
        set({
          products: get().products.map((prod) =>
            prod.id === id ? { ...prod, inStock: newStock } : prod
          ),
        });
        get().addLog(
          `Changed stock status for ${p.title} to ${newStock ? "IN STOCK" : "OUT OF STOCK"}`,
          "product"
        );
      },

      addCoupon: (coupon) => {
        set({ coupons: [...get().coupons, coupon] });
        get().addLog(`Created new privilege coupon: ${coupon.code}`, "coupon");
      },

      deleteCoupon: (code) => {
        set({ coupons: get().coupons.filter((c) => c.code !== code) });
        get().addLog(`Deactivated coupon: ${code}`, "coupon");
      },

      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } });
        get().addLog("Updated atelier store configurations", "system");
      },

      addLog: (action, type) => {
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: "Atelier Director",
          action,
          type,
        };
        set({ activityLogs: [newLog, ...get().activityLogs.slice(0, 49)] });
      },
    }),
    {
      name: "saubhagya-admin-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

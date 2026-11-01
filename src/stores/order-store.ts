import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Address, Order } from "@/types/checkout";

export const SAMPLE_DEMO_ADDRESS: Address = {
  id: "addr-sample-1",
  fullName: "Ananya Deshmukh",
  email: "ananya.deshmukh@example.com",
  phone: "9876543210",
  addressLine: "Flat 402, Royal Palms, Lane 7, Koregaon Park",
  city: "Pune",
  state: "Maharashtra",
  pinCode: "411001",
  isDefault: true,
};

interface OrderStoreState {
  orders: Order[];
  addresses: Address[];
  selectedAddressId: string | null;

  // Order actions
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Address actions
  addAddress: (address: Omit<Address, "id">) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: [],
      addresses: [SAMPLE_DEMO_ADDRESS],
      selectedAddressId: SAMPLE_DEMO_ADDRESS.id,

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] });
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr-${Date.now()}`,
        };
        set({
          addresses: [...get().addresses, newAddress],
          selectedAddressId: newAddress.id,
        });
        return newAddress;
      },

      updateAddress: (updated) => {
        set({
          addresses: get().addresses.map((a) => (a.id === updated.id ? updated : a)),
        });
      },

      deleteAddress: (id) => {
        const remaining = get().addresses.filter((a) => a.id !== id);
        set({
          addresses: remaining,
          selectedAddressId: remaining.length > 0 ? remaining[0].id : null,
        });
      },

      selectAddress: (id) => {
        set({ selectedAddressId: id });
      },
    }),
    {
      name: "saubhagya-orders-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/order-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import {
  User,
  Package,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const isHydrated = useHydrated();
  const { orders, addresses, deleteAddress } = useOrderStore();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#5E131D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#756B62]">Opening Member Sanctum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Demo Badge */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#5E131D] text-[#FAF6F0] font-serif text-2xl font-bold flex items-center justify-center shadow-md">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
                  Ananya Deshmukh
                </h1>
                <span className="text-[10px] bg-[#C5A880]/20 text-[#5E131D] font-bold px-2 py-0.5 rounded-full uppercase">
                  Royal Member
                </span>
              </div>
              <p className="text-xs text-[#756B62] mt-0.5">
                ananya.deshmukh@example.com • Member since 2024
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FAF6F0] rounded-lg border border-[#E8DED1] max-w-sm text-xs text-[#756B62] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#5E131D] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F1916] block">Demo Account Interface:</strong>
              <span>
                Demonstration mode. Authentication and order history are persisted locally in
                your browser.
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8DED1] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "border-[#5E131D] text-[#5E131D] bg-white rounded-t-lg"
                : "border-transparent text-[#756B62] hover:text-[#1F1916]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "addresses"
                ? "border-[#5E131D] text-[#5E131D] bg-white rounded-t-lg"
                : "border-transparent text-[#756B62] hover:text-[#1F1916]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "profile"
                ? "border-[#5E131D] text-[#5E131D] bg-white rounded-t-lg"
                : "border-transparent text-[#756B62] hover:text-[#1F1916]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Preferences</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-[#E8DED1] text-center space-y-4">
                <Package className="w-12 h-12 text-[#C5A880] mx-auto stroke-1" />
                <h3 className="font-serif text-lg font-bold text-[#1F1916]">
                  No Past Orders Found
                </h3>
                <p className="text-xs text-[#756B62] max-w-sm mx-auto">
                  When you place simulated orders in our boutique, they will appear here with
                  tracking information.
                </p>
                <Link
                  href="/collections/sarees"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full"
                >
                  <span>Explore Handlooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED1] pb-3 gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#5E131D]">
                        Order #{order.id}
                      </span>
                      <p className="text-[11px] text-[#756B62]">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                      <Link
                        href={`/order-confirmation/${order.id}`}
                        className="text-xs font-semibold text-[#5E131D] hover:underline"
                      >
                        View Receipt &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between items-center text-xs text-[#1F1916]"
                      >
                        <div>
                          <span className="font-serif font-bold">{item.product.title}</span>
                          <span className="text-[#756B62] ml-2">
                            (×{item.quantity} • {item.product.fabric})
                          </span>
                        </div>
                        <span className="font-bold">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E8DED1] flex justify-between items-baseline text-xs">
                    <span className="text-[#756B62]">
                      Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                    <div>
                      <span className="text-[#756B62] mr-2">Grand Total:</span>
                      <span className="font-bold text-[#1F1916] text-sm font-serif">
                        {formatINR(order.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-xl border border-[#E8DED1] space-y-2 shadow-xs relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F1916]">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    {addresses.length > 1 && (
                      <button
                        onClick={() => {
                          deleteAddress(addr.id);
                          toast.info("Address deleted");
                        }}
                        className="text-[#756B62] hover:text-red-700 p-1"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-[#756B62] space-y-1 pt-1">
                    <p>{addr.addressLine}</p>
                    <p>
                      {addr.city}, {addr.state} — <strong>{addr.pinCode}</strong>
                    </p>
                    <p>Phone: {addr.phone}</p>
                    <p>Email: {addr.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl border border-[#E8DED1] space-y-6 max-w-2xl shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#1F1916]">
              Personal Preferences & Privileges
            </h3>

            <div className="space-y-4 text-xs text-[#756B62]">
              <div>
                <label className="block text-[#1F1916] font-semibold mb-1">
                  Preferred Weave Styles
                </label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#FAF6F0] border border-[#C5A880] text-[#5E131D] rounded font-semibold">
                    Kanjivaram Silk
                  </span>
                  <span className="px-3 py-1 bg-[#FAF6F0] border border-[#C5A880] text-[#5E131D] rounded font-semibold">
                    Banarasi Katan
                  </span>
                  <span className="px-3 py-1 bg-[#FAF6F0] border border-[#C5A880] text-[#5E131D] rounded font-semibold">
                    Pure Organza
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#1F1916] font-semibold mb-1">
                  Trousseau Newsletter & Private Previews
                </label>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Subscribed to Royal Privilege Previews</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

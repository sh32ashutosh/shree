"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/stores/admin-store";
import { useOrderStore } from "@/stores/order-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import {
  Users,
  ShieldCheck,
  Award,
  PhoneCall,
  MapPin,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function AdminCustomersPage() {
  const isHydrated = useHydrated();
  const { weaverGuilds } = useAdminStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<"guilds" | "customers">("guilds");

  if (!isHydrated) return null;

  // Extract unique customers from orders
  const customerMap = new Map<string, { name: string; email: string; phone: string; city: string; totalSpend: number; ordersCount: number }>();

  // Add default demo patron
  customerMap.set("ananya.deshmukh@example.com", {
    name: "Ananya Deshmukh",
    email: "ananya.deshmukh@example.com",
    phone: "+91 98765 43210",
    city: "Pune, Maharashtra",
    totalSpend: 70499,
    ordersCount: 2,
  });

  orders.forEach((o) => {
    const email = o.shippingAddress.email;
    const existing = customerMap.get(email);
    if (existing) {
      existing.totalSpend += o.grandTotal;
      existing.ordersCount += 1;
    } else {
      customerMap.set(email, {
        name: o.shippingAddress.fullName,
        email,
        phone: o.shippingAddress.phone,
        city: `${o.shippingAddress.city}, ${o.shippingAddress.state}`,
        totalSpend: o.grandTotal,
        ordersCount: 1,
      });
    }
  });

  const customersList = Array.from(customerMap.values());

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Artisans & Customer Directory
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Community Sanctum
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Empowering 450+ master weaver families across India and managing VIP client trousseaus.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#FAF6F0] p-1 rounded-lg border border-[#E8DED1]">
          <button
            onClick={() => setActiveTab("guilds")}
            className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "guilds"
                ? "bg-[#5E131D] text-[#FAF6F0] shadow-xs"
                : "text-[#756B62] hover:text-[#1F1916]"
            }`}
          >
            Weaver Guilds ({weaverGuilds.length})
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "customers"
                ? "bg-[#5E131D] text-[#FAF6F0] shadow-xs"
                : "text-[#756B62] hover:text-[#1F1916]"
            }`}
          >
            Client Patrons ({customersList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: WEAVER GUILDS */}
      {activeTab === "guilds" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weaverGuilds.map((guild) => (
            <div
              key={guild.id}
              className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-[#E8DED1] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#1F1916]">
                      {guild.name}
                    </h3>
                    {guild.giCertified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        GI Certified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5E131D] font-medium mt-0.5">
                    {guild.cluster}, {guild.state}
                  </p>
                </div>

                <div className="p-2 bg-[#FAF6F0] rounded-lg border border-[#E8DED1] text-center">
                  <span className="font-serif text-lg font-bold text-[#5E131D] block">
                    {guild.activeWeavers}
                  </span>
                  <span className="text-[9px] text-[#756B62] uppercase tracking-wider">
                    Weavers
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#756B62]">
                <div>
                  <strong className="text-[#1F1916] block">Master Weave Specialty:</strong>
                  <span>{guild.specialty}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8DED1]">
                  <div>
                    <span className="text-[10px] text-[#756B62] block">Lead Artisan</span>
                    <strong className="text-[#1F1916]">{guild.leadArtisan}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#756B62] block">Monthly Loom Output</span>
                    <strong className="text-[#1F1916]">{guild.monthlyLoomCapacity} Drapes</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-[#5E131D] font-semibold">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Guild Desk: {guild.contact}</span>
                  </span>
                  <span className="text-emerald-700 font-medium">100% Fair Wage Audited</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CLIENT PATRONS */}
      {activeTab === "customers" && (
        <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Primary Destination</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED1]">
                {customersList.map((c) => (
                  <tr key={c.email} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1F1916]">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#756B62]">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-[#756B62]">
                      {c.email}
                    </td>
                    <td className="py-3.5 px-4 text-[#1F1916]">
                      {c.city}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] font-semibold">
                        {c.ordersCount} {c.ordersCount === 1 ? "Order" : "Orders"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-serif font-bold text-[#5E131D] text-sm">
                      {formatINR(c.totalSpend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

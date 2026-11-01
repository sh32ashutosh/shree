"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Tag,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Sparkles,
} from "lucide-react";
import { useOrderStore } from "@/stores/order-store";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products Catalog", href: "/admin/products", icon: Shirt },
  { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
  { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
  { label: "Artisans & Customers", href: "/admin/customers", icon: Users },
  { label: "Financials & GST", href: "/admin/analytics", icon: BarChart3 },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const { orders } = useOrderStore();
  const { products } = useAdminStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingOrdersCount = isHydrated
    ? orders.filter((o) => o.status === "Confirmed" || o.status === "Processing").length
    : 0;

  return (
    <div className="min-h-screen bg-[#F4EFEB] flex flex-col md:flex-row text-[#1F1916]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#5E131D] text-[#FAF6F0] p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded bg-[#4A0E17] text-[#FAF6F0]"
            aria-label="Open admin sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider">SAUBHAGYA</span>
            <span className="text-[10px] text-[#C5A880] block font-mono">ADMIN ATELIER</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs bg-[#C5A880] text-[#1F1916] px-3 py-1.5 rounded font-semibold flex items-center gap-1"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1F1916] text-[#FAF6F0] shrink-0 border-r border-[#332A24] select-none">
        {/* Brand Area */}
        <div className="p-6 border-b border-[#332A24] bg-[#171210]">
          <Link href="/admin" className="block">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#C5A880] block">
              SAUBHAGYA
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-widest text-[#E8DFC8] uppercase font-semibold">
                Admin Control Room
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#756B62] tracking-wider">
            Management Sanctum
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#5E131D] text-[#FAF6F0] shadow-sm"
                    : "text-[#E8DFC8] hover:bg-[#332A24] hover:text-[#FAF6F0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A880]" : "text-[#756B62]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.label === "Orders & Fulfillment" && pendingOrdersCount > 0 && (
                  <span className="bg-[#C5A880] text-[#1F1916] text-[10px] font-bold px-2 py-0.2 rounded-full">
                    {pendingOrdersCount}
                  </span>
                )}
                {item.label === "Products Catalog" && (
                  <span className="text-[10px] text-[#756B62] font-mono">
                    {products.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area: Link back to storefront */}
        <div className="p-4 border-t border-[#332A24] bg-[#171210] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#E8DFC8]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Logged in as <strong>Director</strong></span>
          </div>
          <Link
            href="/"
            className="w-full py-2.5 px-3 bg-[#5E131D]/40 hover:bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#5E131D]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Boutique</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Slide-out Sidebar */}
      {mobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#1F1916] text-[#FAF6F0] h-full shadow-2xl z-10 flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#332A24] mb-4">
              <div>
                <span className="font-serif font-bold text-lg text-[#C5A880]">SAUBHAGYA</span>
                <span className="text-[10px] text-[#E8DFC8] block">ADMIN CONSOLE</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-[#E8DFC8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold ${
                      isActive
                        ? "bg-[#5E131D] text-[#FAF6F0]"
                        : "text-[#E8DFC8] hover:bg-[#332A24]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#C5A880]" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#332A24]">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full py-2 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase rounded flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E8DED1] px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5E131D] bg-[#5E131D]/10 px-2.5 py-1 rounded">
              Atelier Backoffice
            </span>
            <span className="text-xs text-[#756B62]">
              Silk Mark & Handloom Operations Platform
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#756B62]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Simulated Demo Mode Active</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Layers,
  Sparkles,
  Warehouse,
  Users,
  Tag,
  Truck,
  CreditCard,
  RotateCcw,
  Star,
  HeadphonesIcon,
  FileText,
  BarChart3,
  UserCheck,
  Settings,
  History,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Catalog & Merchandising",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Products", href: "/admin/products", icon: Shirt },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Collections", href: "/admin/collections", icon: Sparkles },
      { label: "Inventory & Stock", href: "/admin/inventory", icon: Warehouse },
    ],
  },
  {
    title: "Fulfillment & Orders",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Shipments & Logistics", href: "/admin/shipping", icon: Truck },
      { label: "Returns & Exchanges", href: "/admin/returns", icon: RotateCcw },
      { label: "Payments & Refunds", href: "/admin/payments", icon: CreditCard },
      { label: "Privilege Coupons", href: "/admin/coupons", icon: Tag },
    ],
  },
  {
    title: "Patrons & Engagement",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Product Reviews", href: "/admin/reviews", icon: Star },
      { label: "Support Tickets", href: "/admin/support", icon: HeadphonesIcon },
      { label: "Website CMS", href: "/admin/content", icon: FileText },
    ],
  },
  {
    title: "Intelligence & Security",
    items: [
      { label: "Sales & GST Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Staff & RBAC", href: "/admin/staff", icon: UserCheck },
      { label: "Store Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on admin login page, don't show admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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
      <aside className="hidden md:flex flex-col w-64 bg-[#1F1916] text-[#FAF6F0] shrink-0 border-r border-[#332A24] select-none h-screen sticky top-0">
        {/* Brand Area */}
        <div className="p-5 border-b border-[#332A24] bg-[#171210]">
          <Link href="/admin" className="block">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#C5A880] block">
              SAUBHAGYA
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-widest text-[#E8DFC8] uppercase font-semibold">
                Director Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#756B62] tracking-wider">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-[#5E131D] text-[#FAF6F0] shadow-sm"
                        : "text-[#E8DFC8] hover:bg-[#332A24] hover:text-[#FAF6F0]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A880]" : "text-[#756B62]"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#332A24] bg-[#171210] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E8DFC8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Super Admin</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-red-400 hover:text-red-300 p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 bg-[#5E131D]/40 hover:bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#5E131D]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white border-b border-[#E8DED1] px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5E131D] bg-[#5E131D]/10 px-2.5 py-1 rounded">
              Atelier Management
            </span>
            <span className="text-xs text-[#756B62]">
              Silk Mark & Handloom Operations
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold transition-colors"
            >
              <span>Visit Boutique</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

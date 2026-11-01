"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Heart,
  RotateCcw,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";

const ACCOUNT_LINKS = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Returns & Exchanges", href: "/account/returns", icon: RotateCcw },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Security & Password", href: "/account/security", icon: Shield },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-[#E8DED1] p-4 shadow-xs shrink-0 self-start">
      <div className="px-3 py-2 border-b border-[#E8DED1] mb-2">
        <span className="text-[10px] font-bold text-[#5E131D] tracking-widest uppercase block">
          Client Sanctuary
        </span>
        <h2 className="font-serif text-base font-bold text-[#1F1916]">
          My Atelier Portal
        </h2>
      </div>

      <nav className="space-y-1">
        {ACCOUNT_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-[#5E131D] text-[#FAF6F0] shadow-xs"
                  : "text-[#756B62] hover:bg-[#FAF6F0] hover:text-[#1F1916]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#FAF6F0]" : "text-[#756B62]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/account/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-red-700 hover:bg-red-50 transition-colors mt-4 pt-3 border-t border-[#E8DED1]"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}


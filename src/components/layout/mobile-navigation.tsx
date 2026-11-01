"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Heart, User, Sparkles, ChevronRight, PhoneCall, ShieldCheck } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
}

const NAV_LINKS = [
  { label: "BEST SELLERS", href: "/collections/best-sellers", badge: "Hot" },
  { label: "NEW ARRIVALS", href: "/collections/new-arrivals", badge: "New" },
  { label: "SAREES", href: "/collections/sarees", highlight: true },
  { label: "LEHENGAS", href: "/collections/lehengas" },
  { label: "KURTIS", href: "/collections/kurtis" },
  { label: "GOWNS", href: "/collections/gowns" },
  { label: "MEN", href: "/collections/men" },
  { label: "KIDS", href: "/collections/kids" },
  { label: "SALE", href: "/collections/sale", badge: "Privilege" },
];

export function MobileNavigation({ isOpen, onClose, wishlistCount }: MobileNavigationProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => {
      document.body.classList.remove("drawer-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1916]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-[#FAF6F0] h-full shadow-2xl z-10 flex flex-col border-r border-[#E8DED1] animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DED1] flex items-center justify-between bg-[#FDFBF7]">
          <div>
            <span className="font-serif text-lg font-bold tracking-wider text-[#5E131D]">
              SAUBHAGYA
            </span>
            <span className="block text-[10px] tracking-widest text-[#756B62] uppercase">
              Heritage Atelier
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#756B62] hover:text-[#5E131D] rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 py-2 text-[11px] font-semibold text-[#756B62] uppercase tracking-wider">
            Collections
          </div>
          <nav className="divide-y divide-[#E8DED1]/50">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-[#1F1916] hover:bg-[#E8DFC8]/30 transition-colors"
              >
                <span className={link.highlight ? "text-[#5E131D] font-bold" : ""}>
                  {link.label}
                </span>
                <div className="flex items-center gap-2">
                  {link.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#5E131D]">
                      {link.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#756B62]" />
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-6 px-4 py-2 text-[11px] font-semibold text-[#756B62] uppercase tracking-wider">
            Curated Boutiques
          </div>
          <div className="px-5 space-y-1.5 text-sm">
            <Link
              href="/collections/bridal-wear"
              onClick={onClose}
              className="flex items-center gap-2 py-2 text-[#1F1916] hover:text-[#5E131D]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Bridal Sanctum</span>
            </Link>
            <Link
              href="/collections/heritage-loom"
              onClick={onClose}
              className="flex items-center gap-2 py-2 text-[#1F1916] hover:text-[#5E131D]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Heritage Handloom</span>
            </Link>
            <Link
              href="/collections/festive-picks"
              onClick={onClose}
              className="flex items-center gap-2 py-2 text-[#1F1916] hover:text-[#5E131D]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Festive Splendor</span>
            </Link>
          </div>
        </div>

        {/* User bar */}
        <div className="p-4 border-t border-[#E8DED1] bg-[#FDFBF7] space-y-2">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#1F1916] rounded hover:bg-[#E8DFC8]/30 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#5E131D]" />
              <span>Saved Items</span>
            </div>
            {wishlistCount > 0 && (
              <span className="text-xs font-bold text-[#FAF6F0] bg-[#5E131D] px-2 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#1F1916] rounded hover:bg-[#E8DFC8]/30 transition-colors"
          >
            <User className="w-4 h-4 text-[#5E131D]" />
            <span>Demo Account & Orders</span>
          </Link>
          <div className="pt-2 border-t border-[#E8DED1] text-xs text-[#756B62] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#5E131D]" />
              <span>Concierge: +91 98200 12345</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

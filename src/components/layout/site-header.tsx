"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { MobileNavigation } from "./mobile-navigation";
import { CartDrawer } from "../cart/cart-drawer";
import { PRODUCTS } from "@/data/products";
import { searchProducts } from "@/lib/product-filters";
import { formatINR } from "@/lib/currency";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "BEST SELLERS", href: "/collections/best-sellers" },
  { label: "NEW ARRIVALS", href: "/collections/new-arrivals" },
  { label: "SAREES", href: "/collections/sarees", highlight: true },
  { label: "LEHENGAS", href: "/collections/lehengas" },
  { label: "KURTIS", href: "/collections/kurtis" },
  { label: "GOWNS", href: "/collections/gowns" },
  { label: "MEN", href: "/collections/men" },
  { label: "KIDS", href: "/collections/kids" },
  { label: "SALE", href: "/collections/sale", badge: "Offer" },
];

export function SiteHeader() {
  const router = useRouter();
  const isHydrated = useHydrated();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getItemCount, setDrawerOpen } = useCartStore();
  const { getWishlistCount } = useWishlistStore();

  const cartCount = isHydrated ? getItemCount() : 0;
  const wishlistCount = isHydrated ? getWishlistCount() : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  const previewResults = searchQuery.trim()
    ? searchProducts(PRODUCTS, searchQuery).slice(0, 4)
    : [];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm border-b border-[#E8DED1]"
            : "bg-[#FAF6F0] border-b border-[#E8DED1]"
        }`}
      >
        {/* Main Branding Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile hamburger & desktop search trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#1F1916] hover:text-[#5E131D] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 text-xs text-[#756B62] bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#C5A880] px-3 py-2 rounded-full transition-all"
                aria-label="Search sarees and collections"
              >
                <Search className="w-4 h-4 text-[#5E131D]" />
                <span>Search Kanjivaram, Banarasi, Silk...</span>
                <kbd className="text-[10px] bg-[#E8DFC8]/40 text-[#756B62] px-1.5 py-0.5 rounded font-mono">
                  /
                </kbd>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 text-[#1F1916] hover:text-[#5E131D] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Luxury Brand Logo */}
            <div className="text-center">
              <Link href="/" className="inline-block group focus:outline-none">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-[#5E131D] block transition-transform group-hover:scale-[1.01]">
                  SAUBHAGYA
                </span>
                <div className="flex items-center justify-center gap-2 -mt-0.5">
                  <span className="h-px w-4 bg-[#C5A880]" />
                  <span className="text-[10px] tracking-[0.25em] text-[#756B62] uppercase font-medium">
                    Heritage Sarees
                  </span>
                  <span className="h-px w-4 bg-[#C5A880]" />
                </div>
              </Link>
            </div>

            {/* Right: Actions (Wishlist, Account, Cart) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/wishlist"
                className="relative p-2 text-[#1F1916] hover:text-[#5E131D] transition-colors rounded-full hover:bg-[#E8DFC8]/30"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#5E131D] text-[#FAF6F0] text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="p-2 text-[#1F1916] hover:text-[#5E131D] transition-colors rounded-full hover:bg-[#E8DFC8]/30 hidden sm:flex"
                aria-label="Demo Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#5E131D] bg-[#5E131D]/10 hover:bg-[#5E131D] hover:text-[#FAF6F0] px-2.5 py-1 rounded transition-colors"
                title="Admin Control Room"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>

              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 text-[#1F1916] hover:text-[#5E131D] transition-colors rounded-full hover:bg-[#E8DFC8]/30 flex items-center gap-2"
                aria-label={`Shopping Bag (${cartCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#5E131D] text-[#FAF6F0] text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Primary Navigation Bar */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:block border-t border-[#E8DED1]/70 bg-[#FAF6F0]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center space-x-7 py-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-xs font-semibold tracking-widest uppercase transition-colors relative py-1 hover:text-[#5E131D] ${
                      item.highlight
                        ? "text-[#5E131D] font-bold"
                        : "text-[#1F1916]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-[#C5A880]/20 text-[#5E131D] uppercase">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Interactive Search Overlay Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Products"
          className="fixed inset-0 z-50 flex flex-col justify-start"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1F1916]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Box */}
          <div className="relative w-full bg-[#FAF6F0] shadow-xl border-b border-[#E8DED1] z-10 animate-in slide-in-from-top duration-200">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center border-b-2 border-[#5E131D] pb-3 gap-3">
                  <Search className="w-6 h-6 text-[#5E131D] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by weave, fabric, occasion, or SKU (e.g. Kanjivaram, Banarasi, Zari)..."
                    className="w-full bg-transparent text-lg sm:text-xl text-[#1F1916] placeholder-[#756B62] focus:outline-none font-serif"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-[#756B62] hover:text-[#1F1916]"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-[#756B62] hover:text-[#5E131D]"
                    aria-label="Close search overlay"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </form>

              {/* Suggestions / Preview */}
              {searchQuery.trim() && (
                <div className="mt-4 pt-2">
                  <div className="text-xs font-semibold text-[#756B62] uppercase tracking-wider mb-3">
                    Top Results for &quot;{searchQuery}&quot; ({previewResults.length})
                  </div>
                  {previewResults.length === 0 ? (
                    <div className="py-6 text-center text-sm text-[#756B62]">
                      No exact matches found. Press Enter to view all results or try searching
                      &quot;Silk&quot;, &quot;Kanjivaram&quot;, or &quot;Lehenga&quot;.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {previewResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2 rounded border border-[#E8DED1] hover:border-[#C5A880] hover:bg-white transition-all bg-[#FDFBF7]"
                        >
                          <div className="relative w-14 h-18 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-serif font-bold text-[#1F1916] truncate">
                              {product.title}
                            </div>
                            <div className="text-xs text-[#756B62]">
                              {product.fabric} • {product.sku}
                            </div>
                            <div className="text-xs font-semibold text-[#5E131D] mt-0.5">
                              {formatINR(product.price)}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#756B62] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-[#5E131D] hover:underline"
                    >
                      View All Search Results &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Slide-out Navigation */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        wishlistCount={wishlistCount}
      />
    </>
  );
}

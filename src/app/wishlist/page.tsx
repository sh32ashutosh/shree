"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductCard } from "@/components/products/product-card";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const isHydrated = useHydrated();
  const { items, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#5E131D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#756B62]">Loading Saved Heirlooms...</p>
        </div>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      if (item.inStock) {
        addItem(item, 1, "One Size");
      }
    });
    toast.success("Added available items to your bag!");
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DED1] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5E131D] mb-1">
              <Heart className="w-4 h-4 fill-[#5E131D]" />
              <span>Personal Trousseau Registry</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
              Saved Masterpieces ({items.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#756B62] mt-1">
              Items saved in your wishlist remain stored locally on your device across visits.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className="px-4 py-2 bg-[#C5A880] hover:bg-[#B3946C] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Bag</span>
              </button>
              <button
                onClick={() => {
                  clearWishlist();
                  toast.info("Wishlist cleared");
                }}
                className="px-3 py-2 border border-[#E8DED1] hover:border-red-400 text-red-700 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty state or Product Grid */}
        {items.length === 0 ? (
          <div className="max-w-md mx-auto p-12 bg-white rounded-xl border border-[#E8DED1] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8DFC8]/40 text-[#5E131D] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-[#756B62] leading-relaxed">
              Explore our handcrafted Banarasi, Kanjivaram, and bridal lehengas. Click the heart
              icon on any item to save it for your special celebrations.
            </p>
            <Link
              href="/collections/sarees"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors shadow-xs"
            >
              <span>Explore Saree Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

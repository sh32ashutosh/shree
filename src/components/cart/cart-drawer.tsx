"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatINR } from "@/lib/currency";
import { useHydrated } from "@/lib/use-hydrated";

export function CartDrawer() {
  const isHydrated = useHydrated();
  const { isDrawerOpen, setDrawerOpen, items, updateQuantity, removeItem, getTotals } =
    useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => {
      document.body.classList.remove("drawer-open");
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isHydrated || !isDrawerOpen) return null;

  const totals = getTotals();
  const freeShippingThreshold = 10000;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((totals.subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1916]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl z-10 flex flex-col border-l border-[#E8DED1] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DED1] flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5E131D]" />
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              Your Shopping Bag ({items.length})
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-[#756B62] hover:text-[#5E131D] hover:bg-[#E8DFC8]/40 rounded-full transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Strip */}
        <div className="bg-[#FAF6F0] px-5 py-2.5 border-b border-[#E8DED1] text-xs text-[#756B62]">
          {totals.subtotal >= freeShippingThreshold ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Complimentary Worldwide Delivery unlocked!</span>
            </div>
          ) : (
            <div>
              <span>
                Add{" "}
                <strong className="text-[#5E131D]">
                  {formatINR(freeShippingThreshold - totals.subtotal)}
                </strong>{" "}
                more to unlock Complimentary Express Shipping.
              </span>
              <div className="w-full bg-[#E8DED1] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#5E131D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DED1]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#E8DFC8]/40 flex items-center justify-center text-[#5E131D] mb-4">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1F1916] mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-sm text-[#756B62] max-w-xs mb-6">
                Discover our royal handwoven Kanjivaram and Banarasi heirlooms to begin.
              </p>
              <Link
                href="/collections/sarees"
                onClick={() => setDrawerOpen(false)}
                className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-sm tracking-wider uppercase font-medium rounded-full transition-colors shadow-sm"
              >
                Explore Sarees
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <div className="relative w-20 h-26 shrink-0 bg-[#E8DFC8]/30 rounded overflow-hidden border border-[#E8DED1]">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="font-serif text-sm font-semibold text-[#1F1916] hover:text-[#5E131D] line-clamp-1 transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[#756B62] hover:text-[#5E131D] p-1 transition-colors"
                        aria-label={`Remove ${item.product.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#756B62] mt-0.5">SKU: {item.product.sku}</p>
                    <p className="text-xs text-[#5E131D] font-medium mt-0.5">
                      {item.product.fabric} • {item.selectedSize || "One Size"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E8DED1] rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 px-2 text-[#756B62] hover:text-[#1F1916] disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#1F1916]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 px-2 text-[#756B62] hover:text-[#1F1916] disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#1F1916]">
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-[#756B62]">
                          ({formatINR(item.product.price)} each)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary & checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8DED1] bg-[#FAF6F0] space-y-3">
            <div className="space-y-1.5 text-xs text-[#756B62]">
              <div className="flex justify-between text-sm text-[#1F1916] font-semibold">
                <span>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              <p className="text-[11px] text-[#756B62]">
                Taxes (18% GST) calculated and included in price. Shipping computed at checkout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="col-span-2 w-full py-3 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-sm font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/stores/cart-store";
import { Tag, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function OrderSummary() {
  const { items, activeCoupon, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totals = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!couponInput.trim()) {
      setErrorMsg("Please enter a valid coupon code.");
      return;
    }

    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput("");
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="bg-[#FDFBF7] rounded-xl border border-[#E8DED1] p-6 space-y-6 shadow-xs sticky top-28">
      <div>
        <h3 className="font-serif text-lg font-bold text-[#1F1916] flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-sans font-normal text-[#756B62]">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </h3>
      </div>

      {/* Mini Items Thumbnail List */}
      <div className="max-h-56 overflow-y-auto divide-y divide-[#E8DED1] pr-1 space-y-3">
        {items.map((item) => (
          <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative w-12 h-16 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0 border border-[#E8DED1]">
              <Image
                src={item.product.images[0]}
                alt={item.product.title}
                fill
                sizes="48px"
                className="object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-[#5E131D] text-[#FAF6F0] text-[9px] font-bold px-1 rounded-tl">
                ×{item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-serif font-bold text-[#1F1916] truncate">
                {item.product.title}
              </p>
              <p className="text-[11px] text-[#756B62]">
                {item.product.fabric} • {item.selectedSize || "One Size"}
              </p>
              <p className="text-xs font-semibold text-[#1F1916] mt-0.5">
                {formatINR(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Form */}
      <div className="pt-2 border-t border-[#E8DED1]">
        <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#5E131D]" />
          <span>Privilege Coupon / Gift Voucher</span>
        </label>

        {activeCoupon ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <div>
                <strong className="text-emerald-900 block">{activeCoupon.code}</strong>
                <span className="text-[11px] text-emerald-700">
                  {activeCoupon.description}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                removeCoupon();
                toast.info("Coupon removed");
              }}
              className="p-1 text-emerald-700 hover:text-emerald-900 rounded-full"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setErrorMsg(null);
                }}
                placeholder="e.g. WELCOME10, FESTIVE500"
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Apply
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errorMsg}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-[#756B62]">
              <span>Try:</span>
              <button
                type="button"
                onClick={() => setCouponInput("WELCOME10")}
                className="underline hover:text-[#5E131D]"
              >
                WELCOME10
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setCouponInput("FESTIVE500")}
                className="underline hover:text-[#5E131D]"
              >
                FESTIVE500
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setCouponInput("SAUBHAGYA")}
                className="underline hover:text-[#5E131D]"
              >
                SAUBHAGYA
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Financial Line Totals */}
      <div className="space-y-2.5 pt-4 border-t border-[#E8DED1] text-xs text-[#756B62]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1F1916]">{formatINR(totals.subtotal)}</span>
        </div>

        {totals.discount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Coupon Privilege Discount</span>
            <span>- {formatINR(totals.discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping & Insured Courier</span>
          <span className="font-semibold text-[#1F1916]">
            {totals.shipping === 0 ? "FREE" : formatINR(totals.shipping)}
          </span>
        </div>

        <div className="flex justify-between text-[11px] text-[#756B62] pt-1">
          <span>Included 18% GST (Tax Portion)</span>
          <span>{formatINR(totals.taxAmount)}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-[#E8DED1] flex justify-between items-baseline text-base sm:text-lg font-bold text-[#1F1916]">
          <span>Grand Total</span>
          <span className="text-[#5E131D] font-serif text-xl sm:text-2xl">
            {formatINR(totals.grandTotal)}
          </span>
        </div>
        <p className="text-[10px] text-[#756B62] text-right">
          (All prices are inclusive of all statutory Indian GST taxes)
        </p>
      </div>
    </div>
  );
}

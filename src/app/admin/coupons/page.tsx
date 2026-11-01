"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import { Coupon } from "@/types/cart";
import { Plus, Tag, Trash2, CheckCircle2, Percent, IndianRupee, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const isHydrated = useHydrated();
  const { coupons, addCoupon, deleteCoupon } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minSubtotal, setMinSubtotal] = useState("3000");
  const [maxDiscount, setMaxDiscount] = useState("2000");
  const [description, setDescription] = useState("");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Coupon code is required.");
      return;
    }

    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      toast.error(`Coupon "${cleanCode}" already exists.`);
      return;
    }

    const valueNum = Number(discountValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      toast.error("Please enter a valid discount value.");
      return;
    }

    const newCoupon: Coupon = {
      code: cleanCode,
      discountType,
      discountValue: valueNum,
      minSubtotal: minSubtotal ? Number(minSubtotal) : undefined,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      description:
        description.trim() ||
        (discountType === "percentage"
          ? `${valueNum}% off on qualifying orders`
          : `Flat ₹${valueNum} off on orders`),
    };

    addCoupon(newCoupon);
    toast.success(`Coupon "${cleanCode}" created successfully! It is now active at checkout.`);
    setIsModalOpen(false);
    setCode("");
    setDescription("");
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Privilege Coupons & Promotions ({coupons.length})
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Instant Validation
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Create and manage promotional discount codes. Codes created here immediately work in the
            checkout flow.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-xl border border-[#E8DED1] p-5 shadow-xs relative flex flex-col justify-between overflow-hidden group hover:border-[#C5A880] transition-colors"
          >
            {/* Top accent badge */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5E131D]" />
                  <span className="font-mono text-lg font-bold text-[#5E131D] tracking-wider">
                    {coupon.code}
                  </span>
                </div>
                <p className="text-xs text-[#1F1916] font-medium pt-1">
                  {coupon.description}
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Deactivate coupon "${coupon.code}"?`)) {
                    deleteCoupon(coupon.code);
                    toast.info(`Coupon ${coupon.code} removed`);
                  }
                }}
                className="text-[#756B62] hover:text-red-700 p-1.5 rounded"
                aria-label={`Delete ${coupon.code}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Terms and rules */}
            <div className="pt-4 border-t border-[#E8DED1] mt-4 space-y-1.5 text-xs text-[#756B62]">
              <div className="flex justify-between">
                <span>Discount Type:</span>
                <span className="font-semibold text-[#1F1916] uppercase">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% Percentage`
                    : `${formatINR(coupon.discountValue)} Fixed`}
                </span>
              </div>
              {coupon.minSubtotal && (
                <div className="flex justify-between">
                  <span>Min. Order Value:</span>
                  <span className="font-semibold text-[#1F1916]">
                    {formatINR(coupon.minSubtotal)}
                  </span>
                </div>
              )}
              {coupon.maxDiscount && (
                <div className="flex justify-between">
                  <span>Max. Cap:</span>
                  <span className="font-semibold text-[#1F1916]">
                    {formatINR(coupon.maxDiscount)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-emerald-700 text-[11px] pt-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active for Checkout Customers</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8DED1] overflow-hidden">
            <div className="p-5 border-b border-[#E8DED1] bg-[#FAF6F0] flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1F1916]">
                Create Privilege Coupon
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#756B62] hover:text-[#1F1916]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Coupon Code (Uppercase) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D] font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Value ({discountType === "percentage" ? "%" : "₹"}) *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "10" : "500"}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Min. Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    value={minSubtotal}
                    onChange={(e) => setMinSubtotal(e.target.value)}
                    placeholder="3000"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Max. Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Description / Marketing Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% Royal Festive Discount"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DED1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DED1] rounded-lg text-xs font-semibold text-[#756B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

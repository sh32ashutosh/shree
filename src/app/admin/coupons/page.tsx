import React from "react";
import { prisma } from "@/lib/prisma";
import { createCoupon, toggleCoupon } from "@/lib/actions/admin";
import { formatINR } from "@/lib/currency";
import { Tag, Plus, CheckCircle2, XCircle, Percent, IndianRupee } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: {
      _count: { select: { redemptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const code = (formData.get("code") as string).trim().toUpperCase();
    const type = formData.get("type") as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
    const discountValue = Number(formData.get("discountValue"));
    const minCartRupees = Number(formData.get("minCartRupees"));
    const maxDiscountRupees = Number(formData.get("maxDiscountRupees"));
    const description = (formData.get("description") as string)?.trim();

    if (!code || isNaN(discountValue)) return;

    await createCoupon({
      code,
      type,
      discountValue,
      perUserLimit: 1,
      firstOrderOnly: false,
      minCartPaise: minCartRupees ? Math.round(minCartRupees * 100) : undefined,
      maxDiscountPaise: maxDiscountRupees ? Math.round(maxDiscountRupees * 100) : undefined,
      description,
    });
    revalidatePath("/admin/coupons");
  }

  async function handleToggle(couponId: string, currentStatus: boolean) {
    "use server";
    await toggleCoupon(couponId, !currentStatus);
    revalidatePath("/admin/coupons");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Privilege Coupons & Promotional Discounts ({coupons.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Server-Validated
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Create percentage discounts, flat fee deductions, and festive promotional codes validated directly by the backend database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coupons List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Active Promo Codes
            </span>
            <span className="text-xs text-[#756B62]">{coupons.length} Coupons</span>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF6F0]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1F1916] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E8DED1]">
                      {c.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {c.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span className="text-[10px] text-[#756B62]">
                      Used {c.usageCount} times
                    </span>
                  </div>
                  <p className="text-xs text-[#756B62]">{c.description || "Atelier promotional coupon"}</p>
                  <p className="text-[11px] text-[#5E131D]">
                    {c.type === "PERCENTAGE"
                      ? `${c.discountValue}% OFF`
                      : c.type === "FIXED"
                      ? `Flat ₹${c.discountValue} OFF`
                      : "Free Insured Shipping"}
                    {c.minCartPaise ? ` • Min Order: ${formatINR(Math.round(c.minCartPaise / 100))}` : ""}
                    {c.maxDiscountPaise ? ` • Cap: ${formatINR(Math.round(c.maxDiscountPaise / 100))}` : ""}
                  </p>
                </div>

                <div>
                  <form action={handleToggle.bind(null, c.id, c.isActive)}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 border border-[#E8DED1] hover:border-[#5E131D] rounded text-xs font-semibold text-[#1F1916]"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Coupon Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#5E131D]" />
            <span>Create Privilege Code</span>
          </h2>

          <form action={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Coupon Code * (Uppercase)
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g. DIWALI2026"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-mono focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Discount Mechanism *
              </label>
              <select
                name="type"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="PERCENTAGE">Percentage (%) Discount</option>
                <option value="FIXED">Fixed Amount (₹) Off</option>
                <option value="FREE_SHIPPING">Free Insured Courier Shipping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Discount Value (% or ₹) *
              </label>
              <input
                type="number"
                name="discountValue"
                required
                placeholder="e.g. 15 for 15% or 500 for ₹500"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Minimum Cart Subtotal (₹)
              </label>
              <input
                type="number"
                name="minCartRupees"
                placeholder="e.g. 10000"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Maximum Discount Cap (₹)
              </label>
              <input
                type="number"
                name="maxDiscountRupees"
                placeholder="e.g. 3000"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Customer Facing Description
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="e.g. Festive bridal privilege: 15% off on orders above ₹10,000"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Issue Coupon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

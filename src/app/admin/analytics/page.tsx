"use client";

import React from "react";
import { useOrderStore } from "@/stores/order-store";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import {
  TrendingUp,
  Receipt,
  Truck,
  Tag,
  PieChart,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const isHydrated = useHydrated();
  const { orders } = useOrderStore();
  const { products } = useAdminStore();

  if (!isHydrated) return null;

  // Financial aggregates
  const grossSales = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalSubtotal = orders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalDiscount = orders.reduce((acc, o) => acc + o.discount, 0);
  const totalShipping = orders.reduce((acc, o) => acc + o.shippingCost, 0);
  const totalGst = orders.reduce((acc, o) => acc + o.taxAmount, 0);

  // Category counts
  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Financials & Statutory GST Breakdown
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              18% GST Compliant
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Audited financial calculations, inclusive 18% GST portions, discount reconciliations, and category revenue.
          </p>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Gross Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {formatINR(grossSales)}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Total collected from customers
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>18% Inclusive GST Tax</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#5E131D]">
            {formatINR(totalGst)}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Formula: Inclusive GST = Subtotal × 18 / 118
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Discounts Granted</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {formatINR(totalDiscount)}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Privilege coupons absorbed
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Courier Revenue</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {formatINR(totalShipping)}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Priority air courier fees collected
          </div>
        </div>
      </div>

      {/* Details Grid: GST Statement & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST Statement Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DED1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-3">
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              Statutory GST Liability Statement (Form GSTR-3B)
            </h3>
            <span className="text-[10px] bg-[#C5A880]/20 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              HSN Code 5007 / 5208
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#756B62]">
            <div className="flex justify-between py-1.5 border-b border-[#E8DED1]">
              <span>Taxable Value (Before Taxes):</span>
              <strong className="text-[#1F1916]">
                {formatINR(Math.max(0, totalSubtotal - totalDiscount - totalGst))}
              </strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E8DED1]">
              <span>Central GST (CGST @ 9%):</span>
              <strong className="text-[#1F1916]">{formatINR(Math.round(totalGst / 2))}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E8DED1]">
              <span>State GST (SGST @ 9%):</span>
              <strong className="text-[#1F1916]">{formatINR(Math.round(totalGst / 2))}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E8DED1]">
              <span>Integrated GST (IGST for Inter-State):</span>
              <strong className="text-[#1F1916]">{formatINR(totalGst)}</strong>
            </div>

            <div className="p-3 bg-[#FAF6F0] rounded-lg border border-[#E8DED1] text-[11px]">
              <strong className="text-[#5E131D] block mb-0.5">Tax Compliance Note:</strong>
              <span>
                All product pricing on the Saubhagya storefront is tax-inclusive. Customers are
                never charged additional unexpected tax levies at checkout.
              </span>
            </div>
          </div>
        </div>

        {/* Category Inventory Share Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E8DED1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-3">
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              Catalog Category Distribution
            </h3>
            <span className="text-xs text-[#756B62]">{products.length} Total Pieces</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(categoryCount).map(([category, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-[#1F1916]">
                    <span className="font-bold uppercase tracking-wider">{category}</span>
                    <span className="text-[#756B62]">
                      {count} pieces ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden border border-[#E8DED1]">
                    <div
                      className="bg-[#5E131D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

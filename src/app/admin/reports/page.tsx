import React from "react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, PieChart } from "lucide-react";

export default async function AdminReportsPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      include: { category: true, inventory: true },
    }),
  ]);

  const totalGrossPaise = orders.reduce((sum, o) => sum + o.subtotalPaise, 0);
  const totalDiscountsPaise = orders.reduce((sum, o) => sum + o.couponDiscount, 0);
  const totalShippingPaise = orders.reduce((sum, o) => sum + o.shippingPaise, 0);
  const totalGstPaise = orders.reduce((sum, o) => sum + o.taxPaise, 0);
  const totalNetPaise = orders
    .filter((o) => o.paymentStatus === "PAID" || o.paymentStatus === "COD_PENDING")
    .reduce((sum, o) => sum + o.totalPaise, 0);

  const aov = orders.length > 0 ? Math.round(totalNetPaise / orders.length / 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Financial Reports & GST Tax Analytics
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              18% GST Compliant
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Exact database financial accounting: gross turnover, net realization, discounts surrendered, and GST tax liability.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Gross Merchandise Value (GMV)</span>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {formatINR(Math.round(totalGrossPaise / 100))}
          </div>
          <span className="text-[11px] text-[#756B62]">Before coupon deductions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Net Realized Revenue</span>
          <div className="font-serif text-2xl font-bold text-emerald-700">
            {formatINR(Math.round(totalNetPaise / 100))}
          </div>
          <span className="text-[11px] text-emerald-800">Confirmed & Remitted Orders</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Total Promotional Discounts</span>
          <div className="font-serif text-2xl font-bold text-[#5E131D]">
            {formatINR(Math.round(totalDiscountsPaise / 100))}
          </div>
          <span className="text-[11px] text-[#756B62]">Absorbed via privilege codes</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">18% Included GST Liability</span>
          <div className="font-serif text-2xl font-bold text-blue-800">
            {formatINR(Math.round(totalGstPaise / 100))}
          </div>
          <span className="text-[11px] text-[#756B62]">Calculated on inclusive net rate</span>
        </div>
      </div>

      {/* Financial Table Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#5E131D]" />
            <span>Audited Statement Breakdown</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60">
              <span className="text-[#756B62]">Gross Item Subtotal</span>
              <span className="font-bold text-[#1F1916]">{formatINR(Math.round(totalGrossPaise / 100))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60 text-emerald-800 font-semibold">
              <span>Less: Privilege Coupons</span>
              <span>- {formatINR(Math.round(totalDiscountsPaise / 100))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60">
              <span className="text-[#756B62]">Plus: Express Courier Income</span>
              <span className="font-bold text-[#1F1916]">{formatINR(Math.round(totalShippingPaise / 100))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60 text-blue-900">
              <span>Included Central GST (9% CGST)</span>
              <span>{formatINR(Math.round((totalGstPaise / 2) / 100))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60 text-blue-900">
              <span>Included State GST (9% SGST)</span>
              <span>{formatINR(Math.round((totalGstPaise / 2) / 100))}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-[#1F1916]">
              <span>Average Order Value (AOV)</span>
              <span className="font-serif text-[#5E131D] text-base">{formatINR(aov)}</span>
            </div>
          </div>
        </div>

        {/* Catalog Value & Turnover */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#5E131D]" />
            <span>Warehouse Stock Asset Valuation</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60">
              <span className="text-[#756B62]">Total Active Saree Styles</span>
              <span className="font-bold text-[#1F1916]">{products.length} Designs</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60">
              <span className="text-[#756B62]">Total Warehouse Physical Units</span>
              <span className="font-bold text-[#1F1916]">
                {products.reduce((acc, p) => acc + (p.inventory?.quantity || 0), 0)} Pieces
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8DED1]/60">
              <span className="text-[#756B62]">Retail Asset Valuation</span>
              <span className="font-bold font-serif text-[#1F1916]">
                {formatINR(
                  Math.round(
                    products.reduce(
                      (acc, p) => acc + p.priceInPaise * (p.inventory?.quantity || 0),
                      0
                    ) / 100
                  )
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/order-store";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import {
  TrendingUp,
  ShoppingBag,
  Shirt,
  Users,
  Tag,
  ArrowUpRight,
  Package,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const isHydrated = useHydrated();
  const { orders } = useOrderStore();
  const { products, coupons, weaverGuilds, activityLogs } = useAdminStore();

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5E131D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Real-time calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1916]">
              Executive Dashboard
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Real-time handloom inventory, live retail orders, and weaver guild performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Add New Product</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/coupons"
            className="px-4 py-2 bg-white border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Manage Coupons
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Gross Sales Volume</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {formatINR(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1">
            <span>From {totalOrdersCount} verified customer orders</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Customer Orders</span>
            <div className="p-2 rounded-lg bg-[#5E131D]/10 text-[#5E131D]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Average Order Value: <strong>{formatINR(aov)}</strong>
          </div>
        </div>

        {/* Metric 3: Products in Catalog */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Active Catalog Pieces</span>
            <div className="p-2 rounded-lg bg-[#C5A880]/20 text-[#5E131D]">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {products.length}
          </div>
          <div className="text-[11px] text-[#756B62]">
            {outOfStockCount > 0 ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{outOfStockCount} items currently out of stock</span>
              </span>
            ) : (
              <span className="text-emerald-700">All weaves 100% in stock</span>
            )}
          </div>
        </div>

        {/* Metric 4: Weaver Guilds */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Artisan Weaving Guilds</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {weaverGuilds.length}
          </div>
          <div className="text-[11px] text-[#756B62]">
            418 master weavers actively on handlooms
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 Cols): Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F1916]">
                Recent Storefront Orders
              </h2>
              <p className="text-xs text-[#756B62]">
                Orders placed via customer checkout are automatically populated here.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#5E131D] hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Package className="w-10 h-10 text-[#C5A880] mx-auto stroke-1" />
              <p className="text-xs text-[#756B62]">
                No orders placed in this session yet. Complete a checkout on the storefront to test live order synchronization.
              </p>
              <Link
                href="/checkout"
                className="inline-block px-4 py-2 bg-[#FAF6F0] border border-[#C5A880] text-[#5E131D] text-xs font-semibold rounded uppercase"
              >
                Go to Checkout
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Total</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DED1]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#5E131D]">
                        {order.id}
                      </td>
                      <td className="py-3 font-medium text-[#1F1916]">
                        {order.shippingAddress.fullName}
                      </td>
                      <td className="py-3 text-[#756B62]">
                        {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[#1F1916]">
                        {formatINR(order.grandTotal)}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/orders"
                          className="text-[#5E131D] font-semibold hover:underline"
                        >
                          Manage &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right (1 Col): Activity Log Stream & Quick Stats */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider">
              Quick Operations
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-[#5E131D]" />
                  <span>Update Saree Inventory</span>
                </div>
                <span className="text-[11px] text-[#756B62]">{products.length} Items</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5E131D]" />
                  <span>Privilege Coupons</span>
                </div>
                <span className="text-[11px] text-[#756B62]">{coupons.length} Active</span>
              </Link>

              <Link
                href="/admin/analytics"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#5E131D]" />
                  <span>GST Tax Breakdown</span>
                </div>
                <span className="text-[11px] text-[#756B62]">18% Inclusive</span>
              </Link>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DED1] pb-2">
              <h3 className="font-serif text-sm font-bold text-[#1F1916] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5E131D]" />
                <span>Atelier Activity Audit</span>
              </h3>
              <span className="text-[10px] text-[#756B62]">Live Stream</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-[#E8DED1]/60 pr-1">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="pt-2 first:pt-0 text-xs space-y-0.5">
                  <div className="flex justify-between items-center text-[10px] text-[#756B62]">
                    <span className="font-semibold text-[#5E131D]">{log.user}</span>
                    <span>
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[#1F1916] leading-relaxed">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
  Layers,
  Warehouse,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // Real Database Queries
  const [
    totalOrdersCount,
    pendingOrdersCount,
    completedOrdersCount,
    totalCustomersCount,
    totalProductsCount,
    lowStockCount,
    outOfStockCount,
    ordersSum,
    recentOrders,
    recentLogs,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"] } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.inventory.count({
      where: {
        quantity: { lte: 5, gt: 0 },
      },
    }),
    prisma.inventory.count({
      where: {
        quantity: { lte: 0 },
      },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: { in: ["PAID", "COD_PENDING"] } },
      _sum: { totalPaise: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
    }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenueRupees = Math.round((ordersSum._sum.totalPaise || 0) / 100);
  const aovRupees = totalOrdersCount > 0 ? Math.round(totalRevenueRupees / totalOrdersCount) : 0;

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
              Database Sync Active
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Real-time handloom inventory, verified live orders, and artisan guild performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>+ New Creation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-white border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Fulfillment Queue ({pendingOrdersCount})
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
            {formatINR(totalRevenueRupees)}
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
            Average Order Value: <strong>{formatINR(aovRupees)}</strong>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Catalog Heirlooms</span>
            <div className="p-2 rounded-lg bg-[#C5A880]/20 text-[#5E131D]">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {totalProductsCount}
          </div>
          <div className="text-[11px] text-[#756B62]">
            Active sarees & bridal pieces
          </div>
        </div>

        {/* Metric 4: Registered Patrons */}
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#756B62] text-xs">
            <span>Registered Patrons</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {totalCustomersCount}
          </div>
          <div className="text-[11px] text-emerald-700">
            Verified accounts in database
          </div>
        </div>
      </div>

      {/* Stock Alerts Warning Band if any */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Inventory Advisory:</strong> {lowStockCount} saree styles have 5 or fewer pieces remaining. {outOfStockCount} out of stock.
            </span>
          </div>
          <Link
            href="/admin/inventory"
            className="font-bold underline text-amber-950 hover:text-amber-800 shrink-0 ml-2"
          >
            Adjust Stock →
          </Link>
        </div>
      )}

      {/* Two Column Layout: Recent Orders and Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 Cols): Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#5E131D]" />
              <h2 className="font-serif text-base font-bold text-[#1F1916]">
                Recent Orders Stream
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#5E131D] font-semibold hover:underline"
            >
              View All ({totalOrdersCount})
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#756B62]">
              No orders placed yet. Orders created via checkout will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Patron</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DED1]/60">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF6F0]/40">
                      <td className="py-3 font-mono font-bold text-[#1F1916]">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 font-semibold text-[#1F1916]">
                        {order.user?.name || "Guest Patron"}
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
                        {formatINR(Math.round(order.totalPaise / 100))}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#5E131D] font-semibold hover:underline"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right (1 Col): Activity Logs Stream */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider">
              Quick Portals
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-[#5E131D]" />
                  <span>Saree Catalog</span>
                </div>
                <span className="text-[11px] text-[#756B62]">{totalProductsCount} Items</span>
              </Link>

              <Link
                href="/admin/inventory"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-[#5E131D]" />
                  <span>Warehouse & Stock</span>
                </div>
                <span className="text-[11px] text-[#756B62]">Manage</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="w-full flex items-center justify-between p-2.5 rounded bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-xs font-semibold text-[#1F1916] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5E131D]" />
                  <span>Privilege Coupons</span>
                </div>
                <span className="text-[11px] text-[#756B62]">Discounts</span>
              </Link>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DED1] pb-2">
              <h3 className="font-serif text-sm font-bold text-[#1F1916] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5E131D]" />
                <span>Atelier Activity Audit</span>
              </h3>
              <Link href="/admin/audit-logs" className="text-[10px] text-[#5E131D] underline">
                View All
              </Link>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-[#E8DED1]/60 pr-1">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-[#756B62] py-2">No recent audit logs.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="pt-2 first:pt-0 text-xs space-y-0.5">
                    <div className="flex justify-between items-center text-[10px] text-[#756B62]">
                      <span className="font-semibold text-[#5E131D]">{log.actorName || "System"}</span>
                      <span>
                        {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[#1F1916] leading-relaxed">{log.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

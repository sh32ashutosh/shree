import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  Calendar,
  CreditCard,
} from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      items: true,
      shipment: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Order Fulfillment & Courier Dispatch ({orders.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Database Synced
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Orders created in the storefront are stored with immutable historical price snapshots and atomic inventory reservations.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Patron & Destination</th>
                <th className="py-3 px-4">Pieces</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
                <th className="py-3 px-4 text-right">Total Paid</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#756B62]">
                    No customer orders in the database yet. Checkout a saree from the storefront to see it appear here.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const grandTotal = Math.round(o.totalPaise / 100);

                  return (
                    <tr key={o.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-sm text-[#1F1916] block">
                          #{o.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#756B62]">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#1F1916] block">
                          {o.address?.fullName || o.user?.name || "Guest Patron"}
                        </span>
                        <span className="text-[11px] text-[#756B62]">
                          {o.address?.city ? `${o.address.city}, ${o.address.state}` : o.user?.email}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#756B62]">
                        {o.items.length} {o.items.length === 1 ? "creation" : "creations"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {o.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-serif font-bold text-sm text-[#1F1916]">
                        {formatINR(grandTotal)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF6F0] hover:bg-[#5E131D] hover:text-[#FAF6F0] text-[#5E131D] border border-[#E8DED1] rounded text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

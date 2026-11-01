"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useOrderStore } from "@/stores/order-store";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import { Order } from "@/types/checkout";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  Package,
  Printer,
  X,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const isHydrated = useHydrated();
  const { orders } = useOrderStore();
  const { addLog } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status updates in local memory
  const [orderStatuses, setOrderStatuses] = useState<Record<string, Order["status"]>>({});

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
    addLog(`Updated Order #${orderId} fulfillment status to ${newStatus}`, "order");
    toast.success(`Order #${orderId} marked as ${newStatus}`);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const currentStatus = orderStatuses[o.id] || o.status;
      const q = searchQuery.toLowerCase().trim();

      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.shippingAddress.fullName.toLowerCase().includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q) ||
        o.shippingAddress.phone.includes(q);

      const matchStatus = statusFilter === "all" || currentStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter, orderStatuses]);

  if (!isHydrated) return null;

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
              Real-time Sync
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Orders created in the storefront are instantly visible here. Track progress, update
            courier statuses, and print invoices.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DED1] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, client name, city, or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#756B62]" />
          <span className="text-xs text-[#756B62]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-[#E8DED1] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Delivery City</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#756B62]">
                    No orders matching your criteria found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const currentStatus = orderStatuses[order.id] || order.status;
                  return (
                    <tr key={order.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5E131D]">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-4 text-[#756B62]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1F1916]">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-[10px] text-[#756B62]">
                          {order.shippingAddress.phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#756B62]">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#1F1916]">
                          {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#1F1916]">
                        {formatINR(order.grandTotal)}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as Order["status"])
                          }
                          className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border cursor-pointer ${
                            currentStatus === "Delivered"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : currentStatus === "Dispatched"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : currentStatus === "Processing"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-purple-100 text-purple-800 border-purple-300"
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#E8DED1] text-[#5E131D] text-xs font-semibold rounded flex items-center gap-1.5 ml-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Inspector Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E8DED1] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#E8DED1] bg-[#FAF6F0] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#1F1916]">
                    Order Inspector: {selectedOrder.id}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                    {orderStatuses[selectedOrder.id] || selectedOrder.status}
                  </span>
                </div>
                <span className="text-xs text-[#756B62]">
                  Registered on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                    dateStyle: "full",
                  })}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-[#756B62] hover:text-[#1F1916]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Client & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#5E131D] uppercase">
                    <MapPin className="w-4 h-4" />
                    <span>Customer & Delivery Address</span>
                  </div>
                  <p className="font-bold text-[#1F1916] pt-1">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p>{selectedOrder.shippingAddress.addressLine}</p>
                  <p>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} —{" "}
                    <strong>{selectedOrder.shippingAddress.pinCode}</strong>
                  </p>
                  <p className="pt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                  <p>Email: {selectedOrder.shippingAddress.email}</p>
                </div>

                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#5E131D] uppercase">
                    <Truck className="w-4 h-4" />
                    <span>Courier & Authorization</span>
                  </div>
                  <p className="pt-1">
                    Courier: <strong>{selectedOrder.shippingMethod.name}</strong>
                  </p>
                  <p>ETA: {selectedOrder.shippingMethod.estimatedDelivery}</p>
                  <p className="pt-1">
                    Payment Method:{" "}
                    <strong className="uppercase">{selectedOrder.paymentDetails.method}</strong>
                  </p>
                  {selectedOrder.paymentDetails.upiId && (
                    <p>UPI ID: {selectedOrder.paymentDetails.upiId}</p>
                  )}
                  <p className="text-emerald-700 font-semibold pt-1">
                    Simulated Payment Authorized
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider">
                  Ordered Heirlooms ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-[#E8DED1] border border-[#E8DED1] rounded-xl p-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0 border border-[#E8DED1]">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-[#1F1916]">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-[#756B62]">
                            SKU: {item.product.sku} • Fabric: {item.product.fabric}
                          </p>
                          <p className="text-[11px] text-[#5E131D]">
                            Qty: {item.quantity} × {formatINR(item.product.price)}
                          </p>
                        </div>
                      </div>

                      <div className="font-bold text-[#1F1916]">
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] max-w-sm ml-auto space-y-1.5 text-xs text-[#756B62]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1916]">
                    {formatINR(selectedOrder.subtotal)}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- {formatINR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-[#1F1916]">
                    {selectedOrder.shippingCost === 0 ? "FREE" : formatINR(selectedOrder.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>18% Included GST Portion</span>
                  <span>{formatINR(selectedOrder.taxAmount)}</span>
                </div>
                <div className="pt-2 border-t border-[#E8DED1] flex justify-between items-baseline text-sm font-bold text-[#1F1916]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#5E131D]">
                    {formatINR(selectedOrder.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#E8DED1] bg-[#FAF6F0] flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#E8DED1] bg-white rounded-lg text-xs font-semibold text-[#1F1916] flex items-center gap-1.5 hover:border-[#5E131D]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

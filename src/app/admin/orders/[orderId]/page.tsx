import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus, updateShipment } from "@/lib/actions/admin";
import { formatINR } from "@/lib/currency";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      address: true,
      items: true,
      shipment: true,
      payment: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const subtotal = Math.round(order.subtotalPaise / 100);
  const discount = Math.round(order.couponDiscount / 100);
  const shipping = Math.round(order.shippingPaise / 100);
  const tax = Math.round(order.taxPaise / 100);
  const grandTotal = Math.round(order.totalPaise / 100);

  async function handleStatusChange(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as string;
    const note = formData.get("note") as string;
    if (newStatus) {
      await updateOrderStatus(orderId, newStatus, note || undefined);
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders");
    }
  }

  async function handleCourierAssign(formData: FormData) {
    "use server";
    const courier = (formData.get("courier") as string)?.trim();
    const trackingNumber = (formData.get("trackingNumber") as string)?.trim();
    const trackingUrl = (formData.get("trackingUrl") as string)?.trim();

    if (courier || trackingNumber) {
      await updateShipment(orderId, {
        courier,
        trackingNumber,
        trackingUrl,
      });
      revalidatePath(`/admin/orders/${orderId}`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="text-xs text-[#5E131D] hover:underline flex items-center gap-1 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Order #{order.orderNumber}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#756B62]">
            Created on {new Date(order.createdAt).toLocaleString("en-IN")} • Patron: {order.user?.name} ({order.user?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
            Payment: {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3">
              Ordered Items ({order.items.length})
            </h2>

            <div className="divide-y divide-[#E8DED1]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#1F1916]">
                      {item.productTitle}
                    </h3>
                    <p className="text-[#756B62] mt-0.5">
                      SKU: <span className="font-mono">{item.productSku}</span> • Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-[#1F1916]">
                      {formatINR(Math.round(item.totalPaise / 100))}
                    </span>
                    <span className="text-[10px] text-[#756B62] block">
                      ({formatINR(Math.round(item.pricePaise / 100))} each)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Progression Actions */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-2">
              Fulfillment Workflow Transition
            </h2>

            <form action={handleStatusChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Transition Order Status To:
                  </label>
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED (Accepted)</option>
                    <option value="PROCESSING">PROCESSING (In Atelier)</option>
                    <option value="PACKED">PACKED (Velvet Muslin Casket)</option>
                    <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED (Doorstep Handover)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Audit Note / Courier Reference
                  </label>
                  <input
                    type="text"
                    name="note"
                    placeholder="e.g. Dispatched via Blue Dart Air Express"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Apply Status Change
              </button>
            </form>
          </div>

          {/* Courier Assignment */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#5E131D]" />
              <span>Courier & Waybill Assignment</span>
            </h2>

            <form action={handleCourierAssign} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    name="courier"
                    defaultValue={order.shipment?.courier || "Shiprocket / Blue Dart"}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Tracking AWB Number
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    defaultValue={order.shipment?.trackingNumber || ""}
                    placeholder="e.g. BD789123456IN"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    name="trackingUrl"
                    defaultValue={order.shipment?.trackingUrl || ""}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Update Shipping Tracking
              </button>
            </form>
          </div>
        </div>

        {/* Right: Address & Totals */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] border-b border-[#E8DED1] pb-2">
              Financial Breakdown
            </h3>

            <div className="flex justify-between text-[#756B62]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1F1916]">{formatINR(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Coupon ({order.couponCode})</span>
                <span>- {formatINR(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#756B62]">
              <span>Shipping Fee</span>
              <span className="font-semibold text-[#1F1916]">
                {shipping === 0 ? "FREE" : formatINR(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-[#756B62] text-[11px]">
              <span>Included 18% GST Portion</span>
              <span>{formatINR(tax)}</span>
            </div>

            <div className="pt-2 border-t border-[#E8DED1] flex justify-between items-baseline text-sm font-bold text-[#1F1916]">
              <span>Grand Total</span>
              <span className="font-serif text-lg text-[#5E131D]">
                {formatINR(grandTotal)}
              </span>
            </div>
          </div>

          {order.address && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-2 text-xs text-[#756B62]">
              <h3 className="font-serif text-sm font-bold text-[#1F1916] flex items-center gap-1.5 border-b border-[#E8DED1] pb-2">
                <MapPin className="w-4 h-4 text-[#5E131D]" />
                <span>Delivery Address</span>
              </h3>
              <p className="font-bold text-[#1F1916]">{order.address.fullName}</p>
              <p>{order.address.addressLine}</p>
              <p>
                {order.address.city}, {order.address.state} — {order.address.pinCode}
              </p>
              <p>Phone: {order.address.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


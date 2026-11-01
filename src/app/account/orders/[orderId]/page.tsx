import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/account/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: true,
      address: true,
      shipment: true,
      payment: true,
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const subtotalRupees = Math.round(order.subtotalPaise / 100);
  const shippingRupees = Math.round(order.shippingPaise / 100);
  const discountRupees = Math.round(order.couponDiscount / 100);
  const taxRupees = Math.round(order.taxPaise / 100);
  const grandTotalRupees = Math.round(order.totalPaise / 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="space-y-1">
          <Link
            href="/account/orders"
            className="text-xs text-[#5E131D] hover:underline flex items-center gap-1 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
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
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order.status === "DELIVERED" && (
            <Link
              href="/account/returns"
              className="px-4 py-2 bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#5E131D] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Request Return / Exchange</span>
            </Link>
          )}
        </div>
      </div>

      {/* Two Column Grid: Items and Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ordered Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3">
              Ordered Handloom Pieces ({order.items.length})
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
                    <p className="text-[11px] text-[#5E131D] font-semibold mt-1">
                      Silk Mark Authenticated • Insured Velvet Wrap
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

          {/* Fulfillment Status Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5E131D]" />
              <span>Order Tracking Journey</span>
            </h2>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DED1]">
              {order.statusHistory.map((step) => (
                <div key={step.id} className="flex items-start gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-[#5E131D] text-white flex items-center justify-center shrink-0 z-10 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1F1916]">
                        {step.status}
                      </span>
                      <span className="text-[10px] text-[#756B62]">
                        {new Date(step.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {step.note && (
                      <p className="text-xs text-[#756B62] mt-0.5">{step.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Payment, Address, & Summary */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] border-b border-[#E8DED1] pb-2">
              Financial Breakdown
            </h3>

            <div className="flex justify-between text-[#756B62]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1F1916]">{formatINR(subtotalRupees)}</span>
            </div>

            {discountRupees > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Coupon ({order.couponCode})</span>
                <span>- {formatINR(discountRupees)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#756B62]">
              <span>Shipping ({order.shippingMethod || "Standard"})</span>
              <span className="font-semibold text-[#1F1916]">
                {shippingRupees === 0 ? "FREE" : formatINR(shippingRupees)}
              </span>
            </div>

            <div className="flex justify-between text-[#756B62] text-[11px]">
              <span>Included 18% GST Portion</span>
              <span>{formatINR(taxRupees)}</span>
            </div>

            <div className="pt-2 border-t border-[#E8DED1] flex justify-between items-baseline text-sm font-bold text-[#1F1916]">
              <span>Grand Total Paid</span>
              <span className="font-serif text-lg text-[#5E131D]">
                {formatINR(grandTotalRupees)}
              </span>
            </div>

            <div className="pt-2 text-[10px] text-[#756B62] bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DED1]">
              Payment Method: <strong>{order.paymentMethod?.toUpperCase() || "ONLINE"}</strong>
              <span className="block text-emerald-800 font-bold mt-0.5">
                Status: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
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


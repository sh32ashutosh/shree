"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOrderStore } from "@/stores/order-store";
import { formatINR } from "@/lib/currency";
import {
  CheckCircle2,
  PackageCheck,
  Printer,
  ArrowRight,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";
import confetti from "canvas-confetti";

interface OrderConfirmationViewProps {
  orderId: string;
}

export function OrderConfirmationView({ orderId }: OrderConfirmationViewProps) {
  const { getOrderById, orders } = useOrderStore();

  // Directly retrieve order from state during render
  const order = getOrderById(orderId) || orders.find((o) => o.id === orderId) || null;

  useEffect(() => {
    // Trigger celebratory gold and maroon confetti upon mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5E131D", "#C5A880", "#FAF6F0", "#10B981"],
      });
    } catch {
      // Fallback
    }
  }, []);

  // Fallback if order not found in state
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E8DFC8]/40 text-[#5E131D] flex items-center justify-center mx-auto">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1916]">
          Order Reference: {orderId}
        </h1>
        <p className="text-sm text-[#756B62] max-w-md mx-auto">
          Your demo order was registered. However, local storage state was refreshed or
          unavailable. Please check your account history or continue exploring our collection.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/account"
            className="px-6 py-2.5 bg-white border border-[#E8DED1] text-[#1F1916] text-xs font-semibold rounded uppercase"
          >
            View Account Orders
          </Link>
          <Link
            href="/collections/sarees"
            className="px-6 py-2.5 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold rounded uppercase"
          >
            Return to Atelier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header Banner */}
        <div className="p-8 rounded-2xl bg-white border border-[#E8DED1] shadow-md text-center space-y-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 animate-in zoom-in">
            <CheckCircle2 className="w-9 h-9 text-emerald-700" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#5E131D]/10 text-[#5E131D] text-xs font-semibold uppercase tracking-wider">
            Demo Order Registered Successfully
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
            Congratulations on Your Heirloom
          </h1>

          <p className="text-sm text-[#756B62] max-w-lg mx-auto leading-relaxed">
            Thank you for ordering with Saubhagya Sarees. Your handwoven drape has been reserved
            and sent to our master inspection guild.
          </p>

          <div className="inline-flex items-center gap-2 p-2 px-4 rounded-lg bg-[#FAF6F0] border border-[#E8DED1] text-xs font-mono font-bold text-[#1F1916]">
            <span>ORDER NUMBER:</span>
            <span className="text-[#5E131D]">{order.id}</span>
          </div>

          {/* Demo disclaimer notice */}
          <div className="p-3 bg-[#FAF6F0] rounded border border-[#E8DED1] text-xs text-[#756B62] max-w-xl mx-auto">
            <span className="font-bold text-[#5E131D]">Demo Notice:</span> Demo order created — no
            actual payment collected. No live courier was booked.
          </div>
        </div>

        {/* Order Details & Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Delivery Address */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#5E131D] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-[#756B62] space-y-0.5 pt-1">
              <p className="font-bold text-[#1F1916]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                <strong>{order.shippingAddress.pinCode}</strong>
              </p>
              <p className="pt-1">Phone: {order.shippingAddress.phone}</p>
              <p>Email: {order.shippingAddress.email}</p>
            </div>
          </div>

          {/* Card 2: Courier & Shipping */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#5E131D] text-xs font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Courier Handling</span>
            </div>
            <div className="text-xs text-[#756B62] space-y-1 pt-1">
              <p className="font-bold text-[#1F1916]">{order.shippingMethod.name}</p>
              <p>Estimated Arrival: {order.shippingMethod.estimatedDelivery}</p>
              <p className="text-[11px] text-[#756B62]">
                Insured wooden casket with Silk Mark certificate.
              </p>
            </div>
          </div>

          {/* Card 3: Simulated Payment Mode */}
          <div className="bg-white p-5 rounded-xl border border-[#E8DED1] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#5E131D] text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>Payment Status</span>
            </div>
            <div className="text-xs text-[#756B62] space-y-1 pt-1">
              <p className="font-bold text-[#1F1916] uppercase">
                {order.paymentDetails.method} Authorized
              </p>
              {order.paymentDetails.upiId && <p>VPA: {order.paymentDetails.upiId}</p>}
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Simulated Success
              </span>
            </div>
          </div>
        </div>

        {/* Items Ordered Table */}
        <div className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-4 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3">
            Handcrafted Items in this Order ({order.items.length})
          </h2>

          <div className="divide-y divide-[#E8DED1]">
            {order.items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <div className="relative w-16 h-22 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0 border border-[#E8DED1]">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-serif text-sm font-bold text-[#1F1916] hover:text-[#5E131D] transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-[#756B62] mt-0.5">
                    SKU: {item.product.sku} • Fabric: {item.product.fabric}
                  </p>
                  <p className="text-xs text-[#5E131D] font-medium mt-0.5">
                    Quantity: {item.quantity} • Size: {item.selectedSize || "One Size"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#1F1916]">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="block text-[11px] text-[#756B62]">
                      ({formatINR(item.product.price)} each)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-[#E8DED1] max-w-sm ml-auto space-y-2 text-xs text-[#756B62]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1F1916]">{formatINR(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Coupon Privilege ({order.couponCode})</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Cost</span>
              <span className="font-semibold text-[#1F1916]">
                {order.shippingCost === 0 ? "FREE" : formatINR(order.shippingCost)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] text-[#756B62]">
              <span>Included 18% GST (Taxes)</span>
              <span>{formatINR(order.taxAmount)}</span>
            </div>

            <div className="pt-2 border-t border-[#E8DED1] flex justify-between items-baseline text-base font-bold text-[#1F1916]">
              <span>Grand Total</span>
              <span className="font-serif text-xl text-[#5E131D]">
                {formatINR(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 border border-[#E8DED1] bg-white hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice / Receipt</span>
          </button>

          <Link
            href="/collections/sarees"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>Continue Exploring Heirlooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

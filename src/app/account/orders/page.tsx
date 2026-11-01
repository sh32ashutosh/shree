import React from "react";
import Link from "next/link";
import { getAuthenticatedCustomer } from "@/lib/data/customer-data";
import { formatINR } from "@/lib/currency";
import { Package, Truck, ArrowRight, Eye, Calendar } from "lucide-react";

export default async function AccountOrdersPage() {
  const user = await getAuthenticatedCustomer();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED1] pb-4 mb-6">
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              My Orders & Trousseau Archive ({user.orders.length})
            </h1>
            <p className="text-xs text-[#756B62] mt-0.5">
              Review your purchase receipts, track courier dispatches, and access Silk Mark digital certs.
            </p>
          </div>

          <Link
            href="/collections/sarees"
            className="text-xs font-semibold text-[#5E131D] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse New Weaves</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user.orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-12 h-12 text-[#756B62] mx-auto opacity-50" />
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              No Orders Found
            </h3>
            <p className="text-xs text-[#756B62] max-w-sm mx-auto">
              Your heirloom history is currently empty. Explore our bridal silks and handlooms.
            </p>
            <Link
              href="/collections/sarees"
              className="inline-block mt-2 px-5 py-2.5 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => {
              const orderTotal = Math.round(order.totalPaise / 100);

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-xl border border-[#E8DED1] bg-[#FAF6F0]/30 space-y-4 hover:border-[#C5A880] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DED1] pb-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#1F1916]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[#756B62] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#756B62]">Grand Total:</span>
                      <span className="font-serif font-bold text-[#5E131D] text-sm">
                        {formatINR(orderTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="divide-y divide-[#E8DED1]/50 text-xs">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-serif font-bold text-[#1F1916]">
                            {item.productTitle}
                          </p>
                          <p className="text-[11px] text-[#756B62]">
                            SKU: {item.productSku} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-[#1F1916]">
                          {formatINR(Math.round(item.totalPaise / 100))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E8DED1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-[#756B62]">
                      <Truck className="w-4 h-4 text-[#5E131D]" />
                      <span>
                        {order.shipment?.trackingNumber
                          ? `Courier: ${order.shipment.courier || "Express"} (Tracking: ${order.shipment.trackingNumber})`
                          : "Standard insured courier packaging in progress"}
                      </span>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E8DED1] hover:border-[#5E131D] rounded-lg text-xs font-semibold text-[#1F1916] transition-colors self-start sm:self-auto shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#5E131D]" />
                      <span>Order Details & Invoice</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


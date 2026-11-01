import React from "react";
import Link from "next/link";
import { getAuthenticatedCustomer } from "@/lib/data/customer-data";
import { formatINR } from "@/lib/currency";
import {
  Package,
  MapPin,
  Heart,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function AccountOverviewPage() {
  const user = await getAuthenticatedCustomer();

  const totalSpentRupees = Math.round((user.customerProfile?.totalSpent || 0) / 100);
  const recentOrders = user.orders.slice(0, 3);
  const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5E131D] text-[#FAF6F0] font-serif text-2xl font-bold flex items-center justify-center shadow-md">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "SS"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
                Namaste, {user.name || "Patron"}
              </h1>
              <span className="text-[10px] bg-[#C5A880]/20 text-[#5E131D] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Royal Patron
              </span>
            </div>
            <p className="text-xs text-[#756B62] mt-0.5">
              {user.email} • Atelier Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#756B62] bg-[#FAF6F0] px-4 py-2 rounded-xl border border-[#E8DED1]">
          <ShieldCheck className="w-4 h-4 text-[#5E131D]" />
          <span>Silk Mark Certified Buyer Protection Active</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62] block">Total Orders</span>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {user.orders.length}
          </div>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Lifetime atelier purchases</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62] block">Saved Heirlooms</span>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {user.wishlistItems.length}
          </div>
          <Link
            href="/account/wishlist"
            className="text-[11px] text-[#5E131D] hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>View Wishlist</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62] block">Saved Addresses</span>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {user.addresses.length}
          </div>
          <Link
            href="/account/addresses"
            className="text-[11px] text-[#5E131D] hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>Manage Deliveries</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62] block">Trousseau Value</span>
          <div className="font-serif text-2xl font-bold text-[#5E131D]">
            {formatINR(totalSpentRupees)}
          </div>
          <span className="text-[11px] text-[#756B62]">
            Gold & Silk Mark Verified
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DED1] pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#5E131D]" />
            <h2 className="font-serif text-base font-bold text-[#1F1916]">
              Recent Atelier Orders
            </h2>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-[#5E131D] hover:underline flex items-center gap-1"
          >
            <span>View All ({user.orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#756B62] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#756B62]">
              You haven&apos;t placed any orders yet. Begin your heirloom collection today.
            </p>
            <Link
              href="/collections/sarees"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-xs hover:bg-[#4A0E17]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Pure Silks</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DED1]">
            {recentOrders.map((order) => {
              const orderTotal = Math.round(order.totalPaise / 100);

              return (
                <div
                  key={order.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F1916]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#756B62]">
                      Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} • {order.items.length} {order.items.length === 1 ? "creation" : "creations"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#1F1916] block">
                        {formatINR(orderTotal)}
                      </span>
                      <span className="text-[10px] text-[#756B62]">
                        {order.paymentMethod ? order.paymentMethod.toUpperCase() : "PAID"}
                      </span>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-3.5 py-1.5 border border-[#E8DED1] hover:border-[#5E131D] rounded-lg text-xs font-semibold text-[#1F1916] transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Grid: Primary Address & Privileges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Shipping Address */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-2">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5E131D]" />
              <span>Primary Shipping Address</span>
            </h3>
            <Link
              href="/account/addresses"
              className="text-xs text-[#5E131D] font-semibold hover:underline"
            >
              Manage
            </Link>
          </div>

          {defaultAddress ? (
            <div className="text-xs text-[#756B62] space-y-1">
              <p className="font-bold text-[#1F1916]">{defaultAddress.fullName}</p>
              <p>{defaultAddress.addressLine}</p>
              <p>
                {defaultAddress.city}, {defaultAddress.state} —{" "}
                <strong>{defaultAddress.pinCode}</strong>
              </p>
              <p>Phone: {defaultAddress.phone}</p>
            </div>
          ) : (
            <div className="text-xs text-[#756B62] space-y-2">
              <p>No delivery address saved yet.</p>
              <Link
                href="/account/addresses"
                className="inline-block px-3 py-1.5 bg-[#FAF6F0] border border-[#E8DED1] rounded text-[#5E131D] font-semibold"
              >
                + Add Delivery Address
              </Link>
            </div>
          )}
        </div>

        {/* Exclusive Royal Concierge */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8DED1] pb-2">
            <h3 className="font-serif text-sm font-bold text-[#1F1916] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>Dedicated Atelier Concierge</span>
            </h3>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Priority
            </span>
          </div>

          <p className="text-xs text-[#756B62] leading-relaxed">
            Need customized zari border length, silk mark authentication documentation, or bespoke bridal trousseau guidance?
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <a
              href="https://wa.me/919820012345"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] font-semibold rounded-lg flex items-center gap-1.5"
            >
              <span>WhatsApp Direct (+91 98200 12345)</span>
            </a>
            <Link
              href="/account/returns"
              className="px-3 py-1.5 bg-[#FAF6F0] border border-[#E8DED1] hover:border-[#5E131D] text-[#5E131D] font-semibold rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Return / Exchange</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

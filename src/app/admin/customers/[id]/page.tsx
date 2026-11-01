import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import { ArrowLeft, User, Package, MapPin, Calendar, Clock, ShieldCheck } from "lucide-react";

export default async function AdminCustomerDossierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      customerProfile: true,
      addresses: true,
      orders: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const lifetimeSpent = customer.orders.reduce((sum, o) => sum + o.totalPaise, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="space-y-1">
          <Link
            href="/admin/customers"
            className="text-xs text-[#5E131D] hover:underline flex items-center gap-1 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Patrons</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              {customer.name || "Anonymous Patron"}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#C5A880]/20 text-[#5E131D]">
              Royal Circle Patron
            </span>
          </div>
          <p className="text-xs text-[#756B62]">
            Email: {customer.email} • Registered {new Date(customer.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#756B62] block">Lifetime Value</span>
          <span className="font-serif text-2xl font-bold text-[#5E131D]">
            {formatINR(Math.round(lifetimeSpent / 100))}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Orders History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3">
            Atelier Order History ({customer.orders.length})
          </h2>

          <div className="divide-y divide-[#E8DED1]">
            {customer.orders.length === 0 ? (
              <p className="text-xs text-[#756B62] py-4">No orders placed by this patron yet.</p>
            ) : (
              customer.orders.map((o) => (
                <div key={o.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#1F1916] block">
                      #{o.orderNumber}
                    </span>
                    <span className="text-[#756B62]">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")} • {o.items.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {o.status}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#1F1916]">
                      {formatINR(Math.round(o.totalPaise / 100))}
                    </span>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-[#5E131D] font-semibold hover:underline"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Saved Addresses */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1F1916] border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5E131D]" />
              <span>Registered Shipping Destinations</span>
            </h2>

            <div className="space-y-3 text-xs text-[#756B62]">
              {customer.addresses.length === 0 ? (
                <p>No addresses recorded.</p>
              ) : (
                customer.addresses.map((a) => (
                  <div key={a.id} className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
                    <div className="flex justify-between font-bold text-[#1F1916]">
                      <span>{a.fullName}</span>
                      {a.isDefault && (
                        <span className="text-[10px] text-emerald-700 uppercase">Default</span>
                      )}
                    </div>
                    <p>{a.addressLine}</p>
                    <p>{a.city}, {a.state} — {a.pinCode}</p>
                    <p>Phone: {a.phone}</p>
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


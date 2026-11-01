import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import { Users, Search, Eye, MapPin, Package } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      customerProfile: true,
      orders: { select: { id: true, totalPaise: true, status: true } },
      addresses: true,
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
              Patrons & Client Registrations ({customers.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              RBAC Protected
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Registered customer records, purchase frequencies, delivery destinations, and trousseau histories. Passwords and payment tokens are never exposed.
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spent</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#756B62]">
                    No customer accounts registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const totalSpentPaise = c.orders.reduce((sum, o) => sum + o.totalPaise, 0);

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="py-3 px-4 font-serif font-bold text-sm text-[#1F1916]">
                        {c.name || "Anonymous Patron"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#756B62]">
                        {c.email}
                      </td>
                      <td className="py-3 px-4 text-[#756B62]">
                        {c.customerProfile?.phone || c.addresses[0]?.phone || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#1F1916]">
                        {c.orders.length}
                      </td>
                      <td className="py-3 px-4 text-right font-serif font-bold text-[#5E131D]">
                        {formatINR(Math.round(totalSpentPaise / 100))}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF6F0] hover:bg-[#5E131D] hover:text-[#FAF6F0] text-[#5E131D] border border-[#E8DED1] rounded text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
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

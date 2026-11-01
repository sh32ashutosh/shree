import React from "react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import { CreditCard, CheckCircle2, Clock, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: { user: true },
      },
      refunds: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalVolumePaise = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  const pendingCodPaise = payments
    .filter((p) => p.status === "COD_PENDING")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Payment Transactions & Gateway Reconciliation
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Razorpay Adapter
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Server-side verified transactions, Razorpay gateway signatures, COD reconciliation, and refund tracking. Never stores raw card numbers or CVV.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Captured Volume</span>
          <div className="font-serif text-2xl font-bold text-emerald-700">
            {formatINR(Math.round(totalVolumePaise / 100))}
          </div>
          <span className="text-[11px] text-[#756B62]">Authorized via UPI, Cards & Netbanking</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Pending COD Reconciliation</span>
          <div className="font-serif text-2xl font-bold text-amber-700">
            {formatINR(Math.round(pendingCodPaise / 100))}
          </div>
          <span className="text-[11px] text-[#756B62]">Awaiting courier remittance upon delivery</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Payment Gateway Provider</span>
          <div className="font-serif text-xl font-bold text-[#1F1916] flex items-center gap-2">
            <span>Razorpay / Demo</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[11px] text-emerald-700">Webhook signature verification enabled</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
          <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
            All Payment Transactions ({payments.length})
          </span>
          <span className="text-xs text-[#756B62]">Strict PCI-DSS Compliant Logging</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Transaction Reference</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Provider / Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#756B62]">
                    No payment records in database yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#1F1916]">
                      {p.providerPaymentId || `TXN-${p.id.slice(-8).toUpperCase()}`}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#5E131D]">
                      #{p.order.orderNumber}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#1F1916]">
                      {p.order.user?.name || "Patron"}
                    </td>

                    <td className="py-3 px-4 uppercase text-[#756B62]">
                      <span className="font-bold text-[#1F1916]">{p.provider}</span> • {p.method || "ONLINE"}
                    </td>

                    <td className="py-3 px-4 text-right font-serif font-bold text-sm text-[#1F1916]">
                      {formatINR(Math.round(p.amountPaise / 100))}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "COD_PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-[#756B62]">
                      {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


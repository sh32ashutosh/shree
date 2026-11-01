import React from "react";
import { prisma } from "@/lib/prisma";
import { updateReturnStatus } from "@/lib/actions/admin";
import { RotateCcw, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminReturnsPage() {
  const returnRequests = await prisma.returnRequest.findMany({
    include: {
      order: {
        include: { user: true, items: true },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  async function handleStatusUpdate(formData: FormData) {
    "use server";
    const returnId = formData.get("returnId") as string;
    const status = formData.get("status") as string;
    const note = (formData.get("note") as string)?.trim();

    if (returnId && status) {
      await updateReturnStatus(returnId, status, note || undefined);
      revalidatePath("/admin/returns");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Returns, Exchanges & Quality Inspections ({returnRequests.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              7-Day Policy Guard
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Review patron return requests, schedule reverse courier pickups, and verify Silk Mark security tag integrity prior to refund authorization.
          </p>
        </div>
      </div>

      {/* Return Requests List */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
          <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
            All Return & Exchange Claims
          </span>
          <span className="text-xs text-[#756B62]">Inspection Guild Moderation</span>
        </div>

        <div className="divide-y divide-[#E8DED1]">
          {returnRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#756B62]">
              No active return or exchange requests lodged.
            </div>
          ) : (
            returnRequests.map((ret) => (
              <div key={ret.id} className="p-6 space-y-4 hover:bg-[#FAF6F0]/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DED1] pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#1F1916]">
                      Claim #{ret.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-[#C5A880]/20 text-[#5E131D]">
                      {ret.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {ret.status}
                    </span>
                  </div>

                  <span className="text-[#756B62]">
                    Lodged {new Date(ret.createdAt).toLocaleDateString("en-IN")} by {ret.user.name || ret.user.email}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-[#1F1916]">Order Reference:</span>
                    <p className="font-mono text-[#5E131D]">#{ret.order.orderNumber}</p>
                    <span className="font-semibold text-[#1F1916] block pt-1">Reason:</span>
                    <p className="text-[#756B62]">{ret.reason}</p>
                    {ret.description && (
                      <p className="text-[11px] text-[#756B62] italic mt-1 bg-[#FAF6F0] p-2 rounded border border-[#E8DED1]">
                        &quot;{ret.description}&quot;
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-3">
                    <span className="font-serif font-bold text-xs text-[#1F1916] uppercase block">
                      Moderation Action
                    </span>

                    <form action={handleStatusUpdate} className="space-y-2">
                      <input type="hidden" name="returnId" value={ret.id} />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          name="status"
                          defaultValue={ret.status}
                          className="px-2.5 py-1.5 text-xs bg-white border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                        >
                          <option value="REQUESTED">REQUESTED</option>
                          <option value="UNDER_REVIEW">UNDER REVIEW</option>
                          <option value="APPROVED">APPROVED (Pickup Pending)</option>
                          <option value="PICKUP_SCHEDULED">PICKUP SCHEDULED</option>
                          <option value="RECEIVED">RECEIVED AT ATELIER</option>
                          <option value="INSPECTION">INSPECTION</option>
                          <option value="REFUND_PROCESSING">REFUND PROCESSING</option>
                          <option value="REFUNDED">REFUNDED (Completed)</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>

                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Update Status
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { submitReturnRequest } from "@/lib/actions/customer";
import { RotateCcw, Package, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AccountReturnsPage() {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"RETURN" | "EXCHANGE">("RETURN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("orderId", orderId.trim());
      formData.append("reason", reason);
      formData.append("description", description);
      formData.append("type", type);

      const res = await submitReturnRequest(formData);
      if (res.success) {
        toast.success("Return/Exchange request lodged! Our concierge will contact you within 24 hours.");
        setOrderId("");
        setReason("");
        setDescription("");
      } else {
        toast.error(res.error || "Failed to submit request.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E8DED1] pb-4">
          <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              Returns & Exchanges Sanctum
            </h1>
            <p className="text-xs text-[#756B62]">
              Hassle-free 7-day return guarantee on unworn sarees with security tag & Silk Mark intact.
            </p>
          </div>
        </div>

        {/* Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
            <span className="font-bold text-[#1F1916] block">7-Day Return Window</span>
            <p className="text-[#756B62]">
              Eligible within 7 days of verified courier doorstep delivery.
            </p>
          </div>
          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
            <span className="font-bold text-[#1F1916] block">Complimentary Pickup</span>
            <p className="text-[#756B62]">
              Insured courier pickup scheduled from your registered address.
            </p>
          </div>
          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-1">
            <span className="font-bold text-[#1F1916] block">Immediate Refund / Swap</span>
            <p className="text-[#756B62]">
              Processed within 48 hours of atelier quality inspection approval.
            </p>
          </div>
        </div>

        {/* Request Form */}
        <div className="pt-4 border-t border-[#E8DED1]">
          <h2 className="font-serif text-base font-bold text-[#1F1916] mb-4">
            Initiate Return or Exchange Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1 uppercase tracking-wider">
                Request Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
                  <input
                    type="radio"
                    name="returnType"
                    checked={type === "RETURN"}
                    onChange={() => setType("RETURN")}
                    className="text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <span>Return for Full Refund</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
                  <input
                    type="radio"
                    name="returnType"
                    checked={type === "EXCHANGE"}
                    onChange={() => setType("EXCHANGE")}
                    className="text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <span>Exchange for Another Weave / Color</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1 uppercase tracking-wider">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Paste Order ID or find in My Orders"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                You can copy this from your{" "}
                <Link href="/account/orders" className="text-[#5E131D] underline">
                  Orders list
                </Link>
                .
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1 uppercase tracking-wider">
                Primary Reason *
              </label>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg bg-white focus:outline-none cursor-pointer"
              >
                <option value="">Select a reason...</option>
                <option value="Color variance from screen display">Color variance from screen display</option>
                <option value="Fabric feel or weight different than anticipated">Fabric feel or weight different than anticipated</option>
                <option value="Occasion cancelled or rescheduled">Occasion cancelled or rescheduled</option>
                <option value="Defect or zari flaw noted">Defect or zari flaw noted</option>
                <option value="Prefer alternate saree weave from catalog">Prefer alternate saree weave from catalog</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1 uppercase tracking-wider">
                Notes for Atelier Inspection Team (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention any specific replacement item requested or inspection comments..."
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Formal Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


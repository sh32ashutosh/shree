"use client";

import React from "react";
import { ShippingMethodType } from "@/types/checkout";
import { Truck, Zap, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/currency";

interface ShippingMethodProps {
  selectedMethod: ShippingMethodType;
  onMethodChange: (method: ShippingMethodType) => void;
}

export function ShippingMethod({ selectedMethod, onMethodChange }: ShippingMethodProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-lg font-bold text-[#1F1916]">
          Delivery Speed & Handling
        </h3>
        <p className="text-xs text-[#756B62]">
          All orders are shipped in bespoke velvet-lined wooden keepsake boxes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard Delivery */}
        <div
          onClick={() => onMethodChange("standard")}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedMethod === "standard"
              ? "border-[#5E131D] bg-[#FDFBF7] shadow-xs"
              : "border-[#E8DED1] bg-white hover:border-[#C5A880]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#5E131D]" />
                <span className="font-bold text-sm text-[#1F1916]">Standard Delivery</span>
              </div>
              {selectedMethod === "standard" && (
                <CheckCircle2 className="w-5 h-5 text-[#5E131D]" />
              )}
            </div>
            <p className="text-xs text-[#756B62]">
              Tracked premium road/air surface. Dispatched within 24-48 hours.
            </p>
            <p className="text-xs text-[#1F1916] font-medium mt-2">
              Estimated: 4 – 6 Business Days
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8DED1] mt-3 flex justify-between items-center text-xs">
            <span className="text-[#756B62]">Courier Cost:</span>
            <span className="font-bold text-emerald-800 uppercase">FREE</span>
          </div>
        </div>

        {/* Express Delivery */}
        <div
          onClick={() => onMethodChange("express")}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedMethod === "express"
              ? "border-[#5E131D] bg-[#FDFBF7] shadow-xs"
              : "border-[#E8DED1] bg-white hover:border-[#C5A880]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C5A880]" />
                <span className="font-bold text-sm text-[#1F1916]">Express Air Delivery</span>
              </div>
              {selectedMethod === "express" && (
                <CheckCircle2 className="w-5 h-5 text-[#5E131D]" />
              )}
            </div>
            <p className="text-xs text-[#756B62]">
              Priority chartered air courier with dedicated concierge tracking.
            </p>
            <p className="text-xs text-[#1F1916] font-medium mt-2">
              Estimated: 1 – 2 Business Days
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8DED1] mt-3 flex justify-between items-center text-xs">
            <span className="text-[#756B62]">Priority Fee:</span>
            <span className="font-bold text-[#1F1916]">{formatINR(500)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

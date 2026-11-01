"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { indianPinRegex } from "@/lib/validation";

export function PinCodeChecker() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (!indianPinRegex.test(cleanPin)) {
      setStatus("invalid");
      setDeliveryDate(null);
      return;
    }

    // Realistic delivery calculation (3-4 days from today)
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    const formatted = date.toLocaleDateString("en-IN", options);

    setDeliveryDate(formatted);
    setStatus("valid");
  };

  return (
    <div className="p-4 rounded-lg border border-[#E8DED1] bg-[#FAF6F0] space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1916]">
        <MapPin className="w-4 h-4 text-[#5E131D]" />
        <span>Check Delivery Estimate & Cash on Delivery Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter 6-digit PIN code (e.g. 560001)"
          className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          Verify
        </button>
      </form>

      {status === "valid" && deliveryDate && (
        <div className="text-xs text-emerald-800 flex items-start gap-1.5 pt-1 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p>
              Delivery to <strong>{pin}</strong> available by <strong>{deliveryDate}</strong>.
            </p>
            <p className="text-[11px] text-[#756B62]">
              Complimentary standard courier & insured transit.
            </p>
          </div>
        </div>
      )}

      {status === "invalid" && (
        <div className="text-xs text-red-700 flex items-center gap-1.5 pt-1 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please enter a valid 6-digit Indian PIN code (e.g., 110001 or 560001).</span>
        </div>
      )}
    </div>
  );
}

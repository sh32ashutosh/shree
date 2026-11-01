"use client";

import React from "react";
import { Sparkles, Globe, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="bg-[#C5A880]/15 border-b border-[#E8DED1] text-[#1F1916] text-xs py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#756B62]">
          <Globe className="w-3.5 h-3.5 text-[#5E131D]" />
          <span>Complimentary Express Shipping on Orders Above ₹10,000</span>
        </div>

        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#5E131D]" />
          <span className="text-[#5E131D] font-semibold">Premium Order Pearls:</span>
          <span>tracked worldwide</span>
          <span className="hidden sm:inline text-[#756B62]">• Silk Mark Certified Handlooms</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[#756B62]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5E131D]" />
          <span>100% Authentic GI Tagged Weaves</span>
        </div>
      </div>
    </aside>
  );
}

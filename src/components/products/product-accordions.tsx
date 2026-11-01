"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { ChevronDown, ChevronUp, Sparkles, ShieldCheck, Truck } from "lucide-react";

interface ProductAccordionsProps {
  product: Product;
}

export function ProductAccordions({ product }: ProductAccordionsProps) {
  const [openSections, setOpenSections] = useState({
    details: true,
    specifications: false,
    shipping: false,
  });

  const toggle = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="border-t border-[#E8DED1] divide-y divide-[#E8DED1] mt-8">
      {/* 1. Product Details */}
      <div className="py-4">
        <button
          onClick={() => toggle("details")}
          className="w-full flex items-center justify-between text-left font-serif text-base font-bold text-[#1F1916] hover:text-[#5E131D] transition-colors focus:outline-none"
          aria-expanded={openSections.details}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Product Details & Artisan Legacy</span>
          </div>
          {openSections.details ? (
            <ChevronUp className="w-5 h-5 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#756B62]" />
          )}
        </button>

        {openSections.details && (
          <div className="pt-3 text-sm text-[#756B62] space-y-3 leading-relaxed animate-in fade-in duration-200">
            <p>{product.description}</p>
            {product.details?.artisanNotes && (
              <div className="p-3 bg-[#C5A880]/15 rounded border border-[#E8DED1] text-xs text-[#1F1916]">
                <strong className="text-[#5E131D] block mb-1">Master Weaver Note:</strong>
                <span>{product.details.artisanNotes}</span>
              </div>
            )}
            <p className="text-xs">
              Every fold and thread is inspected by our quality guild. Slight variations in the
              weave or zari spacing testify to the authentic human handloom process.
            </p>
          </div>
        )}
      </div>

      {/* 2. Specifications */}
      <div className="py-4">
        <button
          onClick={() => toggle("specifications")}
          className="w-full flex items-center justify-between text-left font-serif text-base font-bold text-[#1F1916] hover:text-[#5E131D] transition-colors focus:outline-none"
          aria-expanded={openSections.specifications}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Specifications & Fabric Care</span>
          </div>
          {openSections.specifications ? (
            <ChevronUp className="w-5 h-5 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#756B62]" />
          )}
        </button>

        {openSections.specifications && (
          <div className="pt-3 text-sm text-[#756B62] space-y-2.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-[#E8DED1]/60">
              <span className="font-semibold text-[#1F1916]">Fabric / Weave:</span>
              <span>{product.fabric} ({product.details?.weave || "Pure Handloom"})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-[#E8DED1]/60">
              <span className="font-semibold text-[#1F1916]">Work / Embellishment:</span>
              <span>{product.work.join(", ")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-[#E8DED1]/60">
              <span className="font-semibold text-[#1F1916]">Dimensions / Length:</span>
              <span>{product.details?.length || "5.5 metres standard drape"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-[#E8DED1]/60">
              <span className="font-semibold text-[#1F1916]">Blouse Piece:</span>
              <span>{product.details?.blousePiece || "Unstitched contrast silk included"}</span>
            </div>
            {product.details?.weight && (
              <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-[#E8DED1]/60">
                <span className="font-semibold text-[#1F1916]">Weight:</span>
                <span>{product.details.weight}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <span className="font-semibold text-[#1F1916]">Wash Care:</span>
              <span className="text-[#5E131D] font-medium">
                {product.details?.washCare || "Strictly Dry Clean Only. Keep in muslin."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Shipping Information */}
      <div className="py-4">
        <button
          onClick={() => toggle("shipping")}
          className="w-full flex items-center justify-between text-left font-serif text-base font-bold text-[#1F1916] hover:text-[#5E131D] transition-colors focus:outline-none"
          aria-expanded={openSections.shipping}
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C5A880]" />
            <span>Shipping & Easy 7-Day Returns</span>
          </div>
          {openSections.shipping ? (
            <ChevronUp className="w-5 h-5 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#756B62]" />
          )}
        </button>

        {openSections.shipping && (
          <div className="pt-3 text-sm text-[#756B62] space-y-2 text-xs leading-relaxed animate-in fade-in duration-200">
            <p>
              • <strong>Dispatch Timeline:</strong> Ready heirlooms are dispatched within 24 to 48
              business hours in tamper-evident wooden-cased luxury packaging.
            </p>
            <p>
              • <strong>Complimentary Domestic Delivery:</strong> Free standard shipping across all
              deliverable Indian PIN codes.
            </p>
            <p>
              • <strong>Complimentary Worldwide Shipping:</strong> Unlocked automatically on all
              orders exceeding ₹10,000.
            </p>
            <p>
              • <strong>7-Day Returns & Exchanges:</strong> If your saree is unworn and security
              tags are intact, our concierge arranges doorstep reverse pickup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

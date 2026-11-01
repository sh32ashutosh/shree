import React from "react";
import { Metadata } from "next";
import { Globe, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Worldwide Shipping & Delivery Policy | Saubhagya Sarees",
  description:
    "Complimentary express insured delivery on luxury sarees above ₹10,000. Tamper-proof packaging and worldwide tracking pearls.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="border-b border-[#E8DED1] pb-6">
          <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
            Global Logistics & Delivery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
            Shipping & Transit Policy
          </h1>
          <p className="text-xs text-[#756B62] mt-2">
            Last updated: February 2026 • Saubhagya Sarees Atelier Logistics Council
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF6F0] rounded border border-[#E8DED1] space-y-1">
            <Globe className="w-5 h-5 text-[#5E131D]" />
            <div className="font-bold text-[#1F1916]">Worldwide Pearls</div>
            <p className="text-[#756B62]">Insured courier to 120+ countries with live tracking.</p>
          </div>
          <div className="p-4 bg-[#FAF6F0] rounded border border-[#E8DED1] space-y-1">
            <Clock className="w-5 h-5 text-[#5E131D]" />
            <div className="font-bold text-[#1F1916]">Fast Dispatch</div>
            <p className="text-[#756B62]">24 to 48 business hours dispatch from our weavers.</p>
          </div>
          <div className="p-4 bg-[#FAF6F0] rounded border border-[#E8DED1] space-y-1">
            <ShieldCheck className="w-5 h-5 text-[#5E131D]" />
            <div className="font-bold text-[#1F1916]">Full Transit Cover</div>
            <p className="text-[#756B62]">100% loss and transit damage protection included.</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-[#756B62] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              1. Domestic Shipping Across India
            </h2>
            <p>
              Saubhagya Sarees provides complimentary standard road and air shipping for all
              domestic orders within India. Express Priority Delivery is available at checkout for
              a nominal fee of ₹500, guaranteeing air courier dispatch within 24 hours.
            </p>
            <p>
              Standard domestic delivery generally takes 3 to 6 business days depending on state
              jurisdictions and remote PIN codes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              2. International Worldwide Shipping
            </h2>
            <p>
              We proudly ship our handloom heirlooms across the globe, including the United
              States, United Kingdom, Canada, Australia, UAE, Singapore, and Europe.
            </p>
            <p>
              Complimentary international shipping is automatically applied on all orders
              exceeding ₹10,000. All international packages are routed via DHL Express or FedEx
              International Priority.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              3. Bespoke Keepsake Packaging
            </h2>
            <p>
              Each saree is delicately folded in unbleached pure cotton muslin to allow the silk
              fibres to breathe, then placed inside an embroidered wooden keepsake casket to protect
              the pure gold and silver zari during transit.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E8DED1] flex items-center justify-between">
            <Link href="/collections/sarees" className="text-xs text-[#5E131D] font-bold hover:underline">
              &larr; Return to Saree Collection
            </Link>
            <Link href="/policies/returns" className="text-xs text-[#5E131D] font-bold hover:underline">
              View Returns Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

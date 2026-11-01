import React from "react";
import { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy | Saubhagya Sarees",
  description:
    "Complimentary 7-day doorstep return and exchange concierge for unworn handwoven heirlooms.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="border-b border-[#E8DED1] pb-6">
          <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
            Client Satisfaction Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
            Returns & Exchanges Policy
          </h1>
          <p className="text-xs text-[#756B62] mt-2">
            7-Day Hassle-Free Concierge Reverse Pickup
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#756B62] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              1. 7-Day Return Window
            </h2>
            <p>
              We want you to be thoroughly delighted with your chosen heirloom. If for any reason
              you wish to exchange or return your saree, you may initiate a return request within 7
              calendar days of delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              2. Condition Requirements
            </h2>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  The item must be completely unworn, unwashed, and unpleated.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Original Silk Mark and GI authentication security tags must remain intact.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  The blouse piece must remain unstitched and un-detached from the main drape.
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              3. Reverse Pickup & Refund Timeline
            </h2>
            <p>
              Our courier partners will schedule an insured reverse doorstep pickup from your
              registered address. Upon receipt and examination at our Bengaluru atelier, your
              refund will be processed within 3-5 business days to your original payment method or
              issued as boutique credit.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E8DED1] flex items-center justify-between">
            <Link href="/collections/sarees" className="text-xs text-[#5E131D] font-bold hover:underline">
              &larr; Return to Saree Collection
            </Link>
            <Link href="/policies/privacy" className="text-xs text-[#5E131D] font-bold hover:underline">
              View Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

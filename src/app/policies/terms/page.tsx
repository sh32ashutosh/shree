import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#E8DED1] shadow-xs text-xs text-[#756B62] leading-relaxed">
        <Link
          href="/"
          className="text-xs text-[#5E131D] hover:underline flex items-center gap-1 font-semibold mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>

        <div>
          <span className="text-[10px] font-bold text-[#5E131D] uppercase tracking-widest block">
            Legal & Governance
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1F1916] mt-1">
            Terms of Service & Atelier Conditions
          </h1>
          <p className="text-[11px] text-[#756B62] mt-1">
            Last Updated: January 2026 • Governing Law: Jurisdiction of Pune, Maharashtra, India.
          </p>
        </div>

        <div className="space-y-6 pt-4 border-t border-[#E8DED1]">
          <section className="space-y-2">
            <h2 className="font-serif text-sm font-bold text-[#1F1916]">
              1. Authentic Handloom Craftsmanship & Natural Variations
            </h2>
            <p>
              Every pure silk saree curated by Saubhagya Sarees is handwoven by traditional artisans on authentic pit looms and frame looms. Slight irregularities in zari alignment, warp texture, or color dye depth are hallmarks of genuine handcrafting and certify that the piece is not a synthetic machine replica.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-sm font-bold text-[#1F1916]">
              2. Silk Mark Verification & GI Tags
            </h2>
            <p>
              All pure silk creations are Silk Mark authenticated. Customers receive verifiable certificates validating the natural protein purity of the mulberry silk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-sm font-bold text-[#1F1916]">
              3. Pricing, GST, and Invoicing
            </h2>
            <p>
              All displayed retail prices on the storefront are inclusive of statutory 18% Goods and Services Tax (GST) as mandated by the Government of India. Itemized tax invoices detailing Central GST (CGST) and State GST (SGST) are generated upon dispatch.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-sm font-bold text-[#1F1916]">
              4. Payment & Order Acceptance
            </h2>
            <p>
              We accept UPI, major credit/debit cards, Netbanking, and verified Cash on Delivery. Order confirmation is subject to atomic stock check verification and payment authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-sm font-bold text-[#1F1916]">
              5. Intellectual Property & Brand Rights
            </h2>
            <p>
              The Saubhagya Sarees brand name, logo, atelier photography, and proprietary catalog descriptions are protected under Indian and international intellectual property statutes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


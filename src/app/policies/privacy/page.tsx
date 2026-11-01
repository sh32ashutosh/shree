import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | Saubhagya Sarees",
  description:
    "Saubhagya Sarees client privacy and confidential data governance standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="border-b border-[#E8DED1] pb-6">
          <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
            Data Governance & Confidentiality
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#756B62] mt-2">
            Effective Date: January 2026 • Saubhagya Sarees Atelier Limited
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#756B62] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or reserve heirlooms on our storefront, we collect essential
              information required to personalize your client experience and fulfill deliveries,
              including your name, delivery address, contact telephone, and email.
            </p>
            <p>
              In this demo implementation, all client data, wishlists, and addresses are
              stored strictly within your local browser storage and are never uploaded to remote
              servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              2. Financial Security Standards
            </h2>
            <p>
              Saubhagya Sarees adheres to strict PCI-DSS level standards. We do not store raw card
              numbers, CVV codes, or UPI banking credentials. Any payment interface displayed in
              this local demonstration is clearly marked as simulated test mode.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#1F1916]">
              3. Communications & Newsletter
            </h2>
            <p>
              You may unsubscribe from our luxury bridal and preview newsletters at any time by
              clicking the unsubscribe link in our correspondence or contacting our VIP concierge.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E8DED1] flex items-center justify-between">
            <Link href="/" className="text-xs text-[#5E131D] font-bold hover:underline">
              &larr; Return to Homepage
            </Link>
            <Link href="/policies/shipping" className="text-xs text-[#5E131D] font-bold hover:underline">
              View Shipping Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

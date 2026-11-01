"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "@/lib/validation";
import { toast } from "sonner";
import {
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterForm) => {
    setSubscribed(true);
    toast.success("Welcome to the Saubhagya Connoisseur Circle!", {
      description: `A 10% privilege invitation has been sent to ${data.email}.`,
    });
    reset();
  };

  return (
    <footer className="bg-[#FAF6F0] border-t border-[#E8DED1] text-[#1F1916] mt-auto">
      {/* Upper Newsletter & Privilege Club Banner */}
      <div className="bg-[#C5A880]/15 border-b border-[#E8DED1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E131D]/10 text-[#5E131D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Saubhagya Guild</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1916]">
            Receive Rare Weaves & Royal Invitations
          </h2>
          <p className="text-sm text-[#756B62] max-w-xl mx-auto leading-relaxed">
            Subscribe to receive private previews of limited loom releases, royal bridal
            consultations, and an exclusive privilege coupon code for your next order.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2"
          >
            <div className="flex-1 text-left">
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 text-sm bg-white border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold tracking-wider uppercase rounded transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isSubmitting ? "Inviting..." : "Subscribe"}
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-emerald-800 flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>You are now subscribed to the Royal Privilege Circle.</span>
            </p>
          )}
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About Saubhagya */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#5E131D]">
                SAUBHAGYA
              </span>
              <p className="text-[10px] tracking-widest text-[#756B62] uppercase font-semibold">
                Heritage Sarees & Bridal Atelier
              </p>
            </div>
            <p className="text-xs text-[#756B62] leading-relaxed">
              Curating India&apos;s finest handwoven sarees and bridal ethnic wear since 1988. Each
              garment preserves ancient regional weaving guilds with pure gold zari, certified Silk
              Mark, and certified GI provenance.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[#756B62]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>100% Silk Mark Authenticated</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Atelier: MG Road, Bengaluru & Varanasi Guild</span>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1F1916] tracking-wide border-b border-[#E8DED1] pb-2">
              Customer Concierge
            </h3>
            <ul className="space-y-2.5 text-xs text-[#756B62]">
              <li>
                <Link
                  href="/account"
                  className="hover:text-[#5E131D] transition-colors flex items-center gap-1.5"
                >
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-[#5E131D] transition-colors flex items-center gap-1.5"
                >
                  <span>My Saved Wishlist</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Worldwide Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Returns & Exchanges Policy
                </Link>
              </li>
              <li>
                <a
                  href="tel:+919820012345"
                  className="hover:text-[#5E131D] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#5E131D]" />
                  <span>VIP Stylist: +91 98200 12345</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:concierge@saubhagyasarees.com"
                  className="hover:text-[#5E131D] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5E131D]" />
                  <span>concierge@saubhagyasarees.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections & Policies */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1F1916] tracking-wide border-b border-[#E8DED1] pb-2">
              Heritage Weaves
            </h3>
            <ul className="space-y-2.5 text-xs text-[#756B62]">
              <li>
                <Link
                  href="/collections/sarees"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Kanjivaram Silk Sarees
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sarees"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Banarasi Katan Brocades
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/lehengas"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Royal Bridal Lehengas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/heritage-loom"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Patan Patola & Paithani Weaves
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bridal-wear"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Bridal Troussseau Curations
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy"
                  className="hover:text-[#5E131D] transition-colors"
                >
                  Privacy & Data Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Artisan Empowerment & Guarantees */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1F1916] tracking-wide border-b border-[#E8DED1] pb-2">
              The Saubhagya Promise
            </h3>
            <div className="p-4 rounded border border-[#E8DED1] bg-[#FDFBF7] space-y-2 text-xs text-[#756B62]">
              <div className="font-semibold text-[#5E131D]">Direct Weaver Partnership</div>
              <p className="leading-relaxed">
                By purchasing from Saubhagya, you support over 450 hereditary weaver families
                with fair wages, healthcare, and educational scholarships.
              </p>
              <div className="pt-2 text-[11px] text-[#C5A880] font-medium flex items-center gap-1">
                <span>Handloom Authenticity Verified</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#756B62] font-semibold block mb-2">
                Accepted Secure Payment Methods
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#756B62]">
                <span className="px-2 py-1 bg-white border border-[#E8DED1] rounded">UPI</span>
                <span className="px-2 py-1 bg-white border border-[#E8DED1] rounded">Visa</span>
                <span className="px-2 py-1 bg-white border border-[#E8DED1] rounded">
                  Mastercard
                </span>
                <span className="px-2 py-1 bg-white border border-[#E8DED1] rounded">RuPay</span>
                <span className="px-2 py-1 bg-white border border-[#E8DED1] rounded">NetBanking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Demo Notice */}
        <div className="mt-12 pt-8 border-t border-[#E8DED1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#756B62] gap-4">
          <p>© {new Date().getFullYear()} Saubhagya Sarees Atelier Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/policies/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/policies/shipping" className="hover:underline">
              Shipping
            </Link>
            <span>•</span>
            <Link href="/policies/returns" className="hover:underline">
              Returns
            </Link>
          </div>
          <p className="text-[11px] text-[#756B62]/80">
            Crafted for luxury ethnic fashion connoisseurs worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

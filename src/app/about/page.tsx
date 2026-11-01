import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-[#5E131D] uppercase tracking-widest block">
            Atelier Heritage & Lineage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1916]">
            The Custodians of India&apos;s Royal Weaves
          </h1>
          <p className="text-sm text-[#756B62] leading-relaxed">
            Founded with an unwavering dedication to preserving India&apos;s master weaving guilds, Saubhagya Sarees curates heirloom handlooms that pass from mothers to daughters across generations.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8DED1] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1F1916]">
              Silk Mark Certification
            </h3>
            <p className="text-xs text-[#756B62] leading-relaxed">
              Every saree bearing the Saubhagya seal undergoes rigorous laboratory purity testing authenticated by the Central Silk Board of India.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8DED1] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1F1916]">
              Geographical Indication (GI)
            </h3>
            <p className="text-xs text-[#756B62] leading-relaxed">
              We directly support Geographical Indication clusters in Kanchipuram, Varanasi, Yeola, and Patan, protecting authentic regional looms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8DED1] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1F1916]">
              Fair Guild Livelihood
            </h3>
            <p className="text-xs text-[#756B62] leading-relaxed">
              More than 450 weaver families receive equitable compensation, loom modernization grants, and generational craft preservation support.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8DED1] shadow-xs space-y-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-widest block">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1916]">
              Woven for Life&apos;s Sacred Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-[#756B62] leading-relaxed">
              A genuine Kanjivaram or Banarasi handloom is not mere apparel; it is an enduring textile tapestry woven with authentic gold-dipped silver zari, pure mulberry silk, and weeks of patient master artistry. Encased in velvet muslin within an embroidered keepsake casket, each Saubhagya drape arrives blessed for happiness and auspicious beginnings.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/collections/sarees"
              className="px-6 py-3 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-colors"
            >
              Explore Handloom Silks
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
            >
              Consult Royal Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


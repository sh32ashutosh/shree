import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ProductShelf } from "@/components/home/product-shelf";
import { CuratedCollections } from "@/components/home/curated-collections";
import { OccasionGrid } from "@/components/home/occasion-grid";
import { PRODUCTS } from "@/data/products";
import { ShieldCheck, Award, HeartHandshake, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // Grace in Bloom: Floral, pastel, organza, light chiffons and festive favorites
  const graceInBloom = PRODUCTS.filter(
    (p) =>
      p.fabric === "Organza" ||
      p.fabric === "Chiffon" ||
      p.colors.includes("Pink") ||
      p.colors.includes("Gold") ||
      p.occasions.includes("Festive")
  ).slice(0, 8);

  // In the Spotlight: Best sellers and iconic featured creations
  const inTheSpotlight = PRODUCTS.filter((p) => p.bestSeller || p.featured).slice(0, 8);

  // Threads of Tradition: Authentic Handloom, Kanjivaram, Banarasi, and Patola weaves
  const threadsOfTradition = PRODUCTS.filter(
    (p) =>
      p.fabric === "Kanjivaram" ||
      p.fabric === "Banarasi" ||
      p.curatedCollection === "heritage-loom"
  ).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* 1. Split Hero Section */}
      <HeroSection />

      {/* 2. Shelf: Grace in Bloom */}
      <ProductShelf
        title="Grace in Bloom"
        subtitle="Botanical Whispers & Sheer Drapes"
        products={graceInBloom}
        viewAllHref="/collections/sarees?fabrics=Organza"
        viewAllText="Explore Spring Drapes"
      />

      {/* 3. Curated Collections: 3 Decorative Circles */}
      <CuratedCollections />

      {/* 4. Shelf: In the Spotlight */}
      <ProductShelf
        title="In the Spotlight"
        subtitle="Celebrated Masterpieces & Most Coveted"
        products={inTheSpotlight}
        viewAllHref="/collections/best-sellers"
        viewAllText="View All Best Sellers"
      />

      {/* 5. Shop by Occasion: 2x3 Grid */}
      <OccasionGrid />

      {/* 6. Shelf: Threads of Tradition */}
      <ProductShelf
        title="Threads of Tradition"
        subtitle="Certified Heritage Looms & Heirloom Silks"
        products={threadsOfTradition}
        viewAllHref="/collections/heritage-loom"
        viewAllText="Discover Heritage Looms"
      />

      {/* 7. The Saubhagya Heritage Pillar Band */}
      <section className="py-16 bg-[#FAF6F0] border-t border-[#E8DED1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
              Atelier Distinction
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1916]">
              The Saubhagya Distinction
            </h2>
            <p className="text-sm text-[#756B62] mt-2">
              Uncompromising dedication to the preservation of India&apos;s weaving aristocracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl border border-[#E8DED1] bg-[#FDFBF7] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F1916]">
                Silk Mark Certified
              </h3>
              <p className="text-xs text-[#756B62] leading-relaxed">
                Every pure silk thread is tested and authenticated by the Central Silk Board of
                India.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E8DED1] bg-[#FDFBF7] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F1916]">
                Authentic GI Tag
              </h3>
              <p className="text-xs text-[#756B62] leading-relaxed">
                Geographical Indication certification protecting genuine Kanchipuram and Varanasi
                origins.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E8DED1] bg-[#FDFBF7] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F1916]">
                Fair Artisan Guild
              </h3>
              <p className="text-xs text-[#756B62] leading-relaxed">
                Direct trade model providing fair livelihood and heritage longevity to 450+ weaver
                families.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E8DED1] bg-[#FDFBF7] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1F1916]">
                Keepsake Packaging
              </h3>
              <p className="text-xs text-[#756B62] leading-relaxed">
                Every saree is cushioned in pure muslin and encased in an embroidered cedar keepsake
                casket.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collections/sarees"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] font-semibold text-xs tracking-widest uppercase rounded-full shadow-md transition-colors"
            >
              Begin Your Royal Trousseau
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

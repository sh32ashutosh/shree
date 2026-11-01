"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    subtitle: "HERITAGE BRIDAL ATELIER",
    title: "Crafted For Every Happy Occasion!",
    description:
      "Pure Kanjivaram and Banarasi silk weaves, handcrafted by fourth-generation master artisans using authentic silver and gold zari.",
    buttonText: "SHOP NOW",
    buttonHref: "/collections/sarees",
    accent: "Auspicious Korvai Weaves",
  },
  {
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    subtitle: "BANARASI SILK GUILD",
    title: "Echoes of Ancient Royal Courts",
    description:
      "Immerse yourself in opulent Kadwa brocades and Shikargah motifs, revived from museum textiles for the contemporary bride.",
    buttonText: "DISCOVER BANARASI",
    buttonHref: "/collections/sarees",
    accent: "Varanasi Pure Katan",
  },
  {
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    subtitle: "ROYAL LEHENGA COUTURE",
    title: "The Regal Bridal Sanctum",
    description:
      "Velvet and raw silk bridal lehengas hand-embroidered with zardozi, dabka, and shimmering gota patti.",
    buttonText: "VIEW LEHENGAS",
    buttonHref: "/collections/lehengas",
    accent: "Handcrafted Zardozi",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative bg-[#FAF6F0] overflow-hidden border-b border-[#E8DED1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Large Editorial Image with Mandala Watermark */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-[#E8DFC8] shadow-xl bg-[#FAF6F0]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover object-top transition-all duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {/* Subtle Textile/Mandala Pattern Watermark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1916]/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 z-10 bg-[#FAF6F0]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A880] shadow-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5E131D]" />
                <span className="text-xs font-semibold tracking-wide text-[#1F1916]">
                  {slide.accent}
                </span>
              </div>
            </div>

            {/* Slide Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-5 z-20">
              <button
                onClick={prevSlide}
                className="p-2 sm:p-3 rounded-full bg-[#FAF6F0] text-[#1F1916] hover:text-[#5E131D] hover:bg-white shadow-md border border-[#E8DED1] transition-all"
                aria-label="Previous hero slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-5 z-20">
              <button
                onClick={nextSlide}
                className="p-2 sm:p-3 rounded-full bg-[#FAF6F0] text-[#1F1916] hover:text-[#5E131D] hover:bg-white shadow-md border border-[#E8DED1] transition-all"
                aria-label="Next hero slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Side: Editorial Headline, Copy & Champagne Gold Pill CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#5E131D] text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.subtitle}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1916] tracking-tight leading-[1.15]">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-[#756B62] leading-relaxed pt-2">
                {slide.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={slide.buttonHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A880] hover:bg-[#B3946C] text-[#1F1916] font-semibold text-xs tracking-widest uppercase rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections/bridal-wear"
                className="inline-flex items-center justify-center px-6 py-4 border border-[#5E131D] text-[#5E131D] hover:bg-[#5E131D] hover:text-[#FAF6F0] font-semibold text-xs tracking-widest uppercase rounded-full transition-all"
              >
                Explore Bridal
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-[#E8DED1] grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-serif text-lg font-bold text-[#5E131D]">450+</div>
                <div className="text-[11px] text-[#756B62] uppercase tracking-wider">
                  Master Weavers
                </div>
              </div>
              <div className="border-x border-[#E8DED1]">
                <div className="font-serif text-lg font-bold text-[#5E131D]">100%</div>
                <div className="text-[11px] text-[#756B62] uppercase tracking-wider">
                  Certified Silk Mark
                </div>
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-[#5E131D]">Worldwide</div>
                <div className="text-[11px] text-[#756B62] uppercase tracking-wider">
                  Tracked Pearls
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 pt-2">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-8 bg-[#5E131D]" : "w-2 bg-[#E8DED1]"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const CURATED_ITEMS = [
  {
    title: "BRIDAL WEAR",
    subtitle: "Auspicious Heirlooms & Gold Zari",
    href: "/collections/bridal-wear",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    badge: "Royal Troussseau",
  },
  {
    title: "FESTIVE PICKS",
    subtitle: "Radiant Organzas & Sheer Drapes",
    href: "/collections/festive-picks",
    image:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    badge: "Diwali & Soirees",
  },
  {
    title: "HERITAGE LOOM",
    subtitle: "Rare GI Tagged Katan & Patola",
    href: "/collections/heritage-loom",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    badge: "Certified GI Tag",
  },
];

export function CuratedCollections() {
  return (
    <section className="py-16 bg-[#FDFBF7] border-b border-[#E8DED1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E131D]/10 text-[#5E131D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sanctuaries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1916]">
            The Curated Boutiques
          </h2>
          <p className="text-sm text-[#756B62]">
            Enter dedicated sanctums of handloom excellence, curated for the most significant
            milestones of life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {CURATED_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col items-center focus:outline-none"
            >
              {/* Concentric/Dotted Decorative Outer Ring with Deep Maroon & Gold */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full p-2 transition-transform duration-500 group-hover:scale-105">
                {/* Outer concentric decorative dashed border */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C5A880] animate-spin-slow transition-opacity group-hover:border-[#5E131D]" />

                {/* Inner Maroon Ring Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#5E131D] shadow-lg bg-[#5E131D]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 240px, 300px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />

                  {/* Elegant Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5E131D]/80 via-transparent to-black/20" />

                  {/* Centered / Lower Gold Serif Label */}
                  <div className="absolute inset-x-0 bottom-6 text-center px-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#E8DFC8] font-semibold block mb-0.5">
                      {item.badge}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#FAF6F0] tracking-wider drop-shadow-sm group-hover:text-[#E8DFC8] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Subtitle text below */}
              <p className="mt-4 text-xs text-[#756B62] font-medium tracking-wide group-hover:text-[#5E131D] transition-colors">
                {item.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

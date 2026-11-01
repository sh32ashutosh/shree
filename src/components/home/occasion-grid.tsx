"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const OCCASIONS = [
  {
    name: "WEDDING",
    tagline: "Royal Trousseaus & Auspicious Silks",
    href: "/collections/sarees?occasions=Wedding",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    count: "48 Handcrafted Pieces",
  },
  {
    name: "ENGAGEMENT",
    tagline: "Cocktail Silks & Pastel Embroideries",
    href: "/collections/sarees?occasions=Engagement",
    image:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    count: "32 Contemporary Ensembles",
  },
  {
    name: "FESTIVAL",
    tagline: "Diwali, Navratri & Puja Celebrations",
    href: "/collections/sarees?occasions=Festive",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    count: "54 Radiant Weaves",
  },
  {
    name: "PARTY",
    tagline: "Metallic Tissues & Evening Drapes",
    href: "/collections/sarees?occasions=Party",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    count: "26 Modern Silhouettes",
  },
  {
    name: "CASUAL",
    tagline: "Breathable Linens & Organza Florals",
    href: "/collections/sarees?occasions=Casual",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    count: "38 Everyday Luxuries",
  },
  {
    name: "POOJA",
    tagline: "Pure Tussar & Traditional Chanderis",
    href: "/collections/sarees?occasions=Pooja",
    image:
      "https://images.unsplash.com/photo-1610030469668-935cb8a6a2aa?auto=format&fit=crop&w=800&q=80",
    count: "40 Sacred Silks",
  },
];

export function OccasionGrid() {
  return (
    <section className="py-16 bg-[#FAF6F0] border-b border-[#E8DED1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block">
            Drape For Every Milestone
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1916]">
            Shop By Occasion
          </h2>
          <p className="text-sm text-[#756B62]">
            Discover handloom fabrics tailored precisely for the cadence and emotion of your next
            grand celebration.
          </p>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.name}
              href={occasion.href}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E8DED1] hover:border-[#C5A880] shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={occasion.image}
                alt={occasion.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1916]/85 via-[#1F1916]/30 to-transparent transition-opacity group-hover:from-[#5E131D]/90" />

              {/* Content Positioned at Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between text-[#FAF6F0]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#E8DFC8] font-semibold block mb-0.5">
                    {occasion.count}
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-wide">
                    {occasion.name}
                  </h3>
                  <p className="text-xs text-[#FAF6F0]/80 mt-1 line-clamp-1">
                    {occasion.tagline}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FAF6F0]/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#C5A880] group-hover:text-[#1F1916] transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

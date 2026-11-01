import React from "react";
import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS } from "@/data/collections";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CollectionsIndexPage() {
  const collectionList = Object.values(COLLECTIONS);

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#5E131D] uppercase tracking-widest block">
            Atelier Curations
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1916]">
            Curated Silk Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#756B62] leading-relaxed">
            From majestic wedding bridal trousseaus to pure Banarasi kadwa brocades and whisper-light organza drapes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionList.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group bg-white rounded-2xl border border-[#E8DED1] overflow-hidden shadow-xs hover:border-[#5E131D] hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#FAF6F0]">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {col.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#5E131D] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                    {col.badge}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#1F1916] group-hover:text-[#5E131D] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#756B62] line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5E131D] group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

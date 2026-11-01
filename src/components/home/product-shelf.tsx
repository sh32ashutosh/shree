"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "../products/product-card";

interface ProductShelfProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllText?: string;
}

export function ProductShelf({
  title,
  subtitle,
  products,
  viewAllHref = "/collections/sarees",
  viewAllText = "View All Pieces",
}: ProductShelfProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F0] border-b border-[#E8DED1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {subtitle && (
              <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
                {subtitle}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1916]">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E131D] hover:text-[#4A0E17] uppercase tracking-wider transition-colors mr-2"
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Desktop Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full border border-[#E8DED1] bg-white text-[#1F1916] hover:bg-[#FAF6F0] hover:text-[#5E131D] shadow-xs transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full border border-[#E8DED1] bg-white text-[#1F1916] hover:bg-[#FAF6F0] hover:text-[#5E131D] shadow-xs transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        {viewAllHref && (
          <div className="sm:hidden text-center mt-6">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E131D] uppercase tracking-wider"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

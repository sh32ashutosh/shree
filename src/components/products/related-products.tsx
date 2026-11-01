"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

export function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  // Find products in same category, fabric, or tags, excluding current
  const related = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.category === currentProduct.category) scoreA += 3;
      if (b.category === currentProduct.category) scoreB += 3;
      if (a.fabric === currentProduct.fabric) scoreA += 2;
      if (b.fabric === currentProduct.fabric) scoreB += 2;
      return scoreB - scoreA;
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#E8DED1] mt-16">
      <div className="mb-8">
        <span className="text-[11px] font-semibold text-[#5E131D] uppercase tracking-widest block mb-1">
          Complete Your Trousseau
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1916]">
          You May Also Adore
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

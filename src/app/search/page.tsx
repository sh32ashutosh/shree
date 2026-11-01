"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { searchProducts } from "@/lib/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { Search, X, Sparkles } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const results = useMemo(() => {
    return searchProducts(PRODUCTS, initialQuery);
  }, [initialQuery]);

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Input Bar */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E131D]/10 text-[#5E131D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Atelier Archive</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
            {initialQuery
              ? `Results for "${initialQuery}"`
              : "Search Sarees & Ethnic Ensembles"}
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
            <div className="flex items-center border-2 border-[#5E131D] rounded-full overflow-hidden bg-white shadow-sm p-1.5 pl-4">
              <Search className="w-5 h-5 text-[#5E131D] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Kanjivaram, Banarasi, Zari, Pink, Wedding..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-[#1F1916] placeholder-[#756B62] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-[#756B62] hover:text-[#1F1916]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {initialQuery && (
            <p className="text-xs text-[#756B62]">
              Found <strong>{results.length}</strong> matching handcrafted {results.length === 1 ? "creation" : "creations"}.
            </p>
          )}
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="max-w-lg mx-auto p-12 bg-white rounded-xl border border-[#E8DED1] text-center space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1F1916]">
              No exact matches found for &quot;{initialQuery}&quot;
            </h3>
            <p className="text-xs text-[#756B62] leading-relaxed">
              We could not find items matching your search. Please check the spelling or explore
              popular categories:
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Link
                href="/collections/sarees"
                className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] text-xs font-semibold text-[#5E131D] hover:border-[#5E131D]"
              >
                All Sarees
              </Link>
              <Link
                href="/collections/sarees?fabrics=Kanjivaram"
                className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] text-xs font-semibold text-[#5E131D] hover:border-[#5E131D]"
              >
                Kanjivaram Silk
              </Link>
              <Link
                href="/collections/sarees?fabrics=Banarasi"
                className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] text-xs font-semibold text-[#5E131D] hover:border-[#5E131D]"
              >
                Banarasi Brocade
              </Link>
              <Link
                href="/collections/lehengas"
                className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8DED1] text-xs font-semibold text-[#5E131D] hover:border-[#5E131D]"
              >
                Bridal Lehengas
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#756B62]">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}

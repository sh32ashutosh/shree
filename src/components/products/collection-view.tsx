"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, FilterState, SortOption, ColorType, FabricType, OccasionType, WorkType, Collection } from "@/types/product";
import { filterProducts, sortProducts } from "@/lib/product-filters";
import { ProductCard } from "./product-card";
import { ProductFilters } from "./product-filters";
import { ProductSort } from "./product-sort";
import { Pagination } from "./pagination";
import { SlidersHorizontal, RotateCcw, PackageOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CollectionViewProps {
  collection: Collection;
  products: Product[];
}

const ITEMS_PER_PAGE = 9;

function CollectionViewInner({ collection, products }: CollectionViewProps) {
  const searchParams = useSearchParams();

  // Read initial filter values from URL searchParams
  const initialColors = (searchParams.get("colors")?.split(",").filter(Boolean) || []) as ColorType[];
  const initialFabrics = (searchParams.get("fabrics")?.split(",").filter(Boolean) || []) as FabricType[];
  const initialOccasions = (searchParams.get("occasions")?.split(",").filter(Boolean) || []) as OccasionType[];
  const initialWorks = (searchParams.get("works")?.split(",").filter(Boolean) || []) as WorkType[];
  const initialMinPrice = Number(searchParams.get("minPrice")) || 1000;
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 50000;
  const initialSort = (searchParams.get("sort") as SortOption) || "featured";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState<FilterState>({
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    colors: initialColors,
    fabrics: initialFabrics,
    occasions: initialOccasions,
    works: initialWorks,
  });

  const [sort, setSort] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute Active Filter Count
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice > 1000 || filters.maxPrice < 50000) count += 1;
    count += filters.colors.length;
    count += filters.fabrics.length;
    count += filters.occasions.length;
    count += filters.works.length;
    return count;
  }, [filters]);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.minPrice > 1000) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 50000) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
    if (filters.fabrics.length > 0) params.set("fabrics", filters.fabrics.join(","));
    if (filters.occasions.length > 0) params.set("occasions", filters.occasions.join(","));
    if (filters.works.length > 0) params.set("works", filters.works.join(","));
    if (sort !== "featured") params.set("sort", sort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [filters, sort, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 on filter update
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: 1000,
      maxPrice: 50000,
      colors: [],
      fabrics: [],
      occasions: [],
      works: [],
    });
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  // 1. Filter
  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);

  // 2. Sort
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sort);
  }, [filteredProducts, sort]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  return (
    <div className="bg-[#FAF6F0] min-h-screen pb-16">
      {/* Breadcrumb & Collection Header */}
      <div className="bg-[#FAF6F0] border-b border-[#E8DED1] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#756B62] mb-3">
            <Link href="/" className="hover:text-[#5E131D]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/collections/sarees" className="hover:text-[#5E131D]">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F1916] font-semibold">{collection.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {collection.badge && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E131D] bg-[#5E131D]/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {collection.badge}
                </span>
              )}
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1916]">
                {collection.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#756B62] max-w-2xl mt-1 leading-relaxed">
                {collection.description}
              </p>
            </div>

            <div className="text-xs text-[#756B62] shrink-0">
              Showing <strong>{sortedProducts.length}</strong> Masterpieces
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Control Bar: Mobile Filter Button & Desktop Sort */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DED1] mb-8">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E8DED1] bg-white rounded text-xs font-semibold text-[#1F1916] hover:border-[#5E131D]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#5E131D]" />
            <span>Filters {activeCount > 0 && `(${activeCount})`}</span>
          </button>

          <div className="hidden lg:block text-xs text-[#756B62]">
            {activeCount > 0 ? (
              <span className="flex items-center gap-2">
                <span>{activeCount} active filters</span>
                <button
                  onClick={handleResetFilters}
                  className="text-[#5E131D] underline hover:text-[#4A0E17]"
                >
                  Clear All
                </button>
              </span>
            ) : (
              <span>Handcrafted Handlooms</span>
            )}
          </div>

          <ProductSort value={sort} onChange={handleSortChange} />
        </div>

        {/* Layout Grid: Desktop Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#E8DED1] sticky top-28">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                activeCount={activeCount}
                totalProductsCount={sortedProducts.length}
              />
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3">
            {paginatedProducts.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center bg-[#FDFBF7] rounded-xl border border-[#E8DED1] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8DFC8]/40 text-[#5E131D] flex items-center justify-center mx-auto">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1F1916]">
                  No Matching Creations Found
                </h3>
                <p className="text-xs text-[#756B62] max-w-md mx-auto leading-relaxed">
                  We could not find any handlooms matching your selected criteria. Try adjusting the
                  price range or clearing some filters to explore our wider archive.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <>
                {/* 3-Column Desktop Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={idx < 3}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Sheet Modal */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter Options"
          className="fixed inset-0 z-50 flex justify-end lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1F1916]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-sm bg-[#FAF6F0] h-full shadow-2xl z-10 p-5 overflow-y-auto border-l border-[#E8DED1]">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              activeCount={activeCount}
              totalProductsCount={sortedProducts.length}
              isMobileModal={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function CollectionView(props: CollectionViewProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#756B62]">Loading collection...</div>}>
      <CollectionViewInner {...props} />
    </Suspense>
  );
}

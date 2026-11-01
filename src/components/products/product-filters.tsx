"use client";

import React, { useState } from "react";
import { FilterState, ColorType, FabricType, OccasionType, WorkType } from "@/types/product";
import { X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { formatINR } from "@/lib/currency";

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  activeCount: number;
  totalProductsCount: number;
  isMobileModal?: boolean;
  onCloseMobile?: () => void;
}

const COLOR_SWATCHES: { label: ColorType; hex: string; border?: boolean }[] = [
  { label: "Red", hex: "#991B1B" },
  { label: "Blue", hex: "#1E40AF" },
  { label: "Green", hex: "#065F46" },
  { label: "Gold", hex: "#C5A880" },
  { label: "Pink", hex: "#DB2777" },
  { label: "Purple", hex: "#6B21A8" },
  { label: "Black", hex: "#1F1916" },
  { label: "White", hex: "#FAF6F0", border: true },
  { label: "Multi", hex: "linear-gradient(135deg, #EF4444, #F59E0B, #10B981, #3B82F6)" },
];

const FABRIC_OPTIONS: FabricType[] = [
  "Pure Silk",
  "Cotton",
  "Georgette",
  "Organza",
  "Linen",
  "Banarasi",
  "Kanjivaram",
  "Chiffon",
];

const OCCASION_OPTIONS: OccasionType[] = [
  "Wedding",
  "Festive",
  "Party",
  "Casual",
  "Workwear",
  "Engagement",
  "Pooja",
];

const WORK_OPTIONS: WorkType[] = [
  "Zari",
  "Embroidery",
  "Print",
  "Handwork",
  "Mirror Work",
];

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  activeCount,
  totalProductsCount,
  isMobileModal = false,
  onCloseMobile,
}: ProductFiltersProps) {
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice.toString());
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice.toString());

  // Accordion state for facets
  const [openSections, setOpenSections] = useState({
    price: true,
    colors: true,
    fabrics: true,
    occasions: true,
    works: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceApply = () => {
    const min = Math.max(1000, Number(minPriceInput) || 1000);
    const max = Math.min(50000, Math.max(min, Number(maxPriceInput) || 50000));
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const toggleColor = (color: ColorType) => {
    const exists = filters.colors.includes(color);
    const updated = exists
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: updated });
  };

  const toggleFabric = (fabric: FabricType) => {
    const exists = filters.fabrics.includes(fabric);
    const updated = exists
      ? filters.fabrics.filter((f) => f !== fabric)
      : [...filters.fabrics, fabric];
    onFilterChange({ ...filters, fabrics: updated });
  };

  const toggleOccasion = (occasion: OccasionType) => {
    const exists = filters.occasions.includes(occasion);
    const updated = exists
      ? filters.occasions.filter((o) => o !== occasion)
      : [...filters.occasions, occasion];
    onFilterChange({ ...filters, occasions: updated });
  };

  const toggleWork = (work: WorkType) => {
    const exists = filters.works.includes(work);
    const updated = exists
      ? filters.works.filter((w) => w !== work)
      : [...filters.works, work];
    onFilterChange({ ...filters, works: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DED1]">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-lg font-bold text-[#1F1916]">Filters</h3>
          {activeCount > 0 && (
            <span className="text-xs bg-[#5E131D] text-[#FAF6F0] px-2 py-0.5 rounded-full font-bold">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-[#5E131D] hover:text-[#4A0E17] flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}

        {isMobileModal && (
          <button
            onClick={onCloseMobile}
            className="p-1 text-[#756B62] hover:text-[#1F1916] rounded-full"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1. Price Range Facet */}
      <div className="border-b border-[#E8DED1] pb-5">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1F1916] mb-3 text-left"
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#756B62]" />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1">
                <label className="text-[10px] text-[#756B62] uppercase block mb-1">
                  Min (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  step="500"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E8DED1] rounded text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
                />
              </div>
              <span className="text-[#756B62] mt-4">-</span>
              <div className="flex-1">
                <label className="text-[10px] text-[#756B62] uppercase block mb-1">
                  Max (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  step="500"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E8DED1] rounded text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
                />
              </div>
            </div>

            <button
              onClick={handlePriceApply}
              className="w-full py-1.5 bg-[#FAF6F0] hover:bg-[#E8DFC8]/40 border border-[#C5A880] text-[#5E131D] text-xs font-semibold rounded uppercase tracking-wider transition-colors"
            >
              Apply Price
            </button>

            <div className="text-[11px] text-[#756B62] text-center">
              Showing: {formatINR(filters.minPrice)} – {formatINR(filters.maxPrice)}
            </div>
          </div>
        )}
      </div>

      {/* 2. Color Swatches Facet */}
      <div className="border-b border-[#E8DED1] pb-5">
        <button
          onClick={() => toggleSection("colors")}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1F1916] mb-3 text-left"
        >
          <span>Color ({filters.colors.length})</span>
          {openSections.colors ? (
            <ChevronUp className="w-4 h-4 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#756B62]" />
          )}
        </button>

        {openSections.colors && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = filters.colors.includes(swatch.label);
              return (
                <button
                  key={swatch.label}
                  type="button"
                  onClick={() => toggleColor(swatch.label)}
                  className={`flex items-center gap-2 p-1.5 rounded text-xs text-left transition-all border ${
                    isSelected
                      ? "bg-[#5E131D]/10 border-[#5E131D] font-bold text-[#5E131D]"
                      : "bg-white border-[#E8DED1] text-[#1F1916] hover:border-[#C5A880]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                      swatch.border ? "border border-[#E8DED1]" : ""
                    }`}
                    style={{
                      background: swatch.hex,
                    }}
                  />
                  <span className="truncate">{swatch.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Fabric Facet */}
      <div className="border-b border-[#E8DED1] pb-5">
        <button
          onClick={() => toggleSection("fabrics")}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1F1916] mb-3 text-left"
        >
          <span>Fabric ({filters.fabrics.length})</span>
          {openSections.fabrics ? (
            <ChevronUp className="w-4 h-4 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#756B62]" />
          )}
        </button>

        {openSections.fabrics && (
          <div className="space-y-1.5 pt-1">
            {FABRIC_OPTIONS.map((fabric) => {
              const isSelected = filters.fabrics.includes(fabric);
              return (
                <label
                  key={fabric}
                  className="flex items-center gap-2.5 text-xs text-[#1F1916] cursor-pointer hover:text-[#5E131D] py-0.5 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFabric(fabric)}
                    className="w-4 h-4 rounded border-[#E8DED1] text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <span className={isSelected ? "font-bold text-[#5E131D]" : ""}>
                    {fabric}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Occasion Facet */}
      <div className="border-b border-[#E8DED1] pb-5">
        <button
          onClick={() => toggleSection("occasions")}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1F1916] mb-3 text-left"
        >
          <span>Occasion ({filters.occasions.length})</span>
          {openSections.occasions ? (
            <ChevronUp className="w-4 h-4 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#756B62]" />
          )}
        </button>

        {openSections.occasions && (
          <div className="space-y-1.5 pt-1">
            {OCCASION_OPTIONS.map((occasion) => {
              const isSelected = filters.occasions.includes(occasion);
              return (
                <label
                  key={occasion}
                  className="flex items-center gap-2.5 text-xs text-[#1F1916] cursor-pointer hover:text-[#5E131D] py-0.5 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOccasion(occasion)}
                    className="w-4 h-4 rounded border-[#E8DED1] text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <span className={isSelected ? "font-bold text-[#5E131D]" : ""}>
                    {occasion}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Work Facet */}
      <div className="border-b border-[#E8DED1] pb-5">
        <button
          onClick={() => toggleSection("works")}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1F1916] mb-3 text-left"
        >
          <span>Work / Craft ({filters.works.length})</span>
          {openSections.works ? (
            <ChevronUp className="w-4 h-4 text-[#756B62]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#756B62]" />
          )}
        </button>

        {openSections.works && (
          <div className="space-y-1.5 pt-1">
            {WORK_OPTIONS.map((work) => {
              const isSelected = filters.works.includes(work);
              return (
                <label
                  key={work}
                  className="flex items-center gap-2.5 text-xs text-[#1F1916] cursor-pointer hover:text-[#5E131D] py-0.5 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleWork(work)}
                    className="w-4 h-4 rounded border-[#E8DED1] text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <span className={isSelected ? "font-bold text-[#5E131D]" : ""}>
                    {work}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Modal Footer */}
      {isMobileModal && (
        <div className="sticky bottom-0 bg-[#FAF6F0] pt-4 border-t border-[#E8DED1] flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-3 border border-[#5E131D] text-[#5E131D] text-xs font-semibold uppercase rounded"
          >
            Reset All
          </button>
          <button
            onClick={onCloseMobile}
            className="flex-2 py-3 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase rounded"
          >
            Apply ({totalProductsCount} Results)
          </button>
        </div>
      )}
    </div>
  );
}

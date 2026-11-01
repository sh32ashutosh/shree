"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Ensure we have at least 1 image and safe bounds
  const activeImages = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
  ];

  const handlePrev = React.useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  }, [activeImages.length]);

  const handleNext = React.useCallback(() => {
    setSelectedIndex((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  }, [activeImages.length]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomOpen) {
        if (e.key === "Escape") setIsZoomOpen(false);
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, handlePrev, handleNext]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails Column */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[580px] pb-2 lg:pb-0 scrollbar-none">
        {activeImages.map((img, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded overflow-hidden border-2 transition-all ${
                isSelected
                  ? "border-[#5E131D] ring-2 ring-[#C5A880]/50"
                  : "border-[#E8DED1] hover:border-[#C5A880] opacity-80 hover:opacity-100"
              }`}
              aria-label={`View angle ${idx + 1} of ${productTitle}`}
            >
              <Image
                src={img}
                alt={`${productTitle} detail thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </button>
          );
        })}
      </div>

      {/* Main Large Portrait Image Display */}
      <div className="relative flex-1 aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#E8DED1] bg-[#FAF6F0] shadow-sm group">
        <Image
          src={activeImages[selectedIndex]}
          alt={`${productTitle} - Angle ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500"
        />

        {/* Previous Button */}
        {activeImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FAF6F0]/90 text-[#1F1916] hover:bg-white hover:text-[#5E131D] shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {activeImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FAF6F0]/90 text-[#1F1916] hover:bg-white hover:text-[#5E131D] shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-[#FAF6F0]/90 text-[#1F1916] hover:bg-white hover:text-[#5E131D] shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-4 h-4" />
          <span className="hidden sm:inline">Zoom</span>
        </button>
      </div>

      {/* Accessible Zoom Dialog Modal */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Zoom view for ${productTitle}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1916]/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-2 right-2 p-2.5 bg-[#FAF6F0] text-[#1F1916] hover:text-[#5E131D] rounded-full shadow-lg z-20 transition-colors"
              aria-label="Close zoom modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-[#FAF6F0] text-[#1F1916] hover:text-[#5E131D] rounded-full shadow-lg z-20"
                  aria-label="Previous zoomed image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#FAF6F0] text-[#1F1916] hover:text-[#5E131D] rounded-full shadow-lg z-20"
                  aria-label="Next zoomed image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* High-Res View */}
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-[#C5A880]">
              <Image
                src={activeImages[selectedIndex]}
                alt={`${productTitle} high resolution preview`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-2 bg-black/60 text-[#FAF6F0] text-xs px-3 py-1 rounded-full backdrop-blur-xs">
              {selectedIndex + 1} of {activeImages.length} • Press ESC or click outside to exit
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

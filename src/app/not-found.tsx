import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#FAF6F0] min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#E8DFC8]/40 text-[#5E131D] flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#5E131D] bg-[#5E131D]/10 px-3 py-1 rounded-full">
            404 • Heirloom Not Found
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#1F1916]">
            This Drape Eludes Us
          </h1>
          <p className="text-xs sm:text-sm text-[#756B62] leading-relaxed">
            The collection, saree, or page you sought may have concluded its loom run or moved to a
            different private sanctum.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-2.5 bg-white border border-[#E8DED1] hover:border-[#5E131D] text-[#1F1916] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/collections/sarees"
            className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Explore Sarees</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/admin";
import { ArrowLeft, Plus, Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    sku: `VAS-${Math.floor(100 + Math.random() * 900)}`,
    description: "",
    shortDescription: "",
    priceInRupees: "18500",
    originalPriceInRupees: "22000",
    fabric: "Kanjivaram",
    weave: "Authentic Korvai Handloom Weave",
    origin: "Kanchipuram, Tamil Nadu",
    length: "5.5 metres plus blouse piece (0.8 metre)",
    blousePiece: "Contrast Brocade Silk Included",
    zariType: "Pure Silver Zari (Gold-dipped)",
    careInstructions: "Strictly Dry Clean Only. Store wrapped in pure muslin cloth.",
    artisanNotes: "Woven by certified master weaver guild.",
    weight: "850 grams",
    stockQuantity: "10",
    lowStockThreshold: "3",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
    isFeatured: true,
    bestSeller: false,
    isNewArrival: true,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    seoTitle: "",
    seoDesc: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceInPaise = Math.round(Number(formData.priceInRupees) * 100);
      const originalPriceInPaise = formData.originalPriceInRupees
        ? Math.round(Number(formData.originalPriceInRupees) * 100)
        : undefined;

      const payload = {
        title: formData.title.trim(),
        sku: formData.sku.trim(),
        description: formData.description.trim() || "Authentic handcrafted luxury saree.",
        shortDescription: formData.shortDescription || undefined,
        status: formData.status,
        isFeatured: formData.isFeatured,
        bestSeller: formData.bestSeller,
        isNewArrival: formData.isNewArrival,
        isSale: !!originalPriceInPaise && originalPriceInPaise > priceInPaise,
        priceInPaise,
        originalPriceInPaise,
        fabric: formData.fabric,
        weave: formData.weave,
        origin: formData.origin,
        length: formData.length,
        blousePiece: formData.blousePiece,
        zariType: formData.zariType,
        work: ["Zari", "Handwork"],
        colors: ["Red", "Gold"],
        occasions: ["Wedding", "Festive"],
        careInstructions: formData.careInstructions,
        artisanNotes: formData.artisanNotes,
        weight: formData.weight,
        seoTitle: formData.seoTitle || formData.title,
        seoDesc: formData.seoDesc || formData.description,
        stockQuantity: Number(formData.stockQuantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 3,
        imageUrls: [formData.imageUrl.trim()],
      };

      const res = await createProduct(payload);
      if (res.success) {
        toast.success("Heirloom creation published successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create product");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg border border-[#E8DED1] hover:border-[#5E131D] text-[#756B62] hover:text-[#1F1916]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              Add New Handloom Saree to Atelier
            </h1>
            <p className="text-xs text-[#756B62]">
              Fill out weaving provenance, Silk Mark specifications, pricing, and high-res imagery.
            </p>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Details & Weaving */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Creation Identity
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Creation Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Crimson & Gold Kanjivaram Bridal Silk Saree"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Atelier SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-mono focus:outline-none focus:border-[#5E131D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Fabric Type *
                  </label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="Kanjivaram">Kanjivaram</option>
                    <option value="Banarasi">Banarasi</option>
                    <option value="Pure Silk">Pure Silk</option>
                    <option value="Organza">Organza</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Cotton">Cotton Handloom</option>
                    <option value="Linen">Pure Linen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Full Description & Weaver Story *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the zari composition, warp and weft density, pallu design, and occasion..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                />
              </div>
            </div>

            {/* Saree Provenance */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Handloom & Zari Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Authentic Weave Technique
                  </label>
                  <input
                    type="text"
                    value={formData.weave}
                    onChange={(e) => setFormData({ ...formData, weave: e.target.value })}
                    placeholder="e.g. Korvai Handloom / Kadwa Weave"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Geographical Origin
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Kanchipuram, Tamil Nadu"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Zari Type & Purity
                  </label>
                  <input
                    type="text"
                    value={formData.zariType}
                    onChange={(e) => setFormData({ ...formData, zariType: e.target.value })}
                    placeholder="e.g. Pure Silver Zari / Tested Gold Zari"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Blouse Piece Specification
                  </label>
                  <input
                    type="text"
                    value={formData.blousePiece}
                    onChange={(e) => setFormData({ ...formData, blousePiece: e.target.value })}
                    placeholder="e.g. Unstitched 0.8m Contrast Brocade"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Total Saree Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 850 grams"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    placeholder="e.g. Strictly Dry Clean Only"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* High-Resolution Media */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Product Image & Portrait URL
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Primary High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                />
                <p className="text-[11px] text-[#756B62] mt-1">
                  Stored in cloud CDN for instant high-speed responsive loading.
                </p>
              </div>
            </div>
          </div>

          {/* Side Column: Pricing & Inventory */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Atelier Pricing (INR)
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Retail Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.priceInRupees}
                  onChange={(e) => setFormData({ ...formData, priceInRupees: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Original Price (Optional Strike-through)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.originalPriceInRupees}
                  onChange={(e) => setFormData({ ...formData, originalPriceInRupees: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg text-[#756B62] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-lg border border-[#E8DED1] text-[11px] text-[#756B62]">
                Includes 18% GST portion automatically calculated for GST invoices.
              </div>
            </div>

            {/* Inventory Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Stock & Warehouse
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Low-Stock Threshold Alert
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Flags & Publishing */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Display Flags
              </h2>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5E131D]"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5E131D]"
                />
                <span>Mark as New Arrival</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5E131D]"
                />
                <span>Highlight in Best Sellers Shelf</span>
              </label>

              <div className="pt-4 border-t border-[#E8DED1]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? "Publishing Creation..." : "Publish Creation to Catalog"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


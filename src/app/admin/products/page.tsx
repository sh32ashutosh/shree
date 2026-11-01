"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useAdminStore } from "@/stores/admin-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/currency";
import { Product, ProductCategory, FabricType } from "@/types/product";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const CATEGORIES: ProductCategory[] = [
  "sarees",
  "lehengas",
  "kurtis",
  "gowns",
  "men",
  "kids",
];

const FABRICS: FabricType[] = [
  "Pure Silk",
  "Cotton",
  "Georgette",
  "Organza",
  "Linen",
  "Banarasi",
  "Kanjivaram",
  "Chiffon",
];

export default function AdminProductsPage() {
  const isHydrated = useHydrated();
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState<ProductCategory>("sarees");
  const [formFabric, setFormFabric] = useState<FabricType>("Pure Silk");
  const [formPrice, setFormPrice] = useState("18500");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formInStock, setFormInStock] = useState(true);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormSku(`VAS-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory("sarees");
    setFormFabric("Pure Silk");
    setFormPrice("18500");
    setFormOriginalPrice("");
    setFormImageUrl(
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    );
    setFormDescription("Handcrafted luxury heirloom woven by certified regional master artisans.");
    setFormInStock(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormFabric(p.fabric);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : "");
    setFormImageUrl(p.images[0] || "");
    setFormDescription(p.description);
    setFormInStock(p.inStock);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      toast.error("Product title is required.");
      return;
    }

    const priceNum = Number(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price in INR.");
      return;
    }

    const slug = formTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const productPayload = {
      title: formTitle.trim(),
      slug: slug || `saree-${Date.now()}`,
      sku: formSku.trim() || `VAS-${Date.now()}`,
      category: formCategory,
      fabric: formFabric,
      price: priceNum,
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      images: [
        formImageUrl.trim() ||
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: ["Red", "Gold"] as any,
      occasions: ["Wedding", "Festive"] as any,
      work: ["Zari", "Handwork"] as any,
      description: formDescription.trim(),
      inStock: formInStock,
      tags: ["Luxury", "Handloom", formCategory],
      createdAt: new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload,
        id: editingProduct.id,
      });
      toast.success("Heirloom updated successfully!");
    } else {
      addProduct(productPayload);
      toast.success("New creation added to catalog!");
    }

    setIsModalOpen(false);
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "in" && p.inStock) ||
        (stockFilter === "out" && !p.inStock);

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Products Catalog ({products.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Silk Mark Registry
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Manage handloom sarees, lehengas, kurtis, inventory stock levels, and luxury details.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DED1] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, or fabric..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#756B62]">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-[#E8DED1] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="text-xs bg-white border border-[#E8DED1] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in">In Stock Only</option>
            <option value="out">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product Piece</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#756B62]">
                    No products found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0 border border-[#E8DED1]">
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="font-serif font-bold text-[#1F1916] hover:text-[#5E131D] flex items-center gap-1 group line-clamp-1"
                          >
                            <span>{p.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[10px] text-[#756B62]">{p.work.join(", ")}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-[#756B62]">
                      {p.sku}
                    </td>

                    <td className="py-3 px-4 uppercase text-[10px] font-semibold text-[#5E131D]">
                      {p.category}
                    </td>

                    <td className="py-3 px-4 text-[#1F1916] font-medium">
                      {p.fabric}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1F1916]">
                        {formatINR(p.price)}
                      </div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] text-[#756B62] line-through">
                          {formatINR(p.originalPrice)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStock(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                          p.inStock
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title="Click to toggle stock status"
                      >
                        {p.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded hover:bg-[#FAF6F0] text-[#756B62] hover:text-[#5E131D] transition-colors"
                          aria-label={`Edit ${p.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.title}?`)) {
                              deleteProduct(p.id);
                              toast.info("Product removed from catalog");
                            }
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-[#756B62] hover:text-red-700 transition-colors"
                          aria-label={`Delete ${p.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8DED1] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E8DED1] bg-[#FAF6F0] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F1916]">
                  {editingProduct ? "Edit Product Creation" : "Add New Handloom Creation"}
                </h3>
                <span className="text-xs text-[#756B62]">
                  Changes immediately synchronize with the live customer storefront.
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#756B62] hover:text-[#1F1916]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Royal Indigo Kanjivaram Silk Saree"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. VAS-KANJ-909"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none uppercase cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Primary Fabric / Weave *
                  </label>
                  <select
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value as FabricType)}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                  >
                    {FABRICS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="18500"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Original Price (Optional Strike-through)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="22000"
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5E131D] focus:ring-[#5E131D]"
                  />
                  <label htmlFor="stockCheck" className="text-xs font-semibold text-[#1F1916] cursor-pointer">
                    Mark as Available & In Stock
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    High-Resolution Portrait Image URL *
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Product Description & Artisan Story
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe weave heritage, zari authenticity, and occasions..."
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E8DED1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DED1] rounded-lg text-xs font-semibold text-[#756B62] hover:text-[#1F1916]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

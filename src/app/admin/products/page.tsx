import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/currency";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shirt,
  Sparkles,
} from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Products Catalog & Weaves ({products.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Database Synced
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Manage your authentic handloom creations, Silk Mark certificates, and bridal couture pricing.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Heirloom Piece</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category / Weave</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED1]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#756B62]">
                    No active products found. Click &quot;Add New Creation&quot; to list your first saree.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const mainImage = p.images[0]?.url || "/placeholder.jpg";
                  const price = Math.round(p.priceInPaise / 100);
                  const qty = p.inventory?.quantity ?? 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#E8DED1]">
                            <Image
                              src={mainImage}
                              alt={p.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-sm text-[#1F1916] line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-[#756B62]">
                              {p.fabric || "Pure Handloom"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-[#1F1916]">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 text-[#756B62]">
                        <span className="capitalize">{p.category?.name || "Sarees"}</span>
                        {p.weave && <span className="block text-[10px]">{p.weave}</span>}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-[#1F1916]">
                        {formatINR(price)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            qty <= 0
                              ? "bg-red-100 text-red-800"
                              : qty <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {qty <= 0 ? "Out of Stock" : `${qty} in stock`}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF6F0] border border-[#E8DED1] text-[#5E131D]">
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#756B62] hover:text-[#1F1916] rounded"
                            title="Preview on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 text-[#5E131D] hover:bg-[#5E131D]/10 rounded font-semibold"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

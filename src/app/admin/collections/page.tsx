import React from "react";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Sparkles, Plus, CheckCircle2, XCircle } from "lucide-react";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  async function createCollectionAction(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string).trim();
    const title = (formData.get("title") as string)?.trim() || name;
    const description = (formData.get("description") as string)?.trim() || null;
    const isFeatured = formData.get("isFeatured") === "on";

    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    await prisma.collection.create({
      data: {
        name,
        slug,
        title,
        description,
        isFeatured,
      },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Curated Collections & Seasonal Shelves ({collections.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Merchandising
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Manage high-converting homepage shelves: Bridal Heirlooms, Festive Picks, Threads of Tradition, and Best Sellers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Featured Collections
            </span>
            <span className="text-xs text-[#756B62]">{collections.length} Collections</span>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-4 flex items-center justify-between hover:bg-[#FAF6F0]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm text-[#1F1916]">
                      {col.name}
                    </h3>
                    {col.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C5A880]/20 text-[#5E131D]">
                        Homepage Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#756B62]">
                    Slug: <span className="font-mono">/{col.slug}</span> • {col.description}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF6F0] border border-[#E8DED1] text-[#1F1916]">
                  {col._count.products} products
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#5E131D]" />
            <span>Create New Collection</span>
          </h2>

          <form action={createCollectionAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Royal Cocktail Silks"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Banner Headline / Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Glimmering Evening Drapes"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Brief editorial description for the boutique..."
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1916] cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked
                className="w-4 h-4 rounded text-[#5E131D]"
              />
              <span>Feature on Storefront Homepage</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Add Collection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


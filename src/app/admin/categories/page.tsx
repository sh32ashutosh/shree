import React from "react";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Layers, Plus, Folder, Sparkles } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  async function createCategoryAction(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string)?.trim() || null;

    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Category Architecture ({categories.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Storefront Nav Tree
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Organize handloom weaves into customer-friendly categories like Sarees, Lehengas, Kurtis, and Kids.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Active Taxonomy Nodes
            </span>
            <span className="text-xs text-[#756B62]">{categories.length} Categories</span>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between hover:bg-[#FAF6F0]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1F1916]">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#756B62]">
                      Slug: <span className="font-mono">/{cat.slug}</span> • {cat.description || "Atelier category"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF6F0] border border-[#E8DED1] text-[#1F1916]">
                    {cat._count.products} products
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#5E131D]" />
            <span>Create New Category</span>
          </h2>

          <form action={createCategoryAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Anarkali Suits"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Brief category summary for SEO and customer guidance..."
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct, archiveProduct, adjustStock } from "@/lib/actions/admin";
import { ArrowLeft, Trash2, Save, Sparkles, ExternalLink, Warehouse } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      inventory: {
        include: {
          stockMovements: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const currentPriceRupees = Math.round(product.priceInPaise / 100);
  const originalPriceRupees = product.originalPriceInPaise
    ? Math.round(product.originalPriceInPaise / 100)
    : "";

  async function handleUpdate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const fabric = formData.get("fabric") as string;
    const description = formData.get("description") as string;
    const stockQty = Number(formData.get("stockQuantity"));

    await updateProduct(id, {
      title,
      priceInPaise: Math.round(price * 100),
      fabric,
      description,
      stockQuantity: stockQty,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    redirect("/admin/products");
  }

  async function handleArchive() {
    "use server";
    await archiveProduct(id);
    redirect("/admin/products");
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg border border-[#E8DED1] hover:border-[#5E131D] text-[#756B62] hover:text-[#1F1916]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold text-[#1F1916]">
                Edit: {product.title}
              </h1>
              <span className="font-mono text-xs text-[#756B62] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E8DED1]">
                {product.sku}
              </span>
            </div>
            <p className="text-xs text-[#756B62] mt-0.5">
              Live in atelier catalog • Silk Mark authenticated piece
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="px-3.5 py-2 border border-[#E8DED1] hover:border-[#5E131D] rounded-lg text-xs font-semibold text-[#1F1916] flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront Preview</span>
          </Link>

          <form action={handleArchive}>
            <button
              type="submit"
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Archive Piece</span>
            </button>
          </form>
        </div>
      </div>

      {/* Edit Form */}
      <form action={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Creation Identity
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Creation Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={product.title}
                  required
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    name="fabric"
                    defaultValue={product.fabric || "Pure Silk"}
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={currentPriceRupees}
                    required
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-bold focus:outline-none focus:border-[#5E131D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product.description}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Warehouse Stock Units Available
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  defaultValue={product.inventory?.quantity ?? 0}
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg font-bold"
                />
              </div>

              <div className="pt-4 border-t border-[#E8DED1] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Creation Updates</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Images and Stock History */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
                Product Imagery
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-3/4 bg-[#FAF6F0] rounded-lg overflow-hidden border border-[#E8DED1]"
                  >
                    <Image
                      src={img.url}
                      alt={product.title}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent stock movements */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
              <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
                <Warehouse className="w-4 h-4 text-[#5E131D]" />
                <span>Recent Stock Movements</span>
              </h2>

              <div className="space-y-2 text-xs">
                {product.inventory?.stockMovements.length === 0 ? (
                  <p className="text-[#756B62]">No recent stock movements.</p>
                ) : (
                  product.inventory?.stockMovements.map((sm) => (
                    <div
                      key={sm.id}
                      className="p-2.5 rounded bg-[#FAF6F0] border border-[#E8DED1] space-y-0.5"
                    >
                      <div className="flex justify-between font-semibold">
                        <span>{sm.type}</span>
                        <span className={sm.quantity >= 0 ? "text-emerald-700" : "text-red-700"}>
                          {sm.quantity >= 0 ? `+${sm.quantity}` : sm.quantity}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#756B62] block">
                        {new Date(sm.createdAt).toLocaleDateString("en-IN")} • {sm.reason || "Inventory update"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


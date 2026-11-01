import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAuthenticatedCustomer } from "@/lib/data/customer-data";
import { formatINR } from "@/lib/currency";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

export default async function AccountWishlistPage() {
  const user = await getAuthenticatedCustomer();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED1] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#1F1916]">
                My Saved Heirlooms ({user.wishlistItems.length})
              </h1>
              <p className="text-xs text-[#756B62]">
                Curated collection of pure silks, bridal weaves, and festive trousseau pieces.
              </p>
            </div>
          </div>

          <Link
            href="/collections/sarees"
            className="text-xs font-semibold text-[#5E131D] hover:underline flex items-center gap-1"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user.wishlistItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-12 h-12 text-[#756B62] mx-auto opacity-40" />
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#756B62] max-w-sm mx-auto">
              Save your favorite handwoven sarees and bridal creations to revisit them anytime.
            </p>
            <Link
              href="/collections/sarees"
              className="inline-block mt-2 px-5 py-2.5 bg-[#5E131D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-xs hover:bg-[#4A0E17]"
            >
              Browse Handlooms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.wishlistItems.map((item) => {
              const product = item.product;
              const imgUrl = product.images[0]?.url || "/placeholder.jpg";
              const price = Math.round(product.priceInPaise / 100);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E8DED1] overflow-hidden group shadow-xs hover:border-[#5E131D] transition-colors"
                >
                  <div className="relative aspect-3/4 bg-[#FAF6F0] overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="p-2 rounded-full bg-white/90 text-[#5E131D] shadow-xs flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-[#5E131D]" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-[#5E131D] font-bold uppercase tracking-wider block">
                      {product.fabric || "Pure Silk"}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-[#1F1916] line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-base text-[#1F1916]">
                        {formatINR(price)}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full py-2 bg-[#FAF6F0] hover:bg-[#5E131D] hover:text-[#FAF6F0] text-[#1F1916] border border-[#E8DED1] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>View Piece</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


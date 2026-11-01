"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isHydrated = useHydrated();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = isHydrated ? isInWishlist(product.id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error("This heirloom piece is currently reserved / out of stock.");
      return;
    }

    addItem(product, 1, "One Size");
    setIsAdded(true);
    toast.success("Added to Shopping Bag", {
      description: `${product.title} has been added.`,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist(product);
    if (added) {
      toast.success("Saved to Wishlist", {
        description: `${product.title} added to your wishlist.`,
      });
    } else {
      toast.info("Removed from Wishlist", {
        description: `${product.title} removed from your wishlist.`,
      });
    }
  };

  // Discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const fallbackImg =
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative bg-[#FDFBF7] rounded border border-[#E8DED1] hover:border-[#C5A880] transition-all duration-300 flex flex-col h-full overflow-hidden shadow-xs hover:shadow-md">
      {/* Image Container with Consistent Portrait Ratio */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[#FAF6F0]"
      >
        <Image
          src={imageError ? fallbackImg : product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          onError={() => setImageError(true)}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-[#5E131D] text-[#FAF6F0] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              {discountPercent}% Off
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-[#C5A880] text-[#1F1916] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !discountPercent && (
            <span className="bg-[#1F1916] text-[#FAF6F0] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            inWishlist ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`
          }
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all duration-200 shadow-sm ${
            inWishlist
              ? "bg-[#5E131D] text-[#FAF6F0]"
              : "bg-[#FAF6F0]/90 text-[#1F1916] hover:bg-white hover:text-[#5E131D]"
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Fabric Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[10px] uppercase font-medium tracking-wider bg-[#1F1916]/80 text-[#FAF6F0] px-2 py-0.5 rounded backdrop-blur-xs">
            {product.fabric}
          </span>
        </div>
      </Link>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#756B62] uppercase tracking-wider">
            {product.sku}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-base font-semibold text-[#1F1916] hover:text-[#5E131D] transition-colors line-clamp-1 mt-0.5"
            title={product.title}
          >
            {product.title}
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-[#1F1916]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#756B62] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Full-width Add to Cart Button */}
        <div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
              !product.inStock
                ? "bg-[#E8DED1] text-[#756B62] cursor-not-allowed"
                : isAdded
                ? "bg-emerald-800 text-white"
                : "bg-[#C5A880] hover:bg-[#B3946C] text-[#1F1916]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : !product.inStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

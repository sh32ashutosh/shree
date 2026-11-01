"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductGallery } from "./product-gallery";
import { ProductAccordions } from "./product-accordions";
import { PinCodeChecker } from "./pincode-checker";
import { RelatedProducts } from "./related-products";
import {
  Heart,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
}

export function ProductDetailView({ product, allProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const isHydrated = useHydrated();

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize] = useState("One Size (5.5m + Blouse)");
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isHydrated ? isInWishlist(product.id) : false;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("This heirloom piece is currently sold out.");
      return;
    }

    setIsAdding(true);
    addItem(product, quantity, selectedSize);
    toast.success("Added to Shopping Bag", {
      description: `${quantity} × ${product.title} added to your bag.`,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      toast.error("This heirloom piece is currently sold out.");
      return;
    }

    addItem(product, quantity, selectedSize);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen pb-16">
      {/* Breadcrumb Bar */}
      <div className="bg-[#FAF6F0] border-b border-[#E8DED1] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#756B62]">
            <Link href="/" className="hover:text-[#5E131D]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/collections/${product.category}`}
              className="hover:text-[#5E131D] capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F1916] font-semibold truncate max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Product Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productTitle={product.title}
            />
          </div>

          {/* Right Column: Product Information & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Badges / Header tags */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono tracking-widest text-[#756B62] uppercase">
                  SKU: {product.sku}
                </span>

                <button
                  onClick={handleShare}
                  className="p-1.5 text-[#756B62] hover:text-[#5E131D] rounded-full hover:bg-white transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1916] leading-snug">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1916]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#756B62] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-[#FAF6F0] bg-[#5E131D] px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Tax Inclusion Notice */}
              <div className="text-xs text-[#756B62] mt-1 flex items-center gap-1.5">
                <span className="text-emerald-800 font-medium">Inclusive of taxes (18% GST)</span>
                <span>•</span>
                <span>Complimentary Shipping</span>
              </div>
            </div>

            {/* In Stock Status */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#E8DED1]">
              {product.inStock ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Ready to Ship in 24 Hours</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>Sold Out / Reserved For Archive</span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1F1916] uppercase tracking-wider">
                Drape Size
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded border-2 border-[#5E131D] bg-[#FDFBF7] text-[#5E131D]"
                >
                  {selectedSize}
                </button>
              </div>
              <p className="text-[11px] text-[#756B62]">
                Includes full 5.5m saree plus unstitched matching/contrast 0.8m blouse piece.
              </p>
            </div>

            {/* Quantity Stepper & Add To Cart Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E8DED1] rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-[#756B62] hover:text-[#1F1916] disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#1F1916]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="p-2.5 text-[#756B62] hover:text-[#1F1916] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    inWishlist
                      ? "border-[#5E131D] bg-[#5E131D]/10 text-[#5E131D]"
                      : "border-[#E8DED1] bg-white text-[#1F1916] hover:border-[#5E131D]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-current text-[#5E131D]" : ""}`} />
                  <span>{inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </button>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Champagne Gold Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-4 px-6 bg-[#C5A880] hover:bg-[#B3946C] text-[#1F1916] text-xs font-semibold uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? "Added!" : "Add to Cart"}</span>
                </button>

                {/* Deep Maroon Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full py-4 px-6 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Delivery Pincode Verification */}
            <div className="pt-2">
              <PinCodeChecker />
            </div>

            {/* Authenticity Guarantee Strips */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-[#756B62]">
              <div className="flex items-center gap-2 p-2.5 rounded bg-white border border-[#E8DED1]">
                <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>100% Certified Pure Silk Mark</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-white border border-[#E8DED1]">
                <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Genuine GI Provenance Weave</span>
              </div>
            </div>

            {/* Accordions: Product Details, Specifications, Shipping */}
            <ProductAccordions product={product} />
          </div>
        </div>

        {/* Related Products Shelf */}
        <RelatedProducts currentProduct={product} allProducts={allProducts} />
      </div>
    </div>
  );
}

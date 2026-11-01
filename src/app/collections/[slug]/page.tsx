import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { COLLECTIONS } from "@/data/collections";
import { PRODUCTS } from "@/data/products";
import { CollectionView } from "@/components/products/collection-view";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) {
    return {
      title: "Collection Not Found | Saubhagya Sarees",
    };
  }

  return {
    title: `${collection.title} | Saubhagya Sarees Atelier`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | Saubhagya Sarees`,
      description: collection.description,
      images: [{ url: collection.image }],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) {
    notFound();
  }

  // Filter products by collection category / theme
  const products = PRODUCTS.filter((product) => {
    switch (slug) {
      case "sarees":
        return product.category === "sarees";
      case "lehengas":
        return product.category === "lehengas";
      case "kurtis":
        return product.category === "kurtis";
      case "gowns":
        return product.category === "gowns";
      case "men":
        return product.category === "men";
      case "kids":
        return product.category === "kids";
      case "best-sellers":
        return product.bestSeller || product.rating === 5.0;
      case "new-arrivals":
        return product.isNewArrival || product.id === "prod-5";
      case "sale":
        return (
          product.isSale ||
          (product.originalPrice && product.originalPrice > product.price)
        );
      case "bridal-wear":
        return (
          product.curatedCollection === "bridal-wear" ||
          product.occasions.includes("Wedding")
        );
      case "festive-picks":
        return (
          product.curatedCollection === "festive-picks" ||
          product.occasions.includes("Festive")
        );
      case "heritage-loom":
        return (
          product.curatedCollection === "heritage-loom" ||
          product.fabric === "Kanjivaram" ||
          product.fabric === "Banarasi"
        );
      default:
        return true;
    }
  });

  return <CollectionView collection={collection} products={products} />;
}

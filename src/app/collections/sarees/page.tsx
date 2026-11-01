import React from "react";
import { Metadata } from "next";
import { COLLECTIONS } from "@/data/collections";
import { PRODUCTS } from "@/data/products";
import { CollectionView } from "@/components/products/collection-view";

export const metadata: Metadata = {
  title: "Saree Collection | Saubhagya Sarees Atelier",
  description:
    "Handcrafted six-yard masterpieces from master weavers across Kanchipuram, Varanasi, Paithan, and Bengal. Certified Silk Mark with authentic gold zari.",
};

export default function SareesCollectionPage() {
  const collection = COLLECTIONS["sarees"];
  const products = PRODUCTS.filter((p) => p.category === "sarees");

  return <CollectionView collection={collection} products={products} />;
}

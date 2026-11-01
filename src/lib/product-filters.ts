import { FilterState, Product, SortOption } from "@/types/product";

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // Price Filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Color Filter (OR logic within facet)
    if (filters.colors.length > 0) {
      const hasColor = product.colors.some((color) => filters.colors.includes(color));
      if (!hasColor) return false;
    }

    // Fabric Filter (OR logic within facet)
    if (filters.fabrics.length > 0) {
      if (!filters.fabrics.includes(product.fabric)) {
        return false;
      }
    }

    // Occasion Filter (OR logic within facet)
    if (filters.occasions.length > 0) {
      const hasOccasion = product.occasions.some((occ) => filters.occasions.includes(occ));
      if (!hasOccasion) return false;
    }

    // Work Filter (OR logic within facet)
    if (filters.works.length > 0) {
      const hasWork = product.work.some((w) => filters.works.includes(w));
      if (!hasWork) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;

  return products.filter((product) => {
    const matchTitle = product.title.toLowerCase().includes(q);
    const matchSku = product.sku.toLowerCase().includes(q);
    const matchCategory = product.category.toLowerCase().includes(q);
    const matchFabric = product.fabric.toLowerCase().includes(q);
    const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
    const matchWork = product.work.some((w) => w.toLowerCase().includes(q));
    const matchOccasion = product.occasions.some((o) => o.toLowerCase().includes(q));
    const matchColor = product.colors.some((c) => c.toLowerCase().includes(q));

    return (
      matchTitle ||
      matchSku ||
      matchCategory ||
      matchFabric ||
      matchTags ||
      matchWork ||
      matchOccasion ||
      matchColor
    );
  });
}

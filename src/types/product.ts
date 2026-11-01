export type FabricType =
  | "Pure Silk"
  | "Cotton"
  | "Georgette"
  | "Organza"
  | "Linen"
  | "Banarasi"
  | "Kanjivaram"
  | "Chiffon";

export type ColorType =
  | "Red"
  | "Blue"
  | "Green"
  | "Gold"
  | "Pink"
  | "Purple"
  | "Black"
  | "White"
  | "Multi";

export type OccasionType =
  | "Wedding"
  | "Festive"
  | "Party"
  | "Casual"
  | "Workwear"
  | "Engagement"
  | "Pooja";

export type WorkType =
  | "Zari"
  | "Embroidery"
  | "Print"
  | "Handwork"
  | "Mirror Work";

export type ProductCategory =
  | "sarees"
  | "lehengas"
  | "kurtis"
  | "gowns"
  | "men"
  | "kids";

export interface Product {
  id: string;
  slug: string;
  title: string;
  sku: string;
  price: number; // in INR integer
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  fabric: FabricType;
  colors: ColorType[];
  occasions: OccasionType[];
  work: WorkType[];
  description: string;
  inStock: boolean;
  tags: string[];
  createdAt: string;
  details?: {
    length?: string;
    blousePiece?: string;
    weave?: string;
    washCare?: string;
    artisanNotes?: string;
    weight?: string;
  };
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  curatedCollection?: "bridal-wear" | "festive-picks" | "heritage-loom";
}

export interface Collection {
  slug: string;
  name: string;
  title: string;
  description: string;
  image: string;
  bannerSubtitle?: string;
  badge?: string;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  colors: ColorType[];
  fabrics: FabricType[];
  occasions: OccasionType[];
  works: WorkType[];
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

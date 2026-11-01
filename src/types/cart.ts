import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSubtotal?: number;
  maxDiscount?: number;
  description: string;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  taxableAmount: number;
  taxAmount: number; // Included 18% GST display
  grandTotal: number;
}

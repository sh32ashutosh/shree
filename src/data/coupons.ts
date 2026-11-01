import { Coupon } from "@/types/cart";

export const DEMO_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: 2500,
    description: "10% off on your first luxury order (up to ₹2,500)",
  },
  {
    code: "FESTIVE500",
    discountType: "fixed",
    discountValue: 500,
    minSubtotal: 3000,
    description: "Flat ₹500 off on festive orders above ₹3,000",
  },
  {
    code: "SAUBHAGYA",
    discountType: "percentage",
    discountValue: 15,
    minSubtotal: 10000,
    maxDiscount: 4000,
    description: "Royal 15% privilege discount on orders above ₹10,000",
  },
  {
    code: "ROYAL1000",
    discountType: "fixed",
    discountValue: 1000,
    minSubtotal: 15000,
    description: "Flat ₹1,000 off on bridal & heritage collections above ₹15,000",
  },
];

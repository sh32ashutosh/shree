import { CartItem, CartTotals, Coupon } from "@/types/cart";

const GST_RATE_PERCENT = 18;

/**
 * Calculates discount amount based on active coupon and subtotal
 */
export function calculateCouponDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || subtotal <= 0) return 0;

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return 0;
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Ensure discount does not exceed subtotal
  return Math.min(discount, subtotal);
}

/**
 * Computes exact cart totals including 18% inclusive GST breakdown
 */
export function calculateCartTotals(
  items: CartItem[],
  coupon: Coupon | null,
  shippingCost: number
): CartTotals {
  const subtotal = items.reduce((acc, item) => {
    return acc + Math.round(item.product.price) * item.quantity;
  }, 0);

  const discount = calculateCouponDiscount(subtotal, coupon);
  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Included GST = inclusive amount * 18 / 118
  const taxAmount = Math.round((discountedSubtotal * GST_RATE_PERCENT) / (100 + GST_RATE_PERCENT));
  const taxableAmount = discountedSubtotal - taxAmount;

  const grandTotal = discountedSubtotal + Math.round(shippingCost);

  return {
    subtotal,
    shipping: Math.round(shippingCost),
    discount,
    taxableAmount,
    taxAmount,
    grandTotal,
  };
}

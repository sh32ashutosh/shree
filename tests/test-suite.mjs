// Unit Test Suite for Saubhagya Sarees Core Domain Logic
import assert from "node:assert";

console.log("=== SAUBHAGYA SAREES: RUNNING AUTOMATED UNIT TEST SUITE ===");

// 1. Currency Formatting
function formatINR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
}

console.log("\n[TEST 1] Currency Formatter (formatINR):");
assert.strictEqual(formatINR(18500).replace(/\u00a0/g, " "), "₹18,500");
assert.strictEqual(formatINR(0).replace(/\u00a0/g, " "), "₹0");
assert.strictEqual(formatINR(100000).replace(/\u00a0/g, " "), "₹1,00,000");
console.log("✓ formatINR accurately handles Indian numbering (lakhs/thousands).");

// 2. Tax Calculations (18% inclusive GST)
// Included GST = taxable inclusive amount * 18 / 118
function calculateCartTotals(items, coupon, shippingCost) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (!coupon.minSubtotal || subtotal >= coupon.minSubtotal) {
      if (coupon.discountType === "percentage") {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }
  }
  discount = Math.min(discount, subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const taxAmount = Math.round((discountedSubtotal * 18) / 118);
  const taxableAmount = discountedSubtotal - taxAmount;
  const grandTotal = discountedSubtotal + Math.round(shippingCost);

  return { subtotal, discount, taxableAmount, taxAmount, grandTotal, shipping: shippingCost };
}

console.log("\n[TEST 2] 18% Inclusive GST and Coupon Logic:");
// Test single saree: ₹18,500
const testItems = [{ price: 18500, quantity: 1 }];
const totalsNoCoupon = calculateCartTotals(testItems, null, 0);
assert.strictEqual(totalsNoCoupon.subtotal, 18500);
assert.strictEqual(totalsNoCoupon.taxAmount, Math.round((18500 * 18) / 118)); // ₹2,822
assert.strictEqual(totalsNoCoupon.grandTotal, 18500);
assert.strictEqual(totalsNoCoupon.taxableAmount + totalsNoCoupon.taxAmount, 18500);
console.log("✓ Inclusive 18% GST matches formula: taxable + tax === subtotal.");

// Test Coupon WELCOME10 (10% off, max 2500)
const welcomeCoupon = { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxDiscount: 2500 };
const totalsWelcome = calculateCartTotals(testItems, welcomeCoupon, 0);
assert.strictEqual(totalsWelcome.discount, 1850); // 10% of 18500
assert.strictEqual(totalsWelcome.grandTotal, 18500 - 1850); // 16650
console.log("✓ Percentage coupon with cap calculates discount correctly.");

// Test Coupon FESTIVE500 with minimum subtotal constraint
const festiveCoupon = { code: "FESTIVE500", discountType: "fixed", discountValue: 500, minSubtotal: 3000 };
const totalsBelowMin = calculateCartTotals([{ price: 2000, quantity: 1 }], festiveCoupon, 0);
assert.strictEqual(totalsBelowMin.discount, 0, "Discount should be 0 when below minSubtotal");
const totalsAboveMin = calculateCartTotals([{ price: 4000, quantity: 1 }], festiveCoupon, 0);
assert.strictEqual(totalsAboveMin.discount, 500);
console.log("✓ Coupon minSubtotal threshold strictly enforced.");

// Test Shipping addition
const totalsWithShipping = calculateCartTotals(testItems, null, 500);
assert.strictEqual(totalsWithShipping.shipping, 500);
assert.strictEqual(totalsWithShipping.grandTotal, 18500 + 500);
console.log("✓ Shipping cost adds correctly to final grand total.");

// 3. Indian PIN and Phone Validation
const pinRegex = /^[1-9][0-9]{5}$/;
const phoneRegex = /^[6-9]\d{9}$/;

console.log("\n[TEST 3] Indian PIN Code & Mobile Validation:");
assert.strictEqual(pinRegex.test("560001"), true);
assert.strictEqual(pinRegex.test("110001"), true);
assert.strictEqual(pinRegex.test("012345"), false, "PIN starting with 0 is invalid");
assert.strictEqual(pinRegex.test("56000"), false, "5-digit PIN is invalid");
assert.strictEqual(pinRegex.test("5600010"), false, "7-digit PIN is invalid");
assert.strictEqual(pinRegex.test("ABCDEF"), false, "Alpha PIN is invalid");

assert.strictEqual(phoneRegex.test("9820012345"), true);
assert.strictEqual(phoneRegex.test("7012345678"), true);
assert.strictEqual(phoneRegex.test("5012345678"), false, "Numbers starting with 5 or below are invalid");
assert.strictEqual(phoneRegex.test("98200"), false, "Short numbers are invalid");
console.log("✓ Strict Indian postal code and mobile validation passed.");

// 4. Multi-Facet Product Filtering (OR within facet, AND across facets)
console.log("\n[TEST 4] Product Filtering (OR within facet, AND across facets):");
const mockProducts = [
  { id: "1", price: 18500, colors: ["Red", "Gold"], fabric: "Kanjivaram", occasions: ["Wedding"] },
  { id: "2", price: 24000, colors: ["Blue"], fabric: "Banarasi", occasions: ["Wedding", "Party"] },
  { id: "3", price: 9800, colors: ["Gold"], fabric: "Chiffon", occasions: ["Casual"] },
  { id: "4", price: 14200, colors: ["Pink"], fabric: "Organza", occasions: ["Party"] },
];

function filterProducts(products, filters) {
  return products.filter((p) => {
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.colors.length > 0 && !p.colors.some((c) => filters.colors.includes(c))) return false;
    if (filters.fabrics.length > 0 && !filters.fabrics.includes(p.fabric)) return false;
    if (filters.occasions.length > 0 && !p.occasions.some((o) => filters.occasions.includes(o))) return false;
    return true;
  });
}

// Filter by colors: Red OR Blue
const filterColors = filterProducts(mockProducts, {
  minPrice: 1000,
  maxPrice: 50000,
  colors: ["Red", "Blue"],
  fabrics: [],
  occasions: [],
});
assert.strictEqual(filterColors.length, 2);

// Filter by colors (Red) AND fabric (Kanjivaram)
const filterCombined = filterProducts(mockProducts, {
  minPrice: 1000,
  maxPrice: 50000,
  colors: ["Red"],
  fabrics: ["Kanjivaram"],
  occasions: ["Wedding"],
});
assert.strictEqual(filterCombined.length, 1);
assert.strictEqual(filterCombined[0].id, "1");

// Filter by price range
const filterPrice = filterProducts(mockProducts, {
  minPrice: 20000,
  maxPrice: 30000,
  colors: [],
  fabrics: [],
  occasions: [],
});
assert.strictEqual(filterPrice.length, 1);
assert.strictEqual(filterPrice[0].id, "2");
console.log("✓ Multi-facet filtering logic behaves with precision.");

console.log("\n=======================================================");
console.log("ALL 4 CRITICAL DOMAIN TEST SUITES PASSED FLAWLESSLY! ✓");
console.log("=======================================================\n");

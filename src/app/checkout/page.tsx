"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";
import { useHydrated } from "@/lib/use-hydrated";
import { CheckoutStep, Address, PaymentDetails, Order } from "@/types/checkout";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { ShippingMethod } from "@/components/checkout/shipping-method";
import { PaymentMethodComponent } from "@/components/checkout/payment-method";
import { OrderSummary } from "@/components/checkout/order-summary";
import { formatINR } from "@/lib/currency";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useHydrated();

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    shippingMethod,
    setShippingMethod,
    activeCoupon,
    getTotals,
  } = useCartStore();

  const { addresses, addOrder } = useOrderStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [selectedAddressOverride, setSelectedAddressOverride] = useState<Address | null>(null);

  // Derive active address reactively
  const selectedAddress = selectedAddressOverride || (addresses.length > 0 ? addresses[0] : null);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: "upi",
    upiId: "ananya@okhdfcbank",
    cardName: "Ananya Deshmukh",
    cardNumber: "4111222233334444",
    cardExpiry: "12/28",
    bank: "HDFC Bank",
    wallet: "PhonePe Wallet",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#5E131D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#756B62]">Opening Secure Checkout...</p>
        </div>
      </div>
    );
  }

  const totals = getTotals();

  // Navigation guard
  const canNavigateTo = (step: CheckoutStep): boolean => {
    if (items.length === 0) return false;
    if (step === "cart") return true;
    if (step === "shipping") return items.length > 0;
    if (step === "payment") return items.length > 0 && selectedAddress !== null;
    if (step === "confirm")
      return items.length > 0 && selectedAddress !== null && !!paymentDetails.method;
    return false;
  };

  const handleNextStep = () => {
    if (currentStep === "cart") {
      if (items.length === 0) {
        toast.error("Your bag is empty.");
        return;
      }
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      if (!selectedAddress) {
        toast.error("Please select or add a shipping address.");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      // Validate payment method
      if (paymentDetails.method === "upi" && !paymentDetails.upiId) {
        toast.error("Please enter a valid UPI ID (e.g. name@upi)");
        return;
      }
      if (paymentDetails.method === "card" && !paymentDetails.cardNumber) {
        toast.error("Please fill in card details.");
        return;
      }
      if (paymentDetails.method === "netbanking" && !paymentDetails.bank) {
        toast.error("Please select a bank.");
        return;
      }
      if (paymentDetails.method === "wallet" && !paymentDetails.wallet) {
        toast.error("Please select a wallet.");
        return;
      }
      setCurrentStep("confirm");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "shipping") setCurrentStep("cart");
    if (currentStep === "payment") setCurrentStep("shipping");
    if (currentStep === "confirm") setCurrentStep("payment");
  };

  // Place Order handler
  const handlePlaceOrder = () => {
    if (isSubmitting) return;

    if (!selectedAddress) {
      toast.error("Missing shipping address.");
      setCurrentStep("shipping");
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SBG-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...items],
      shippingAddress: selectedAddress,
      shippingMethod: {
        id: shippingMethod,
        name: shippingMethod === "express" ? "Express Air Courier" : "Standard Delivery",
        price: shippingMethod === "express" ? 500 : 0,
        estimatedDelivery:
          shippingMethod === "express" ? "1-2 Business Days" : "4-6 Business Days",
        description: "Bespoke velvet-lined keepsake packaging.",
      },
      paymentDetails: {
        method: paymentDetails.method,
        upiId: paymentDetails.method === "upi" ? paymentDetails.upiId : undefined,
        bank: paymentDetails.method === "netbanking" ? paymentDetails.bank : undefined,
        wallet: paymentDetails.method === "wallet" ? paymentDetails.wallet : undefined,
      },
      subtotal: totals.subtotal,
      shippingCost: totals.shipping,
      discount: totals.discount,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
      couponCode: activeCoupon?.code,
      status: "Confirmed",
      isDemo: true,
    };

    // Save order in persistent store
    addOrder(newOrder);

    // Clear cart only AFTER order is stored
    clearCart();

    toast.success("Order Created Successfully!", {
      description: `Order ID: ${orderId}`,
    });

    // Navigate to order confirmation
    router.push(`/order-confirmation/${orderId}`);
  };

  // Empty cart view
  if (items.length === 0 && currentStep === "cart") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#E8DFC8]/40 text-[#5E131D] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1F1916] mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-[#756B62] max-w-md mx-auto mb-8">
          You haven&apos;t added any heirlooms to your cart yet. Explore our royal silk sarees to
          commence your trousseau.
        </p>
        <Link
          href="/collections/sarees"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest rounded-full transition-colors shadow-sm"
        >
          <span>Explore Saree Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen pb-16">
      {/* Visual Stepper */}
      <CheckoutStepper
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        canNavigateTo={canNavigateTo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Step Interaction Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: CART PANEL */}
            {currentStep === "cart" && (
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-6 shadow-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#E8DED1] pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#1F1916]">
                    Review Your Heirloom Selection ({items.length})
                  </h2>
                  <span className="text-xs text-[#756B62]">Step 1 of 4</span>
                </div>

                <div className="divide-y divide-[#E8DED1]">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center"
                    >
                      <div className="relative w-20 h-28 bg-[#E8DFC8]/30 rounded overflow-hidden shrink-0 border border-[#E8DED1]">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-serif text-sm font-bold text-[#1F1916] hover:text-[#5E131D] line-clamp-1 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#756B62] hover:text-[#5E131D] p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#756B62] mt-0.5">
                          SKU: {item.product.sku} • {item.product.fabric}
                        </p>
                        <p className="text-xs text-[#5E131D] font-medium mt-0.5">
                          Size: {item.selectedSize || "One Size (5.5m + Blouse)"}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#E8DED1] rounded bg-white">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 px-2.5 text-[#756B62] hover:text-[#1F1916]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#1F1916]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 px-2.5 text-[#756B62] hover:text-[#1F1916]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-[#1F1916]">
                              {formatINR(item.product.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-[#756B62]">
                                ({formatINR(item.product.price)} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#E8DED1]">
                  <Link
                    href="/collections/sarees"
                    className="text-xs text-[#5E131D] font-semibold hover:underline"
                  >
                    &larr; Continue Shopping
                  </Link>

                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Proceed to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {currentStep === "shipping" && (
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-8 shadow-xs animate-in fade-in">
                <ShippingForm
                  onAddressSelected={(addr) => setSelectedAddressOverride(addr)}
                  selectedAddress={selectedAddress}
                />

                <div className="pt-4 border-t border-[#E8DED1]">
                  <ShippingMethod
                    selectedMethod={shippingMethod}
                    onMethodChange={(m) => setShippingMethod(m)}
                  />
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#E8DED1]">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs text-[#756B62] hover:text-[#1F1916] font-semibold uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Bag</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === "payment" && (
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-6 shadow-xs animate-in fade-in">
                <PaymentMethodComponent
                  paymentDetails={paymentDetails}
                  onChange={(d) => setPaymentDetails(d)}
                  isValid={true}
                />

                <div className="pt-4 flex justify-between items-center border-t border-[#E8DED1]">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs text-[#756B62] hover:text-[#1F1916] font-semibold uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Review & Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRM & PLACE ORDER */}
            {currentStep === "confirm" && (
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 space-y-6 shadow-xs animate-in fade-in">
                <div className="border-b border-[#E8DED1] pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#1F1916]">
                    Final Order Verification
                  </h2>
                  <p className="text-xs text-[#756B62] mt-0.5">
                    Please review your shipping details, order contents, and simulated payment choice.
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#756B62]">
                  {/* Address Summary */}
                  <div className="p-4 rounded border border-[#E8DED1] bg-[#FAF6F0] space-y-1">
                    <span className="font-bold text-[#5E131D] uppercase tracking-wider block mb-1">
                      Deliver To:
                    </span>
                    <p className="font-bold text-[#1F1916]">{selectedAddress?.fullName}</p>
                    <p>{selectedAddress?.addressLine}</p>
                    <p>
                      {selectedAddress?.city}, {selectedAddress?.state} — {selectedAddress?.pinCode}
                    </p>
                    <p>Phone: {selectedAddress?.phone}</p>
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="text-[11px] text-[#5E131D] underline pt-1 block"
                    >
                      Change Address
                    </button>
                  </div>

                  {/* Payment & Courier Summary */}
                  <div className="p-4 rounded border border-[#E8DED1] bg-[#FAF6F0] space-y-1">
                    <span className="font-bold text-[#5E131D] uppercase tracking-wider block mb-1">
                      Courier & Payment:
                    </span>
                    <p>
                      Method:{" "}
                      <strong className="text-[#1F1916] uppercase">
                        {shippingMethod === "express" ? "Express Air" : "Standard"}
                      </strong>
                    </p>
                    <p>
                      Payment Mode:{" "}
                      <strong className="text-[#1F1916] uppercase">
                        {paymentDetails.method} (Demo Authorization)
                      </strong>
                    </p>
                    {paymentDetails.method === "upi" && (
                      <p>VPA: {paymentDetails.upiId}</p>
                    )}
                    <button
                      onClick={() => setCurrentStep("payment")}
                      className="text-[11px] text-[#5E131D] underline pt-1 block"
                    >
                      Change Payment Mode
                    </button>
                  </div>
                </div>

                {/* Security Guarantee */}
                <div className="p-4 rounded-lg bg-[#5E131D]/5 border border-[#5E131D]/20 flex items-start gap-3 text-xs text-[#5E131D]">
                  <Lock className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Demo Mode Order Placement</strong>
                    <span>
                      Clicking &ldquo;PLACE ORDER&rdquo; generates an authentic order confirmation record in your
                      local store. No credit cards will be billed.
                    </span>
                  </div>
                </div>

                {/* Final CTA Buttons */}
                <div className="pt-4 flex justify-between items-center border-t border-[#E8DED1]">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs text-[#756B62] hover:text-[#1F1916] font-semibold uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? "Generating Order..." : "PLACE ORDER"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Order Summary & Coupon (5 Cols) */}
          <div className="lg:col-span-5">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

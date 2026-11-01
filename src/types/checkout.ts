import { CartItem } from "./cart";

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export type ShippingMethodType = "standard" | "express";

export interface ShippingMethod {
  id: ShippingMethodType;
  name: string;
  price: number;
  estimatedDelivery: string;
  description: string;
}

export type PaymentMethodType = "upi" | "card" | "netbanking" | "wallet";

export interface PaymentDetails {
  method: PaymentMethodType;
  upiId?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  bank?: string;
  wallet?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentDetails: PaymentDetails;
  subtotal: number;
  shippingCost: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  couponCode?: string;
  status: "Confirmed" | "Processing" | "Dispatched" | "Delivered";
  isDemo: boolean;
}

export type CheckoutStep = "cart" | "shipping" | "payment" | "confirm";

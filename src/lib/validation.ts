import { z } from "zod";

export const indianPinRegex = /^[1-9][0-9]{5}$/;
export const indianPhoneRegex = /^[6-9]\d{9}$/;

export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name cannot exceed 80 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(indianPhoneRegex, "Enter a valid 10-digit Indian mobile number"),
  addressLine: z
    .string()
    .min(5, "Please enter your street address, apartment, or flat number"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  pinCode: z
    .string()
    .regex(indianPinRegex, "Enter a valid 6-digit Indian PIN code (e.g., 560001)"),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

export const upiPaymentSchema = z.object({
  upiId: z
    .string()
    .regex(/^[\w.-]+@[\w.-]+$/, "Enter a valid UPI ID (e.g., yourname@okhdfcbank or user@paytm)"),
});

export const cardPaymentSchema = z.object({
  cardName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be 16 digits (demo)"),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Enter valid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export const netBankingSchema = z.object({
  bank: z.string().min(1, "Please select a bank"),
});

export const walletSchema = z.object({
  wallet: z.string().min(1, "Please select a digital wallet"),
});

export const pinCodeCheckSchema = z.object({
  pin: z.string().regex(indianPinRegex, "Enter a valid 6-digit PIN code"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address for our newsletter"),
});

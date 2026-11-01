import React from "react";
import { Metadata } from "next";
import { OrderConfirmationView } from "@/components/checkout/order-confirmation-view";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Confirmation #${orderId} | Saubhagya Sarees`,
    description: "Thank you for your order with Saubhagya Sarees Atelier.",
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  return <OrderConfirmationView orderId={orderId} />;
}

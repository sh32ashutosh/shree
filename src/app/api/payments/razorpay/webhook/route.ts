import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Verify webhook signature if secret configured
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    // Idempotent processing: log event
    await prisma.webhookEvent.create({
      data: {
        provider: "razorpay",
        eventType: eventType || "unknown",
        payload: rawBody,
        status: "processed",
        processedAt: new Date(),
      },
    });

    if (eventType === "payment.captured" && paymentEntity) {
      const orderNumber = paymentEntity.notes?.order_number;
      const paymentId = paymentEntity.id;

      if (orderNumber) {
        const order = await prisma.order.findUnique({
          where: { orderNumber },
        });

        if (order) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: order.id },
              data: {
                status: "CONFIRMED",
                paymentStatus: "PAID",
              },
            }),
            prisma.payment.upsert({
              where: { orderId: order.id },
              create: {
                orderId: order.id,
                provider: "razorpay",
                providerPaymentId: paymentId,
                amountPaise: paymentEntity.amount,
                status: "PAID",
              },
              update: {
                providerPaymentId: paymentId,
                status: "PAID",
              },
            }),
            prisma.orderStatusHistory.create({
              data: {
                orderId: order.id,
                status: "CONFIRMED",
                note: `Payment captured via Razorpay: ${paymentId}`,
              },
            }),
          ]);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Webhook error" }, { status: 500 });
  }
}


"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── CHECKOUT / ORDER CREATION ─────────────────────────────────────────────

const CheckoutSchema = z.object({
  addressId: z.string(),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet", "cod", "demo"]),
  couponCode: z.string().optional(),
  isDemo: z.boolean().default(false),
});

export async function createOrder(data: z.infer<typeof CheckoutSchema>) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = CheckoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  // Verify address belongs to user
  const address = await prisma.address.findFirst({
    where: { id: parsed.data.addressId, userId },
  });
  if (!address) {
    return { success: false, error: "Invalid delivery address." };
  }

  // Get cart items from DB
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { images: true, inventory: true },
      },
    },
  });

  if (cartItems.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  // Server-side price calculation
  let subtotalPaise = 0;
  const orderItemsData: Array<{
    productId: string;
    productTitle: string;
    productSku: string;
    productImageUrl: string | null;
    pricePaise: number;
    quantity: number;
    totalPaise: number;
  }> = [];

  for (const cartItem of cartItems) {
    const product = cartItem.product;

    const availableQty = (product.inventory?.quantity || 0) - (product.inventory?.reservedQuantity || 0);
    if (availableQty < cartItem.quantity) {
      return {
        success: false,
        error: `"${product.title}" only has ${availableQty} units available. Please update your cart.`,
      };
    }

    const itemTotalPaise = product.priceInPaise * cartItem.quantity;
    subtotalPaise += itemTotalPaise;

    orderItemsData.push({
      productId: product.id,
      productTitle: product.title,
      productSku: product.sku,
      productImageUrl: product.images.find((img) => img.isMain)?.url || product.images[0]?.url || null,
      pricePaise: product.priceInPaise,
      quantity: cartItem.quantity,
      totalPaise: itemTotalPaise,
    });
  }

  // Coupon validation
  let couponDiscount = 0;
  let appliedCoupon = null;

  if (parsed.data.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: parsed.data.couponCode.toUpperCase(),
        isActive: true,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
          { OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] },
        ],
      },
    });

    if (coupon) {
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { success: false, error: "This coupon has reached its usage limit." };
      }

      if (coupon.perUserLimit) {
        const userUsageCount = await prisma.couponRedemption.count({
          where: { couponId: coupon.id, userId },
        });
        if (userUsageCount >= coupon.perUserLimit) {
          return { success: false, error: "You have already used this coupon the maximum number of times." };
        }
      }

      if (coupon.firstOrderOnly) {
        const existingOrders = await prisma.order.count({ where: { userId } });
        if (existingOrders > 0) {
          return { success: false, error: "This coupon is for first-time orders only." };
        }
      }

      if (coupon.minCartPaise && subtotalPaise < coupon.minCartPaise) {
        return {
          success: false,
          error: `This coupon requires a minimum cart value of ₹${Math.round(coupon.minCartPaise / 100).toLocaleString("en-IN")}.`,
        };
      }

      if (coupon.type === "PERCENTAGE") {
        couponDiscount = Math.round((subtotalPaise * coupon.discountValue) / 100);
        if (coupon.maxDiscountPaise && couponDiscount > coupon.maxDiscountPaise) {
          couponDiscount = coupon.maxDiscountPaise;
        }
      } else if (coupon.type === "FIXED") {
        couponDiscount = Math.min(coupon.discountValue * 100, subtotalPaise);
      }

      appliedCoupon = coupon;
    }
  }

  const GST_FREE_SHIPPING_THRESHOLD_PAISE = 1000000;
  let shippingPaise = 0;

  if (parsed.data.shippingMethod === "express") {
    shippingPaise = 50000;
  } else if (subtotalPaise < GST_FREE_SHIPPING_THRESHOLD_PAISE) {
    shippingPaise = 10000;
  }

  if (appliedCoupon?.type === "FREE_SHIPPING") {
    shippingPaise = 0;
  }

  const discountedSubtotal = Math.max(0, subtotalPaise - couponDiscount);
  const taxPaise = Math.round((discountedSubtotal * 18) / 118);
  const totalPaise = discountedSubtotal + shippingPaise;

  const orderNumber = `SAU-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  const order = await prisma.$transaction(async (tx) => {
    for (const cartItem of cartItems) {
      await tx.inventory.update({
        where: { productId: cartItem.productId },
        data: { reservedQuantity: { increment: cartItem.quantity } },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: cartItem.product.inventory!.id,
          type: "RESERVED",
          quantity: -cartItem.quantity,
          reason: "Order checkout reservation",
          reference: orderNumber,
        },
      });
    }

    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: address.id,
        status: parsed.data.paymentMethod === "cod" ? "CONFIRMED" : "PENDING",
        paymentStatus: parsed.data.paymentMethod === "cod" ? "COD_PENDING" : "PENDING",
        paymentMethod: parsed.data.paymentMethod,
        shippingMethod: parsed.data.shippingMethod,
        couponCode: appliedCoupon?.code || null,
        couponDiscount,
        subtotalPaise,
        shippingPaise,
        taxPaise,
        totalPaise,
        isDemo: parsed.data.isDemo,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: parsed.data.paymentMethod === "cod" ? "CONFIRMED" : "PENDING",
            note: "Order placed by customer",
          },
        },
      },
    });

    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        provider: parsed.data.isDemo ? "demo" : parsed.data.paymentMethod === "cod" ? "cod" : "razorpay",
        method: parsed.data.paymentMethod,
        amountPaise: totalPaise,
        status: parsed.data.paymentMethod === "cod" ? "COD_PENDING" : parsed.data.isDemo ? "PAID" : "PENDING",
      },
    });

    if (parsed.data.isDemo && parsed.data.paymentMethod !== "cod") {
      await tx.order.update({
        where: { id: newOrder.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "CONFIRMED",
          note: "Demo payment authorized",
        },
      });

      for (const cartItem of cartItems) {
        await tx.inventory.update({
          where: { productId: cartItem.productId },
          data: {
            quantity: { decrement: cartItem.quantity },
            reservedQuantity: { decrement: cartItem.quantity },
          },
        });

        await tx.stockMovement.create({
          data: {
            inventoryId: cartItem.product.inventory!.id,
            type: "ORDER_CONFIRMED",
            quantity: -cartItem.quantity,
            reason: "Order confirmed (demo)",
            reference: orderNumber,
          },
        });
      }
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    if (appliedCoupon) {
      await tx.coupon.update({
        where: { id: appliedCoupon.id },
        data: { usageCount: { increment: 1 } },
      });

      await tx.couponRedemption.create({
        data: {
          couponId: appliedCoupon.id,
          userId,
          orderId: newOrder.id,
          discount: couponDiscount,
        },
      });
    }

    return newOrder;
  });

  revalidatePath("/account/orders");
  return { success: true, orderId: order.id, orderNumber: order.orderNumber };
}

// ─── VALIDATE COUPON ────────────────────────────────────────────────────────

export async function validateCoupon(code: string, cartSubtotalPaise: number) {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.trim().toUpperCase(),
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
  });

  if (!coupon) {
    return { valid: false, message: `Coupon "${code}" is not valid or has expired.` };
  }

  if (coupon.minCartPaise && cartSubtotalPaise < coupon.minCartPaise) {
    const minAmount = Math.round(coupon.minCartPaise / 100).toLocaleString("en-IN");
    return {
      valid: false,
      message: `Minimum cart value of ₹${minAmount} required for this coupon.`,
    };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit." };
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") {
    discount = Math.round((cartSubtotalPaise * coupon.discountValue) / 100);
    if (coupon.maxDiscountPaise && discount > coupon.maxDiscountPaise) {
      discount = coupon.maxDiscountPaise;
    }
  } else if (coupon.type === "FIXED") {
    discount = Math.min(coupon.discountValue * 100, cartSubtotalPaise);
  }

  return {
    valid: true,
    discount,
    message: coupon.description || `Coupon applied! You save ₹${Math.round(discount / 100).toLocaleString("en-IN")}`,
  };
}

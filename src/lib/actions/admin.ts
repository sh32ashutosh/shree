"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProductStatus } from "@prisma/client";

// ─── PRODUCT ACTIONS ───────────────────────────────────────────────────────

const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isSale: z.boolean().default(false),
  priceInPaise: z.number().positive("Price must be positive"),
  originalPriceInPaise: z.number().optional(),
  fabric: z.string().optional(),
  weave: z.string().optional(),
  origin: z.string().optional(),
  length: z.string().optional(),
  blousePiece: z.string().optional(),
  zariType: z.string().optional(),
  work: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  occasions: z.array(z.string()).default([]),
  careInstructions: z.string().optional(),
  artisanNotes: z.string().optional(),
  weight: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  stockQuantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  imageUrls: z.array(z.string()).default([]),
});

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  const session = await requirePermission("products.create");
  const parsed = ProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const { work, colors, occasions, imageUrls, stockQuantity, lowStockThreshold, ...productData } = parsed.data;

  // Generate slug from title
  const baseSlug = productData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // Ensure unique slug
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const product = await prisma.product.create({
    data: {
      ...productData,
      slug,
      work: JSON.stringify(work),
      colors: JSON.stringify(colors),
      occasions: JSON.stringify(occasions),
      publishedAt: productData.status === "PUBLISHED" ? new Date() : null,
      images: {
        create: imageUrls.map((url, i) => ({
          url,
          sortOrder: i,
          isMain: i === 0,
        })),
      },
      inventory: {
        create: {
          quantity: stockQuantity,
          lowStockThreshold,
        },
      },
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      details: JSON.stringify({ title: product.title, sku: product.sku }),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, productId: product.id };
}

export async function updateProduct(productId: string, data: Partial<z.infer<typeof ProductSchema>>) {
  const session = await requirePermission("products.update");

  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existing) return { success: false, error: "Product not found." };

  const { work, colors, occasions, imageUrls, stockQuantity, lowStockThreshold, ...updateData } = data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...updateData,
      ...(work !== undefined && { work: JSON.stringify(work) }),
      ...(colors !== undefined && { colors: JSON.stringify(colors) }),
      ...(occasions !== undefined && { occasions: JSON.stringify(occasions) }),
      ...(updateData.status === "PUBLISHED" && !existing.publishedAt && { publishedAt: new Date() }),
    },
  });

  // Update inventory if provided
  if (stockQuantity !== undefined || lowStockThreshold !== undefined) {
    await prisma.inventory.upsert({
      where: { productId },
      create: { productId, quantity: stockQuantity || 0, lowStockThreshold: lowStockThreshold || 5 },
      update: {
        ...(stockQuantity !== undefined && { quantity: stockQuantity }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: productId,
      details: JSON.stringify(updateData),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
  return { success: true };
}

export async function archiveProduct(productId: string) {
  const session = await requirePermission("products.delete");

  // Check if product has active orders
  const activeOrders = await prisma.orderItem.count({
    where: {
      productId,
      order: {
        status: { notIn: ["DELIVERED", "CANCELLED", "RETURNED"] },
      },
    },
  });

  if (activeOrders > 0) {
    return {
      success: false,
      error: `Cannot archive: product is referenced in ${activeOrders} active order(s). Archive will be blocked until orders are fulfilled.`,
    };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "PRODUCT_ARCHIVED",
      entityType: "Product",
      entityId: productId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

// ─── INVENTORY ACTIONS ─────────────────────────────────────────────────────

export async function adjustStock(
  productId: string,
  adjustment: number,
  reason: string,
  type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGED" | "RETURNED"
) {
  const session = await requirePermission("inventory.adjust");

  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    return { success: false, error: "Inventory record not found." };
  }

  const newQuantity = inventory.quantity + adjustment;
  if (newQuantity < 0) {
    return { success: false, error: `Cannot reduce stock below 0. Current: ${inventory.quantity}, Adjustment: ${adjustment}` };
  }

  await prisma.$transaction([
    prisma.inventory.update({
      where: { productId },
      data: { quantity: newQuantity },
    }),
    prisma.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        type,
        quantity: adjustment,
        reason,
        actorId: session.user!.id,
        actorName: session.user!.name || session.user!.email,
      },
    }),
  ]);

  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "INVENTORY_ADJUSTED",
      entityType: "Inventory",
      entityId: inventory.id,
      details: JSON.stringify({ productId, adjustment, reason, newQuantity }),
    },
  });

  revalidatePath("/admin/inventory");
  return { success: true, newQuantity };
}

// ─── ORDER ACTIONS ─────────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED", "CONFIRMED"],
  CANCELLED: [],
  RETURNED: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  note?: string
) {
  const session = await requirePermission("orders.update");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) return { success: false, error: "Order not found." };

  const allowedNext = VALID_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    return {
      success: false,
      error: `Invalid transition: ${order.status} → ${newStatus}. Allowed: ${allowedNext.join(", ") || "none"}`,
    };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus as any,
        handledById: session.user!.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: newStatus as any,
        note: note || null,
        actorId: session.user!.id,
        actorName: session.user!.name || session.user!.email,
      },
    }),
  ]);

  if (newStatus === "DELIVERED") {
    await prisma.customerProfile.updateMany({
      where: { userId: order.userId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: order.totalPaise },
      },
    });

    await prisma.stockReservation.deleteMany({
      where: { orderId },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "ORDER_STATUS_UPDATED",
      entityType: "Order",
      entityId: orderId,
      details: JSON.stringify({ from: order.status, to: newStatus, note }),
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updateShipment(
  orderId: string,
  data: {
    courier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDate?: Date;
  }
) {
  await requirePermission("shipping.manage");

  await prisma.shipment.upsert({
    where: { orderId },
    create: { orderId, ...data, status: "DISPATCHED" },
    update: { ...data, status: "DISPATCHED" },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

// ─── COUPON ACTIONS ────────────────────────────────────────────────────────

const CouponSchema = z.object({
  code: z.string().min(3).max(30),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  discountValue: z.number().positive(),
  maxDiscountPaise: z.number().optional(),
  minCartPaise: z.number().optional(),
  usageLimit: z.number().optional(),
  perUserLimit: z.number().default(1),
  firstOrderOnly: z.boolean().default(false),
  startsAt: z.date().optional(),
  expiresAt: z.date().optional(),
  description: z.string().optional(),
});

export async function createCoupon(data: z.infer<typeof CouponSchema>) {
  await requirePermission("coupons.manage");

  const parsed = CouponSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const existing = await prisma.coupon.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
  });
  if (existing) {
    return { success: false, error: "Coupon code already exists." };
  }

  const coupon = await prisma.coupon.create({
    data: { ...parsed.data, code: parsed.data.code.toUpperCase() },
  });

  revalidatePath("/admin/coupons");
  return { success: true, couponId: coupon.id };
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
  await requirePermission("coupons.manage");

  await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ─── RETURN MANAGEMENT ─────────────────────────────────────────────────────

export async function updateReturnStatus(
  returnId: string,
  status: string,
  note?: string
) {
  const session = await requirePermission("returns.manage");

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnId },
  });

  if (!returnRequest) return { success: false, error: "Return request not found." };

  await prisma.returnRequest.update({
    where: { id: returnId },
    data: {
      status: status as any,
      notes: note ? `${returnRequest.notes || ""}\n${new Date().toISOString()}: ${note}` : returnRequest.notes,
      handledById: session.user!.id,
    },
  });

  revalidatePath("/admin/returns");
  return { success: true };
}

// ─── REVIEW MODERATION ─────────────────────────────────────────────────────

export async function moderateReview(
  reviewId: string,
  status: "APPROVED" | "REJECTED" | "FLAGGED"
) {
  await requirePermission("reviews.moderate");

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { success: false, error: "Review not found." };

  await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  if (status === "APPROVED") {
    const reviews = await prisma.review.findMany({
      where: { productId: review.productId, status: "APPROVED" },
      select: { rating: true },
    });

    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round(avg * 10) / 10,
        reviewCount: reviews.length,
      },
    });
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

// ─── STAFF MANAGEMENT ──────────────────────────────────────────────────────

export async function createStaffMember(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const session = await requirePermission("staff.manage");

  if ((session.user as any).role !== "SUPER_ADMIN") {
    return { success: false, error: "Only Super Admins can create staff members." };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { success: false, error: "User with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role as any,
      adminProfile: {
        create: {},
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user!.id,
      actorName: session.user!.name || session.user!.email,
      actorRole: (session.user as any).role,
      action: "STAFF_CREATED",
      entityType: "User",
      details: JSON.stringify({ email: data.email, role: data.role }),
    },
  });

  revalidatePath("/admin/staff");
  return { success: true };
}

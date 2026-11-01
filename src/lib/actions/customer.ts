"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/rbac";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── CUSTOMER REGISTRATION ─────────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export async function registerCustomer(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          phone: phone || null,
        },
      },
    },
  });

  return { success: true };
}

// ─── PROFILE UPDATE ────────────────────────────────────────────────────────

const UpdateProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
});

export async function updateCustomerProfile(formData: FormData) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
  };

  const parsed = UpdateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  });

  await prisma.customerProfile.upsert({
    where: { userId },
    create: { userId, phone: parsed.data.phone },
    update: { phone: parsed.data.phone },
  });

  revalidatePath("/account/profile");
  return { success: true };
}

// ─── PASSWORD CHANGE ───────────────────────────────────────────────────────

export async function changePassword(formData: FormData) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user?.password) {
    return { success: false, error: "Cannot change password for this account type." };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return { success: false, error: "Current password is incorrect." };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { success: true };
}

// ─── ADDRESS MANAGEMENT ────────────────────────────────────────────────────

const AddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  addressLine: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().length(6, "PIN code must be 6 digits"),
  type: z.enum(["Home", "Office", "Other"]).default("Home"),
  isDefault: z.boolean().optional(),
});

export async function addAddress(formData: FormData) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const raw = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    addressLine: formData.get("addressLine") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    pinCode: formData.get("pinCode") as string,
    type: (formData.get("type") as string) || "Home",
    isDefault: formData.get("isDefault") === "true",
  };

  const parsed = AddressSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      addressLine: parsed.data.addressLine,
      city: parsed.data.city,
      state: parsed.data.state,
      pinCode: parsed.data.pinCode,
      type: parsed.data.type,
      isDefault: parsed.data.isDefault ?? false,
      userId,
    },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    return { success: false, error: "Address not found." };
  }

  await prisma.address.delete({ where: { id: addressId } });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function setDefaultAddress(addressId: string) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    return { success: false, error: "Address not found." };
  }

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

// ─── WISHLIST ──────────────────────────────────────────────────────────────

export async function toggleWishlistItem(productId: string) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { success: true, added: false };
  } else {
    await prisma.wishlistItem.create({
      data: { userId, productId },
    });
    return { success: true, added: true };
  }
}

// ─── RETURN REQUEST ────────────────────────────────────────────────────────

export async function submitReturnRequest(formData: FormData) {
  const session = await requireCustomer();
  const userId = session.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const orderId = formData.get("orderId") as string;
  const reason = formData.get("reason") as string;
  const description = formData.get("description") as string;
  const type = (formData.get("type") as "RETURN" | "EXCHANGE") || "RETURN";

  if (!orderId || !reason) {
    return { success: false, error: "Order ID and reason are required." };
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, status: "DELIVERED" },
  });

  if (!order) {
    return { success: false, error: "Order not found or not eligible for return." };
  }

  const existingReturn = await prisma.returnRequest.findFirst({
    where: { orderId, userId },
  });

  if (existingReturn) {
    return { success: false, error: "A return request already exists for this order." };
  }

  await prisma.returnRequest.create({
    data: {
      orderId,
      userId,
      type,
      reason,
      description: description || null,
      status: "REQUESTED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "RETURN_REQUESTED" },
  });

  revalidatePath("/account/returns");
  revalidatePath(`/account/orders/${orderId}`);
  return { success: true };
}

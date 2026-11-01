import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// Permission strings for granular access control
export type Permission =
  | "products.read"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "categories.manage"
  | "collections.manage"
  | "inventory.read"
  | "inventory.adjust"
  | "orders.read"
  | "orders.update"
  | "orders.cancel"
  | "customers.read"
  | "customers.update"
  | "coupons.manage"
  | "shipping.manage"
  | "payments.read"
  | "refunds.approve"
  | "returns.manage"
  | "reviews.moderate"
  | "support.manage"
  | "cms.manage"
  | "reports.read"
  | "staff.manage"
  | "settings.read"
  | "settings.update"
  | "audit.read"
  | "financial.read";

// Role → permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [],

  SUPER_ADMIN: [
    "products.read", "products.create", "products.update", "products.delete",
    "categories.manage", "collections.manage",
    "inventory.read", "inventory.adjust",
    "orders.read", "orders.update", "orders.cancel",
    "customers.read", "customers.update",
    "coupons.manage",
    "shipping.manage",
    "payments.read", "refunds.approve",
    "returns.manage",
    "reviews.moderate",
    "support.manage",
    "cms.manage",
    "reports.read",
    "staff.manage",
    "settings.read", "settings.update",
    "audit.read",
    "financial.read",
  ],

  STORE_MANAGER: [
    "products.read", "products.create", "products.update",
    "categories.manage", "collections.manage",
    "inventory.read", "inventory.adjust",
    "orders.read", "orders.update", "orders.cancel",
    "customers.read",
    "coupons.manage",
    "shipping.manage",
    "payments.read",
    "returns.manage",
    "reviews.moderate",
    "support.manage",
    "cms.manage",
    "reports.read",
    "settings.read",
  ],

  PRODUCT_MANAGER: [
    "products.read", "products.create", "products.update",
    "categories.manage", "collections.manage",
    "inventory.read",
    "orders.read",
    "reviews.moderate",
    "cms.manage",
  ],

  INVENTORY_MANAGER: [
    "products.read",
    "inventory.read", "inventory.adjust",
    "orders.read",
  ],

  ORDER_MANAGER: [
    "products.read",
    "inventory.read",
    "orders.read", "orders.update",
    "customers.read",
    "shipping.manage",
    "returns.manage",
  ],

  CUSTOMER_SUPPORT: [
    "products.read",
    "orders.read",
    "customers.read",
    "support.manage",
    "returns.manage",
  ],

  ANALYST: [
    "products.read",
    "inventory.read",
    "orders.read",
    "customers.read",
    "payments.read",
    "reports.read",
    "financial.read",
  ],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Get the current session and verify a required permission.
 * Throws an error if the user is not authenticated or lacks the permission.
 */
export async function requirePermission(permission: Permission) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("UNAUTHORIZED: Not authenticated");
  }

  const role = (session.user as any).role as UserRole;

  if (!roleHasPermission(role, permission)) {
    throw new Error(`FORBIDDEN: Missing permission: ${permission}`);
  }

  return session;
}

/**
 * Get the current session. Returns null if not authenticated.
 */
export async function getSession() {
  return await auth();
}

/**
 * Require any admin role (not CUSTOMER)
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED: Not authenticated");
  }
  const role = (session.user as any).role as UserRole;
  if (role === "CUSTOMER") {
    throw new Error("FORBIDDEN: Admin access required");
  }
  return session;
}

/**
 * Require the user to be the authenticated customer
 */
export async function requireCustomer() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED: Not authenticated");
  }
  return session;
}

/**
 * Verify the current user can only access their own resource
 */
export async function requireOwnResource(resourceUserId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED: Not authenticated");
  }
  const role = (session.user as any).role as UserRole;
  const isAdmin = role !== "CUSTOMER";

  if (!isAdmin && session.user.id !== resourceUserId) {
    throw new Error("FORBIDDEN: Cannot access another user's resource");
  }
  return session;
}


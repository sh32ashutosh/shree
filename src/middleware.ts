import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Admin roles that can access /admin routes
const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "STORE_MANAGER",
  "PRODUCT_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "ANALYST",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (session.user as any).role;
    if (!ADMIN_ROLES.includes(role)) {
      // Authenticated but not an admin — redirect to account
      return NextResponse.redirect(new URL("/account", request.url));
    }

    return NextResponse.next();
  }

  // Protect /account routes (require customer login)
  if (pathname.startsWith("/account") && pathname !== "/account/login" && pathname !== "/account/register") {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};


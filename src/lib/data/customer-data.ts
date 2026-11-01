import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getAuthenticatedCustomer() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/account/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: true,
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          shipment: true,
          payment: true,
        },
      },
      wishlistItems: {
        include: {
          product: {
            include: { images: true, inventory: true },
          },
        },
      },
      returnRequests: {
        orderBy: { createdAt: "desc" },
        include: { order: true },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/account/login");
  }

  return user;
}


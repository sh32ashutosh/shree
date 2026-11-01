import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ping database
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV || "development",
      stats: {
        products: productCount,
        users: userCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        message: error?.message || "Health check failed",
      },
      { status: 503 }
    );
  }
}


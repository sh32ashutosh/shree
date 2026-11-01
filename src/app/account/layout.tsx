"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/account/login" || pathname === "/account/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <AccountNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}


import React from "react";
import { prisma } from "@/lib/prisma";
import { createStaffMember } from "@/lib/actions/admin";
import { UserCheck, Plus, ShieldCheck, Key, Lock, Mail } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminStaffPage() {
  const staffMembers = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    include: { adminProfile: true },
    orderBy: { createdAt: "desc" },
  });

  async function handleCreateStaff(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();
    const role = formData.get("role") as string;

    if (!name || !email || !password || !role) return;

    await createStaffMember({ name, email, password, role });
    revalidatePath("/admin/staff");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Staff & Role-Based Access Control (RBAC) ({staffMembers.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              7 Enterprise Roles
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Enforce granular permissions across Super Admin, Store Manager, Product Manager, Inventory Manager, Order Manager, Support, and Analyst.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Authorized Staff Directory
            </span>
            <span className="text-xs text-[#756B62]">{staffMembers.length} Authorized</span>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {staffMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-[#FAF6F0]/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#1F1916]">
                      {member.name || "Staff Member"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#5E131D]/10 text-[#5E131D]">
                      {member.role.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[#756B62] font-mono">{member.email}</p>
                </div>

                <div className="text-right text-xs text-[#756B62]">
                  <span className="block font-medium text-emerald-700">ACTIVE</span>
                  <span className="text-[10px]">
                    Added {new Date(member.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Staff Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#5E131D]" />
            <span>Create Staff Member</span>
          </h2>

          <form action={handleCreateStaff} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Vikramaditya Joshi"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Atelier Email *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="vikram@saubhagyasarees.com"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Password * (Min 8 Characters)
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Assigned RBAC Role *
              </label>
              <select
                name="role"
                required
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="STORE_MANAGER">STORE MANAGER (Operations & Orders)</option>
                <option value="PRODUCT_MANAGER">PRODUCT MANAGER (Catalog & Weaves)</option>
                <option value="INVENTORY_MANAGER">INVENTORY MANAGER (Warehouse Stock)</option>
                <option value="ORDER_MANAGER">ORDER MANAGER (Shipments & Courier)</option>
                <option value="CUSTOMER_SUPPORT">CUSTOMER SUPPORT (Tickets & Returns)</option>
                <option value="ANALYST">ANALYST (Read-Only Financials)</option>
                <option value="SUPER_ADMIN">SUPER ADMIN (Full Unrestricted Access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Issue Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


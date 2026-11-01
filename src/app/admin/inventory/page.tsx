import React from "react";
import { prisma } from "@/lib/prisma";
import { adjustStock } from "@/lib/actions/admin";
import { Warehouse, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminInventoryPage() {
  const [inventories, stockMovements] = await Promise.all([
    prisma.inventory.findMany({
      include: {
        product: { select: { id: true, title: true, sku: true, fabric: true } },
      },
      orderBy: { quantity: "asc" },
    }),
    prisma.stockMovement.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        inventory: {
          include: { product: { select: { title: true, sku: true } } },
        },
      },
    }),
  ]);

  const totalUnits = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  const totalReserved = inventories.reduce((sum, inv) => sum + inv.reservedQuantity, 0);
  const lowStockCount = inventories.filter((inv) => inv.quantity <= inv.lowStockThreshold && inv.quantity > 0).length;
  const outOfStockCount = inventories.filter((inv) => inv.quantity <= 0).length;

  async function adjustStockAction(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    const adjustment = Number(formData.get("adjustment"));
    const reason = formData.get("reason") as string;
    const type = (formData.get("type") as "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGED" | "RETURNED") || "ADJUSTMENT";

    if (!productId || isNaN(adjustment) || adjustment === 0) return;

    await adjustStock(productId, adjustment, reason || "Manual warehouse adjustment", type);
    revalidatePath("/admin/inventory");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Warehouse & Stock Reliability
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Concurrency-Safe
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Real-time stock checks, atomic checkout reservations, damaged stock recording, and movement audits.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Available Stock</span>
          <div className="font-serif text-2xl font-bold text-[#1F1916]">
            {totalUnits} units
          </div>
          <span className="text-[11px] text-emerald-700">Across {inventories.length} saree styles</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Active Reservations</span>
          <div className="font-serif text-2xl font-bold text-[#5E131D]">
            {totalReserved} units
          </div>
          <span className="text-[11px] text-[#756B62]">Locked during customer checkout</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Low Stock Alert (≤5)</span>
          <div className="font-serif text-2xl font-bold text-amber-700">
            {lowStockCount} items
          </div>
          <span className="text-[11px] text-amber-800">Requires weaver replenishment</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DED1] shadow-xs space-y-1">
          <span className="text-xs text-[#756B62]">Out of Stock</span>
          <div className="font-serif text-2xl font-bold text-red-700">
            {outOfStockCount} items
          </div>
          <span className="text-[11px] text-red-700">Sold out on live storefront</span>
        </div>
      </div>

      {/* Two Column Grid: Inventory Table and Manual Adjustment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Stock Levels by Saree SKU
            </span>
            <span className="text-xs text-[#756B62]">{inventories.length} Catalog SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DED1] text-[#756B62] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-4">Saree & SKU</th>
                  <th className="py-2.5 px-4 text-center">Available</th>
                  <th className="py-2.5 px-4 text-center">Reserved</th>
                  <th className="py-2.5 px-4 text-center">Alert Limit</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED1]">
                {inventories.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FAF6F0]/40">
                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-[#1F1916] block">
                        {inv.product.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#756B62]">
                        {inv.product.sku} • {inv.product.fabric || "Silk"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm text-[#1F1916]">
                      {inv.quantity}
                    </td>
                    <td className="py-3 px-4 text-center text-[#756B62]">
                      {inv.reservedQuantity}
                    </td>
                    <td className="py-3 px-4 text-center text-[#756B62]">
                      ≤ {inv.lowStockThreshold}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.quantity <= 0
                            ? "bg-red-100 text-red-800"
                            : inv.quantity <= inv.lowStockThreshold
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {inv.quantity <= 0 ? "OUT OF STOCK" : inv.quantity <= inv.lowStockThreshold ? "LOW STOCK" : "OPTIMAL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Stock Adjustment Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-[#5E131D]" />
            <span>Record Stock Movement</span>
          </h2>

          <form action={adjustStockAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Select Saree Creation *
              </label>
              <select
                name="productId"
                required
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
              >
                {inventories.map((inv) => (
                  <option key={inv.productId} value={inv.productId}>
                    {inv.product.sku} — {inv.product.title} ({inv.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Movement Type *
              </label>
              <select
                name="type"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="STOCK_IN">Stock In (Weaver Inward)</option>
                <option value="STOCK_OUT">Stock Out (Direct Sale / Dispatched)</option>
                <option value="ADJUSTMENT">Manual Inventory Reconciliation</option>
                <option value="DAMAGED">Damaged / Flawed Zari</option>
                <option value="RETURNED">Customer Return Restocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Quantity Change (+ or -) *
              </label>
              <input
                type="number"
                name="adjustment"
                required
                placeholder="e.g. 5 for inward, -2 for outward"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Reason / Weaver Batch Number
              </label>
              <input
                type="text"
                name="reason"
                placeholder="e.g. Kanchipuram Guild Batch #88"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Commit Adjustment
            </button>
          </form>
        </div>
      </div>

      {/* Stock Movements Audit History */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden space-y-2 p-6">
        <h3 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-3">
          Immutable Stock Audit Trail (Latest 20 Movements)
        </h3>

        <div className="divide-y divide-[#E8DED1]/60 text-xs">
          {stockMovements.length === 0 ? (
            <p className="text-[#756B62] py-4">No stock movements recorded yet.</p>
          ) : (
            stockMovements.map((sm) => (
              <div key={sm.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1F1916]">
                    {sm.inventory.product.title} ({sm.inventory.product.sku})
                  </span>
                  <p className="text-[11px] text-[#756B62]">
                    Type: <strong className="uppercase">{sm.type}</strong> • Reason: {sm.reason || "N/A"} • By {sm.actorName || "System"}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm ${
                      sm.quantity > 0 ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {sm.quantity > 0 ? `+${sm.quantity}` : sm.quantity}
                  </span>
                  <span className="text-[10px] text-[#756B62] block">
                    {new Date(sm.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


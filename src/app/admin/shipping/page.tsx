import React from "react";
import { prisma } from "@/lib/prisma";
import { Truck, CheckCircle2, ShieldCheck, MapPin, Globe, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminShippingPage() {
  const storeSettings = await prisma.storeSetting.findMany({
    where: {
      key: { in: ["free_shipping_threshold_paise", "express_shipping_paise", "standard_shipping_paise"] },
    },
  });

  const settingsMap = Object.fromEntries(storeSettings.map((s) => [s.key, s.value]));

  const freeShippingThreshold = Math.round(Number(settingsMap.free_shipping_threshold_paise || "1000000") / 100);
  const expressShippingFee = Math.round(Number(settingsMap.express_shipping_paise || "50000") / 100);
  const standardShippingFee = Math.round(Number(settingsMap.standard_shipping_paise || "10000") / 100);

  const shipments = await prisma.shipment.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { address: true, user: true },
      },
    },
  });

  async function updateShippingConfig(formData: FormData) {
    "use server";
    const freeThreshold = Number(formData.get("freeThreshold"));
    const expressFee = Number(formData.get("expressFee"));
    const standardFee = Number(formData.get("standardFee"));

    await prisma.storeSetting.upsert({
      where: { key: "free_shipping_threshold_paise" },
      create: { key: "free_shipping_threshold_paise", value: String(Math.round(freeThreshold * 100)) },
      update: { value: String(Math.round(freeThreshold * 100)) },
    });

    await prisma.storeSetting.upsert({
      where: { key: "express_shipping_paise" },
      create: { key: "express_shipping_paise", value: String(Math.round(expressFee * 100)) },
      update: { value: String(Math.round(expressFee * 100)) },
    });

    await prisma.storeSetting.upsert({
      where: { key: "standard_shipping_paise" },
      create: { key: "standard_shipping_paise", value: String(Math.round(standardFee * 100)) },
      update: { value: String(Math.round(standardFee * 100)) },
    });

    revalidatePath("/admin/shipping");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Shipping Zones & Courier Fulfillment
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Shiprocket Ready
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Configure delivery tiers, free shipping thresholds, insured transit packaging, and live courier tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#5E131D]" />
            <span>Shipping Fee Configuration</span>
          </h2>

          <form action={updateShippingConfig} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Complimentary Free Shipping Minimum (₹)
              </label>
              <input
                type="number"
                name="freeThreshold"
                defaultValue={freeShippingThreshold}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                Orders above this amount enjoy free insured delivery automatically.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Standard Insured Delivery Fee (₹)
              </label>
              <input
                type="number"
                name="standardFee"
                defaultValue={standardShippingFee}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                Charged on orders below the complimentary threshold.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Express Air Courier Surcharge (₹)
              </label>
              <input
                type="number"
                name="expressFee"
                defaultValue={expressShippingFee}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none focus:border-[#5E131D]"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                Guaranteed 24-48 hr metro priority dispatch.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Update Shipping Rates
            </button>
          </form>
        </div>

        {/* Integration Status & Zones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
            <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Courier Provider Integration Status</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F1916]">Shiprocket Logistics</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                    Adapter Ready
                  </span>
                </div>
                <p className="text-[#756B62]">
                  Supports Blue Dart, Delhivery, DTDC, and Ecom Express. Enter credentials in <span className="font-mono">.env.local</span> to activate automatic AWB generation.
                </p>
              </div>

              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F1916]">Manual AWB Entry</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-[#756B62]">
                  Authorized staff can enter airway bill tracking numbers on individual order pages anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Shipments Stream */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
            <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
              Recent Dispatches ({shipments.length})
            </h2>

            <div className="divide-y divide-[#E8DED1] text-xs">
              {shipments.length === 0 ? (
                <p className="text-[#756B62] py-4">No shipments dispatched yet.</p>
              ) : (
                shipments.map((s) => (
                  <div key={s.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[#1F1916]">
                        AWB: {s.trackingNumber || "Assigned internally"}
                      </span>
                      <p className="text-[#756B62]">
                        Carrier: {s.courier || "Blue Dart Air"} • Destination: {s.order.address?.city}, {s.order.address?.state}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {s.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


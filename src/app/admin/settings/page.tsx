import React from "react";
import { prisma } from "@/lib/prisma";
import { Settings, Save, ShieldCheck, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.storeSetting.findMany();
  const settings = Object.fromEntries(settingsList.map((s) => [s.key, s.value]));

  async function handleUpdateSettings(formData: FormData) {
    "use server";
    const storeName = formData.get("storeName") as string;
    const storeEmail = formData.get("storeEmail") as string;
    const storePhone = formData.get("storePhone") as string;
    const gstRate = formData.get("gstRate") as string;
    const freeShipping = formData.get("freeShipping") as string;

    const entries = [
      { key: "store_name", value: storeName || "Saubhagya Sarees Atelier" },
      { key: "store_email", value: storeEmail || "concierge@saubhagyasarees.com" },
      { key: "store_phone", value: storePhone || "+91 98200 12345" },
      { key: "gst_rate", value: gstRate || "18" },
      { key: "free_shipping_threshold_paise", value: String(Math.round(Number(freeShipping || 10000) * 100)) },
    ];

    for (const item of entries) {
      await prisma.storeSetting.upsert({
        where: { key: item.key },
        create: item,
        update: { value: item.value },
      });
    }

    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Storefront Configurations & Master Parameters
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Database Persisted
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Global atelier branding, tax structures, contact points, and production gateway modes.
          </p>
        </div>
      </div>

      <form action={handleUpdateSettings} className="space-y-6 max-w-3xl">
        {/* General Store Details */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#5E131D]" />
            <span>Atelier Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Legal Storefront Name *
              </label>
              <input
                type="text"
                name="storeName"
                defaultValue={settings.store_name || "Saubhagya Sarees Atelier"}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Concierge Contact Phone *
              </label>
              <input
                type="text"
                name="storePhone"
                defaultValue={settings.store_phone || "+91 98200 12345"}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1F1916] mb-1">
                Concierge Official Email *
              </label>
              <input
                type="email"
                name="storeEmail"
                defaultValue={settings.store_email || "concierge@saubhagyasarees.com"}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>
          </div>
        </div>

        {/* GST Tax Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Taxation & Compliance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Handloom GST Tax Rate (%)
              </label>
              <input
                type="number"
                name="gstRate"
                defaultValue={settings.gst_rate || "18"}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                Calculated on net sales value and itemized on invoice PDF slips.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#1F1916] mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                name="freeShipping"
                defaultValue={Math.round(Number(settings.free_shipping_threshold_paise || "1000000") / 100)}
                required
                className="w-full px-3 py-2 border border-[#E8DED1] rounded-lg font-bold text-[#1F1916] focus:outline-none"
              />
              <p className="text-[11px] text-[#756B62] mt-1">
                Minimum cart value for complimentary insured shipping.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Master Settings</span>
        </button>
      </form>
    </div>
  );
}

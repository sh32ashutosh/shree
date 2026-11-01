import React from "react";
import { prisma } from "@/lib/prisma";
import { FileText, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminContentPage() {
  const sections = await prisma.cMSSection.findMany();
  const sectionMap = Object.fromEntries(sections.map((s) => [s.key, s]));

  async function updateCMSAction(formData: FormData) {
    "use server";
    const announcement = (formData.get("announcement") as string)?.trim();
    const heroTitle = (formData.get("heroTitle") as string)?.trim();
    const heroSubtitle = (formData.get("heroSubtitle") as string)?.trim();
    const graceTitle = (formData.get("graceTitle") as string)?.trim();
    const spotlightTitle = (formData.get("spotlightTitle") as string)?.trim();
    const threadsTitle = (formData.get("threadsTitle") as string)?.trim();

    if (announcement) {
      await prisma.cMSSection.upsert({
        where: { key: "announcement-bar" },
        create: { key: "announcement-bar", title: announcement },
        update: { title: announcement },
      });
    }

    if (heroTitle) {
      await prisma.cMSSection.upsert({
        where: { key: "hero" },
        create: { key: "hero", title: heroTitle, subtitle: heroSubtitle },
        update: { title: heroTitle, subtitle: heroSubtitle },
      });
    }

    if (graceTitle) {
      await prisma.cMSSection.upsert({
        where: { key: "grace-in-bloom" },
        create: { key: "grace-in-bloom", title: graceTitle },
        update: { title: graceTitle },
      });
    }

    if (spotlightTitle) {
      await prisma.cMSSection.upsert({
        where: { key: "in-the-spotlight" },
        create: { key: "in-the-spotlight", title: spotlightTitle },
        update: { title: spotlightTitle },
      });
    }

    if (threadsTitle) {
      await prisma.cMSSection.upsert({
        where: { key: "threads-of-tradition" },
        create: { key: "threads-of-tradition", title: threadsTitle },
        update: { title: threadsTitle },
      });
    }

    revalidatePath("/admin/content");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Storefront CMS & Visual Merchandising
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Live Homepage Editor
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Update hero banners, announcement tickers, shelf titles, and festive campaign copy without touching code.
          </p>
        </div>
      </div>

      <form action={updateCMSAction} className="space-y-6 max-w-4xl">
        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Top Announcement Ribbon Ticker</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1">
              Banner Text *
            </label>
            <input
              type="text"
              name="announcement"
              defaultValue={
                sectionMap["announcement-bar"]?.title ||
                "Free Insured Worldwide Shipping on Orders Above ₹10,000 | Silk Mark Certified Sarees | WhatsApp: +91 98200 12345"
              }
              required
              className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
            Hero Section Headlines
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Hero Heading *
              </label>
              <input
                type="text"
                name="heroTitle"
                defaultValue={sectionMap["hero"]?.title || "The Heritage of Every Happy Occasion"}
                required
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Hero Subtitle
              </label>
              <input
                type="text"
                name="heroSubtitle"
                defaultValue={
                  sectionMap["hero"]?.subtitle ||
                  "Handcrafted silks and heirloom weaves, curated for life's most cherished celebrations."
                }
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shelves Headlines */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2">
            Curated Showcase Shelf Titles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Shelf 1 (Organza & Pastels)
              </label>
              <input
                type="text"
                name="graceTitle"
                defaultValue={sectionMap["grace-in-bloom"]?.title || "Grace in Bloom"}
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Shelf 2 (Best Sellers)
              </label>
              <input
                type="text"
                name="spotlightTitle"
                defaultValue={sectionMap["in-the-spotlight"]?.title || "In the Spotlight"}
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Shelf 3 (Heritage Looms)
              </label>
              <input
                type="text"
                name="threadsTitle"
                defaultValue={sectionMap["threads-of-tradition"]?.title || "Threads of Tradition"}
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Publish Visual Changes to Live Boutique</span>
        </button>
      </form>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { updateCustomerProfile } from "@/lib/actions/customer";
import { User, Phone, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AccountProfilePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      const res = await updateCustomerProfile(formData);
      if (res.success) {
        toast.success("Profile preferences updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#E8DED1] pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              Atelier Profile & Preferences
            </h1>
            <p className="text-xs text-[#756B62]">
              Update your personal details, contact preferences, and wedding registry notes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Deshmukh"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Primary Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
            <p className="text-[11px] text-[#756B62] mt-1">
              Used for courier delivery updates and dispatch OTP notifications.
            </p>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] space-y-2">
            <h3 className="font-serif text-xs font-bold text-[#1F1916] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Weaving Traditions & Privileges</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-white border border-[#E8DED1] text-[#5E131D] rounded font-semibold">
                Kanjivaram Silk
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#E8DED1] text-[#5E131D] rounded font-semibold">
                Banarasi Brocade
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#E8DED1] text-[#5E131D] rounded font-semibold">
                Patan Patola
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Subscribed to Royal Atelier Seasonal Previews</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}


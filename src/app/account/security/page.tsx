"use client";

import React, { useState } from "react";
import { changePassword } from "@/lib/actions/customer";
import { Shield, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("currentPassword", currentPassword);
      data.append("newPassword", newPassword);
      data.append("confirmPassword", confirmPassword);

      const res = await changePassword(data);
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E8DED1] pb-4">
          <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              Account Security & Password
            </h1>
            <p className="text-xs text-[#756B62]">
              Keep your Saubhagya Sarees account credentials and saved payment tokens secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              New Password * (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756B62] hover:text-[#1F1916]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="pt-6 border-t border-[#E8DED1] space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#1F1916]">
            Active Authentication Sessions
          </h3>
          <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DED1] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#1F1916] block">Current Web Browser Session</span>
              <span className="text-[#756B62]">Secure JWT encrypted cookie • Verified active</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              This Device
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCustomer } from "@/lib/actions/customer";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);

      const res = await registerCustomer(data);
      if (res.success) {
        toast.success("Account created successfully! Signing you in...");
        const signinRes = await signIn("credentials", {
          email: formData.email.trim(),
          password: formData.password,
          isAdmin: "false",
          redirect: false,
        });

        if (signinRes?.ok) {
          router.push("/account");
          router.refresh();
        } else {
          router.push("/account/login");
        }
      } else {
        toast.error(res.error || "Failed to create account");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF6F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#5E131D] uppercase">
            Join The Royal Circle
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#1F1916]">
            Create an Account
          </h2>
          <p className="mt-2 text-xs text-[#756B62]">
            Experience privileged trousseau previews, order tracking, and silk certificate archiving.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ananya Deshmukh"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ananya@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
              Password * (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
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
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#5E131D] hover:bg-[#4A0E17] focus:outline-none transition-colors disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#FAF6F0] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Royal Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E8DED1] text-center space-y-3">
          <p className="text-xs text-[#756B62]">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="font-semibold text-[#5E131D] hover:underline"
            >
              Sign In Instead
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#756B62]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Silk Mark Society Protected User Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}


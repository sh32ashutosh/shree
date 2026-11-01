"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        isAdmin: "false",
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Welcome back to Saubhagya Sarees!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-semibold text-[#1F1916] mb-1.5 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ananya@example.com"
            className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8DED1] rounded-lg bg-[#FAF6F0]/40 focus:outline-none focus:border-[#5E131D] text-[#1F1916]"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-[#1F1916] uppercase tracking-wider">
            Password
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Password reset instructions sent if email exists.");
            }}
            className="text-[11px] text-[#5E131D] hover:underline"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#756B62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#5E131D] hover:bg-[#4A0E17] focus:outline-none transition-colors disabled:opacity-60"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-[#FAF6F0] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] bg-[#FAF6F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#5E131D] uppercase">
            Privilege Sanctum
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#1F1916]">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-xs text-[#756B62]">
            Access your curated bridal heirlooms, saved addresses, and active orders.
          </p>
        </div>

        <Suspense fallback={<div className="py-8 text-center text-xs text-[#756B62]">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>

        <div className="pt-4 border-t border-[#E8DED1] text-center space-y-3">
          <p className="text-xs text-[#756B62]">
            New to Saubhagya Sarees?{" "}
            <Link
              href="/account/register"
              className="font-semibold text-[#5E131D] hover:underline"
            >
              Create an Atelier Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#756B62]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Encrypted & Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

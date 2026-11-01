"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        isAdmin: "true",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Admin access only.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#E8DFC8] mb-1.5 uppercase tracking-wider">
          Staff Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@saubhagyasarees.com"
          required
          autoComplete="email"
          className="w-full px-3 py-2.5 text-sm bg-[#1F1916] border border-[#332A24] rounded-lg text-[#E8DFC8] placeholder-[#756B62] focus:outline-none focus:border-[#5E131D] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#E8DFC8] mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="w-full px-3 py-2.5 pr-10 text-sm bg-[#1F1916] border border-[#332A24] rounded-lg text-[#E8DFC8] placeholder-[#756B62] focus:outline-none focus:border-[#5E131D] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756B62] hover:text-[#E8DFC8]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-[#5E131D] hover:bg-[#4A0E17] disabled:opacity-50 disabled:cursor-not-allowed text-[#FAF6F0] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#FAF6F0]/30 border-t-[#FAF6F0] rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Sign In to Admin Panel</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#1F1916] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-[#C5A880] tracking-widest block">
              SAUBHAGYA
            </span>
            <span className="text-[11px] text-[#756B62] tracking-widest uppercase block mt-0.5">
              Admin Management Console
            </span>
          </Link>
        </div>

        <div className="bg-[#171210] border border-[#332A24] rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-[#332A24] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5E131D]/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#5E131D]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#E8DFC8] uppercase tracking-wider">
                Secure Admin Access
              </h1>
              <p className="text-xs text-[#756B62] mt-0.5">
                Staff authentication required
              </p>
            </div>
          </div>

          <Suspense fallback={<div className="p-6 text-center text-xs text-[#756B62]">Loading authentication...</div>}>
            <AdminLoginForm />
          </Suspense>

          <div className="px-6 pb-6 space-y-3">
            <div className="text-center">
              <p className="text-[11px] text-[#756B62]">
                Staff-only access. Customer login is at{" "}
                <Link href="/account/login" className="text-[#C5A880] hover:underline">
                  /account/login
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-[#1F1916]/50 rounded-lg text-[11px] text-[#756B62]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Login attempts are rate-limited and all access is audit logged.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-[#756B62] hover:text-[#C5A880] transition-colors">
            ← Return to Saubhagya Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

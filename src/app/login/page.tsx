"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Loader2,
  Lock,
  Mail,
  LogIn,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const successMessage = searchParams.get("message");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Otorisasi gagal. Periksa kembali email dan password.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-6 bg-[#030303] overflow-hidden">
      {/* --- Dynamic Background Glows --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full animate-pulse-slow delay-1000 pointer-events-none" />

      {/* --- Back to Landing --- */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Site
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
          {/* Header & Identity */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
              <ShieldCheck size={12} fill="currentColor" /> Secure Gateway
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              LOGIN<span className="text-blue-500">.</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              Akses panel manajemen keuangan Anda.
            </p>
          </div>

          {/* Notifications */}
          {(error || successMessage) && (
            <div
              className={`animate-in fade-in slide-in-from-top-2 duration-300 px-5 py-3 rounded-2xl text-[11px] font-bold text-center border ${
                error
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              }`}
            >
              {error || successMessage}
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-focus-within:text-blue-500 transition-colors">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-zinc-600 hover:text-blue-400 transition-colors uppercase tracking-widest"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-blue-600 text-black hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-black" size={20} />
              ) : (
                <>
                  <LogIn size={18} />
                  SIGN IN SYSTEM
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-xs font-medium">
              Belum memiliki akses?{" "}
              <Link
                href="/register"
                className="text-white font-bold hover:text-blue-400 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, resetPasswordWithOTP } from "@/server/users";
import {
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  ChevronLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  async function handleRequestOTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await requestPasswordReset(email);
    if (result.success) setStep(2);
    else
      setError(result.error || "Otorisasi gagal. Periksa kembali email Anda.");
    setIsLoading(false);
  }

  async function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await resetPasswordWithOTP(email, otpCode, newPassword);
    if (result.success) {
      router.push(
        "/login?message=Password berhasil diperbarui! Silakan masuk.",
      );
    } else {
      setError(result.error || "Kode OTP salah atau telah kadaluarsa.");
    }
    setIsLoading(false);
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-6 bg-[#030303] overflow-hidden">
      {/* --- Visual Depth --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-1000 pointer-events-none" />

      {/* --- Navigation --- */}
      <Link
        href="/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group z-20"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Login
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
              <KeyRound size={12} fill="currentColor" />{" "}
              {step === 1 ? "Account Recovery" : "Security Update"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              {step === 1 ? "RECOVER" : "RESET"}
              <span className="text-blue-500">.</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              {step === 1
                ? "Masukkan email Anda untuk memulihkan akses sistem."
                : `Verifikasi kode keamanan untuk mengatur ulang sandi.`}
            </p>
          </div>

          {error && (
            <div className="animate-in fade-in zoom-in-95 duration-300 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-3 rounded-2xl text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          {/* STEP 1: INPUT EMAIL */}
          {step === 1 ? (
            <form
              onSubmit={handleRequestOTP}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-500 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-white hover:bg-blue-600 text-black hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-black" size={20} />
                ) : (
                  "SEND RECOVERY CODE"
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: INPUT OTP & PASSWORD BARU */
            <form
              onSubmit={handleResetSubmit}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="space-y-2 group text-center">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                  Verification Code
                </label>
                <div className="relative mt-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    required
                    className="w-full bg-black/60 border border-blue-500/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-6 py-5 text-white text-center text-3xl font-black tracking-[0.5em] placeholder:text-zinc-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-500 transition-colors">
                  New Secure Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "UPDATE SYSTEM PASSWORD"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                >
                  <ArrowLeft size={14} /> Use Different Email
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 border-t border-white/5 text-center">
            <Link
              href="/login"
              className="text-zinc-600 hover:text-white text-[9px] font-bold uppercase tracking-[0.4em] transition-colors"
            >
              Abort Recovery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

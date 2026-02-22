"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendOTP, verifyAndRegister } from "@/server/users";
import {
  Loader2,
  UserPlus,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formDataState, setFormDataState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const router = useRouter();

  async function handleRequestOTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    setFormDataState({
      name: formData.get("name") as string,
      email: email,
      password: formData.get("password") as string,
    });

    const result = await sendOTP(email);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Gagal mengirim kode verifikasi");
    }
    setIsLoading(false);
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalData = new FormData();
    finalData.append("name", formDataState.name);
    finalData.append("email", formDataState.email);
    finalData.append("password", formDataState.password);

    const result = await verifyAndRegister(finalData, otpCode);

    if (result.success) {
      router.push("/login?message=Akun berhasil diverifikasi! Silakan masuk.");
    } else {
      setError(result.error || "Kode OTP salah atau kadaluarsa");
    }
    setIsLoading(false);
  }

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-6 bg-[#030303] overflow-hidden">
      {/* --- Ambient Background --- */}
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full animate-pulse-slow delay-700 pointer-events-none" />

      {/* --- Back Link --- */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group z-20"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
              <Sparkles size={12} fill="currentColor" />{" "}
              {step === 1 ? "New Member" : "Security Check"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              {step === 1 ? "REGISTER" : "VERIFY"}
              <span className="text-blue-500">.</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              {step === 1
                ? "Mulai perjalanan finansial cerdas Anda."
                : "Masukkan 6-digit kode yang kami kirimkan."}
            </p>
          </div>

          {error && (
            <div className="animate-in fade-in zoom-in-95 duration-300 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-3 rounded-2xl text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          {/* STEP 1: FORM DATA DIRI */}
          {step === 1 && (
            <form
              onSubmit={handleRequestOTP}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors"
                    size={18}
                  />
                  <input
                    name="name"
                    type="text"
                    defaultValue={formDataState.name}
                    placeholder="Tisna Rizqiana"
                    required
                    className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                  />
                </div>
              </div>

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
                    defaultValue={formDataState.email}
                    placeholder="email@example.com"
                    required
                    className="w-full bg-black/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-12 py-4 text-white text-sm placeholder:text-zinc-700 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">
                  Secure Password
                </label>
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
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <UserPlus size={18} />
                    PROCEED REGISTRATION
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: FORM OTP */}
          {step === 2 && (
            <form
              onSubmit={handleVerify}
              className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block text-center">
                  Enter Verification Code
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500/50"
                    size={24}
                  />
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    required
                    className="w-full bg-black/60 border border-blue-500/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-3xl px-6 py-6 text-white text-center text-3xl font-black tracking-[0.4em] placeholder:text-zinc-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "COMPLETE VERIFICATION"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <ArrowLeft size={14} /> Back to edit details
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-xs font-medium">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="text-white font-bold hover:text-blue-400 transition-colors"
              >
                Sign In System
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

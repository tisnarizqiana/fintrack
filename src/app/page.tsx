"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative h-screen w-full bg-[#030303] text-white overflow-hidden flex flex-col">
      {/* --- Dynamic Background: The Living Glow --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-blue-700/10 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* --- Navigation --- */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 h-24">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
            <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">
            FinTrack<span className="text-blue-500">.io</span>
          </span>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="hidden sm:block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            Start Journey{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </nav>

      {/* --- Main Content (Center) --- */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-bold text-blue-400 mb-8 uppercase tracking-[0.3em] animate-fade-in">
          <Zap size={12} fill="currentColor" /> Intelligence in Finance
        </div>

        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8 select-none">
          ELEVATE YOUR
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent">
            NET WORTH.
          </span>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Satu platform untuk semua arus kas. Kelola transaksi dengan{" "}
          <br className="hidden md:block" />
          presisi tinggi dan sistem keamanan yang tak tertembus.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95"
          >
            Mulai Sekarang
          </Link>
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold transition-all px-6 py-3">
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center">
              <ChevronRight size={16} />
            </div>
            Explore Features
          </button>
        </div>
      </section>

      {/* --- Bottom Stats/Trust Section --- */}
      <footer className="relative z-10 px-8 md:px-16 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/[0.05] pt-10">
          {/* Micro Stats */}
          <div className="flex gap-12">
            <div className="space-y-1">
              <div className="text-xs font-black text-white uppercase tracking-widest">
                Enterprise
              </div>
              <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                Security Level
              </div>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-12">
              <div className="text-xs font-black text-white uppercase tracking-widest">
                99.9%
              </div>
              <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                System Uptime
              </div>
            </div>
          </div>

          {/* Social / Legal */}
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700">
            <span className="text-zinc-400">© 2026 FinTrack</span>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* --- Extra Luxury: Floating Glass Card (Simulated) --- */}
      <div className="absolute bottom-[15%] -right-20 w-80 h-48 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] rotate-[-15deg] hidden lg:block animate-bounce-slow opacity-50">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <TrendingUp size={24} className="text-blue-500" />
            <div className="w-10 h-6 bg-blue-500/20 rounded-full" />
          </div>
          <div className="h-2 w-20 bg-white/20 rounded-full" />
          <div className="h-6 w-32 bg-white/10 rounded-lg" />
        </div>
      </div>
    </main>
  );
}

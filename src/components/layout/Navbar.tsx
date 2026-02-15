"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar"; // Pastikan path import benar

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Header Mobile - Hanya muncul di layar kecil (hidden md:flex) */}
      <nav className="md:hidden sticky top-0 z-40 bg-zinc-950 border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tighter">
            FinTrack<span className="text-neon-blue">.io</span>
          </span>
        </div>

        {/* Tombol Hamburger dengan feedback sentuhan active:scale-90 */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-90"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Kirim state isOpen dan fungsi onClose ke Sidebar */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

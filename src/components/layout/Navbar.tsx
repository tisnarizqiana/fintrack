"use client";

import { Menu } from "lucide-react";

type NavbarProps = {
  onOpenSidebar: () => void; // Terima fungsi pembuka dari wrapper
};

export function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <nav className="md:hidden sticky top-0 z-40 bg-zinc-950 border-b border-white/5 px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-white tracking-tighter">
          FinTrack<span className="text-neon-blue">.io</span>
        </span>
      </div>

      <button
        onClick={onOpenSidebar}
        className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-90"
      >
        <Menu size={24} />
      </button>
    </nav>
  );
}

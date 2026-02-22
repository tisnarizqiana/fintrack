"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

type NavbarProps = {
  onOpenSidebar: () => void;
};

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi inisial (misal: "Tisna Rizqiana" -> "TR")
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "UD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // md:hidden memastikan navbar ini hilang total di layar desktop (>= 768px)
    <nav className="md:hidden sticky top-0 z-40 bg-zinc-950 border-b border-white/5 px-4 py-4 flex justify-between items-center">
      {/* Sisi Kiri: Branding Mobile */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-white tracking-tighter">
          FinTrack<span className="text-neon-blue">.io</span>
        </span>
      </div>

      {/* Sisi Kanan: Notifikasi, Profile Dropdown, & Menu Button */}
      <div className="flex items-center gap-2">
        {/* Notifikasi */}
        <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-blue rounded-full border border-zinc-950" />
        </button>

        {/* User Dropdown (Hanya muncul di mobile navbar ini) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center p-1 hover:opacity-80 transition-all"
          >
            <div className="w-9 h-9 bg-zinc-800 rounded-xl border border-white/10 flex items-center justify-center font-bold text-xs text-white">
              {getInitials(session?.user?.name)}
            </div>
          </button>

          {/* Dropdown Menu Mobile */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Akun
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>

              <Link
                href="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <User size={16} />
                <span>Profil Saya</span>
              </Link>

              {/* <Link
                href="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <SettingsIcon size={16} />
                <span>Pengaturan</span>
              </Link> */}

              <div className="h-px bg-white/5 my-1" />

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>

        {/* Garis Pemisah Kecil */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Hamburger Menu untuk buka Sidebar Mobile */}
        <button
          onClick={onOpenSidebar}
          className="p-2 text-zinc-400 hover:text-white transition-colors active:scale-90"
        >
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}

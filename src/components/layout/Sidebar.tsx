"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Settings,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = (session?.user as any)?.role === "admin";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", href: "/transactions", icon: ReceiptText },
    { name: "Laporan", href: "/reports", icon: BarChart3 },
    { name: "Profil Saya", href: "/settings", icon: Settings },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "UD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Overlay Mobile: Dibuat lebih ringan tanpa blur berlebih di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 z-[70]
        /* Gunakan dvh (dynamic viewport height) agar presisi di HP */
        h-[100dvh] w-72 
        bg-zinc-950 border-r border-white/5
        /* Optimasi GPU: will-change untuk animasi yang lebih smooth */
        will-change-transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Container Utama: Overflow-y-auto agar bisa di-scroll jika menu banyak */}
        <div className="flex flex-col h-full p-6 overflow-y-auto scrollbar-hide overscroll-contain">
          {/* Logo Section */}
          <div className="flex justify-between items-center mb-10 shrink-0">
            <span className="text-2xl font-bold text-white tracking-tighter">
              FinTrack<span className="text-neon-blue">.io</span>
            </span>
            <button
              onClick={onClose}
              className="md:hidden p-2 -mr-2 text-zinc-500 hover:text-white active:scale-90 transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === item.href
                    ? "bg-neon-blue text-white shadow-lg shadow-neon-blue/20"
                    : "text-zinc-500 hover:bg-white/5 active:bg-white/10"
                }`}
              >
                <item.icon size={20} /> {item.name}
              </Link>
            ))}

            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4 mb-2">
                  Admin Control
                </p>
                <Link
                  href="/admin/dashboard"
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all border border-blue-500/10 ${
                    pathname.startsWith("/admin")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-blue-500/70 bg-blue-500/5 hover:bg-blue-500/10"
                  }`}
                >
                  <ShieldCheck size={20} /> Dashboard Admin
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile & Logout - Fixed at bottom using shrink-0 */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4 shrink-0 pb-2">
            <div className="bg-zinc-900/50 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-xs shrink-0 border border-white/10">
                {getInitials(session?.user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {session?.user?.name || "User Demo"}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  {(session?.user as any)?.role || "User"}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center w-full gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 transition-all"
            >
              <LogOut size={20} /> Keluar Akun
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

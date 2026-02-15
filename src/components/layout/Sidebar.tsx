"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", href: "/transactions", icon: ReceiptText },
    { name: "Laporan", href: "/reports", icon: BarChart3 },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay Mobile: Warna Solid bg-black/80 (Tanpa Blur untuk performa) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Warna Solid bg-zinc-950, Tanpa Shadow/Glow */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen z-[70]
        bg-zinc-950 border-r border-white/5
        w-72 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <span className="text-2xl font-bold text-white tracking-tighter">
              FinTrack<span className="text-neon-blue">.io</span>
            </span>
            <button
              onClick={onClose}
              className="md:hidden text-zinc-500 hover:text-white active:scale-90 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  pathname === item.href
                    ? "bg-neon-blue text-white"
                    : "text-zinc-500 hover:bg-white/5"
                }`}
              >
                <item.icon size={20} /> {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-xs">
                UD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  User Demo
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Free Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

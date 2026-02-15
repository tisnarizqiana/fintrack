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

type SidebarMobileProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SidebarMobile({ isOpen, onClose }: SidebarMobileProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", href: "/transactions", icon: ReceiptText },
    { name: "Laporan", href: "/reports", icon: BarChart3 },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay: Hitam Solid Transparan (Tanpa Blur untuk Performa) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Sidebar: Background Solid bg-zinc-950 */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-[70] 
          bg-zinc-950 border-r border-white/5 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header Sidebar: Logo & Tombol Close */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tighter">
                FinTrack<span className="text-neon-blue">.io</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white active:scale-90 transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Menu Navigation: Jarak antar menu pas untuk jari */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95
                    ${
                      isActive
                        ? "bg-neon-blue text-white"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section: Sama seperti versi Desktop tapi disesuaikan untuk HP */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-sm shrink-0">
                UD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  User Demo
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
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

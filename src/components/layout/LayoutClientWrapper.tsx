"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const authPaths = ["/", "/login", "/register", "/forgot-password"];
  const isAuthPage = authPaths.includes(pathname);

  return (
    <SessionProvider>
      {isAuthPage ? (
        /* Layout Auth: Gunakan overflow-y-auto agar halaman panjang bisa di-scroll */
        <div className="min-h-[100dvh] w-full bg-black overflow-y-auto overflow-x-hidden selection:bg-blue-500/30">
          {children}
        </div>
      ) : (
        /* Layout Dashboard: Pastikan h-[100dvh] agar main flex-1 bisa berfungsi */
        <div className="flex h-[100dvh] w-full bg-[#030303] text-white overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Wrapper Konten: Harus h-full agar scroll di main terpicu */}
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            {/* POINT PENTING: 
              - flex-1: Mengambil sisa ruang
              - overflow-y-auto: Mengaktifkan scroll hanya di area ini
              - touch-pan-y: Memastikan swipe atas-bawah di HP responsif
            */}
            <main className="flex-1 overflow-y-auto touch-pan-y bg-black p-4 md:p-10 scroll-smooth">
              <div className="max-w-7xl mx-auto pb-20 md:pb-0 animate-in fade-in duration-500">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}

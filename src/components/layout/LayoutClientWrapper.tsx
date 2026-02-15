"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar hanya ada SATU di sini. Menempel di desktop, drawer di mobile. */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar memberikan perintah buka ke Sidebar */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Konten utama: Tanpa md:ml-64 agar tidak tumpang tindih */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

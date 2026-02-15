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
      {/* SIDEBAR: Sticky di desktop, Drawer di mobile. Tanpa Blur & Shadow. */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* NAVBAR: Muncul hanya di mobile untuk membuka sidebar */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* MAIN AREA: Menghapus md:ml-64 agar layout desktop tidak bergeser dua kali */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

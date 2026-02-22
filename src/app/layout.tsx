import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClientWrapper from "@/components/layout/LayoutClientWrapper";
import { Toaster } from "sonner"; // 1. Import Toaster dari sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack.io",
  description: "Kelola keuanganmu dengan gaya modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.className} bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}
      >
        <LayoutClientWrapper>{children}</LayoutClientWrapper>

        {/* 2. Tambahkan Toaster di sini agar aktif di seluruh aplikasi */}
        <Toaster
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              borderRadius: "1.2rem",
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClientWrapper from "@/components/layout/LayoutClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Finance Tracker",
  description: "Kelola keuanganmu dengan gaya modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} bg-black text-white selection:bg-neon-blue/30`}
      >
        {/* Wrapper ini yang akan mengatur Sidebar dan Navbar agar tidak double */}
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}

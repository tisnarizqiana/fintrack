import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Menggunakan named export 'middleware' untuk menghindari error "must export a function"
export const middleware = auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const { nextUrl } = req;

  // 1. Proteksi Admin: Hanya role 'admin' yang bisa akses /admin/*
  if (nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // 2. Proteksi User: Harus login untuk akses dashboard, transaksi, dll
  const protectedPaths = [
    "/dashboard",
    "/transactions",
    "/reports",
    "/settings",
  ];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

// Menentukan rute mana saja yang akan diproses oleh middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. Helper untuk menggabungkan class Tailwind (Standar Shadcn/Modern UI)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Format Rupiah
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// 3. Format Tanggal (Contoh: 14 Feb 2024)
export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

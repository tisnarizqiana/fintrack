import { db } from "./index"; // Import koneksi db kita
import { categories } from "./schema"; // Import tabel
import * as dotenv from "dotenv";

// Load env agar script bisa connect ke Turso
dotenv.config({ path: ".env.local" });

const defaultCategories = [
  // Pemasukan
  { name: "Gaji", type: "income", color: "#10b981", icon: "Wallet" },
  { name: "Bonus", type: "income", color: "#34d399", icon: "Gift" },
  { name: "Investasi", type: "income", color: "#059669", icon: "TrendingUp" },

  // Pengeluaran
  {
    name: "Makan & Minum",
    type: "expense",
    color: "#f43f5e",
    icon: "Utensils",
  },
  { name: "Transportasi", type: "expense", color: "#f59e0b", icon: "Car" },
  { name: "Belanja", type: "expense", color: "#ec4899", icon: "ShoppingBag" },
  { name: "Hiburan", type: "expense", color: "#8b5cf6", icon: "Film" },
  { name: "Tagihan", type: "expense", color: "#ef4444", icon: "Zap" },
];

async function main() {
  console.log("🌱 Mulai seeding kategori...");

  try {
    // Hapus data lama (opsional, biar tidak duplikat saat coba ulang)
    // await db.delete(categories);

    await db.insert(categories).values(
      defaultCategories.map((cat) => ({
        ...cat,
        type: cat.type as "income" | "expense", // Casting tipe data
      })),
    );

    console.log("✅ Seeding selesai! Kategori berhasil ditambahkan.");
  } catch (error) {
    console.error("❌ Gagal seeding:", error);
  }

  process.exit(0);
}

main();

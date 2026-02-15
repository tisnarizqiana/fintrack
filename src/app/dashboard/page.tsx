import { getTransactions } from "@/server/transactions";
import { getCategories } from "@/server/categories"; // Import baru
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";

// Kita butuh Client Component Wrapper untuk menangani state Modal
// import DashboardClient from "@/components/dashboard/DashboardClient";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
export default async function DashboardPage() {
  // 1. Fetch data di Server (Parallel Fetching biar cepat)
  const [transactionsRes, categoriesRes] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  const transactions = transactionsRes.data || [];
  const categories = categoriesRes.data || [];

  // 2. Hitung Ringkasan
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // 3. Kirim data ke Client Component
  return (
    <DashboardClient
      transactions={transactions}
      categories={categories}
      summary={{ income, expense, balance }}
    />
  );
}

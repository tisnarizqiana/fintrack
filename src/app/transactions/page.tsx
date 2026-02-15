import { getTransactions } from "@/server/transactions";
import { getCategories } from "@/server/categories"; // Import categories
import TransactionListClient from "./TransactionListClient";

export default async function TransactionsPage() {
  // Ambil Transaksi DAN Kategori secara parallel
  const [transactionsRes, categoriesRes] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Riwayat Transaksi</h1>
          <p className="text-zinc-400 mt-1">
            Kelola semua pemasukan dan pengeluaranmu.
          </p>
        </div>
      </div>

      <TransactionListClient
        initialData={transactionsRes.data || []}
        categories={categoriesRes.data || []} // Oper data kategori ke client
      />
    </div>
  );
}

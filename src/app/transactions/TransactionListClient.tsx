"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  Pencil,
  Clock,
  Filter,
} from "lucide-react";
import { deleteTransaction } from "@/server/transactions";
import { TransactionModal } from "@/components/dashboard/TransactionModal";

export default function TransactionListClient({
  initialData,
  categories,
}: {
  initialData: any[];
  categories: any[];
}) {
  const [transactions, setTransactions] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  useEffect(() => {
    setTransactions(initialData);
  }, [initialData]);

  const filteredData = transactions.filter((t) => {
    const matchesSearch = t.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || t.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    setIsDeleting(id);
    await deleteTransaction(id);
    setIsDeleting(null);
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10 px-4 md:px-0">
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        categories={categories}
        initialData={editingTransaction}
      />

      {/* --- FIXED FILTER & SEARCH SECTION --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-2 md:mb-6">
        {/* Search Bar: Diperlebar di desktop (flex-1) */}
        <div className="relative flex-1 order-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari keterangan transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 md:py-2.5 text-white text-sm focus:outline-none transition-all"
          />
        </div>

        {/* Category Filter: Ukuran tetap di desktop (md:w-64) agar tidak terlalu lebar */}
        <div className="relative w-full md:w-64 order-2">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 md:py-2.5 text-white text-sm appearance-none outline-none cursor-pointer transition-all"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-zinc-900">
                {cat.name}
              </option>
            ))}
          </select>
          {/* Chevron icon untuk select */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <TrendingDown size={14} className="rotate-0" />
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION: Swipeable on Mobile --- */}
      <div className="bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto will-change-transform">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-white/5 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4 text-center">No. </th>
                <th className="px-6 py-4">Tanggal </th>
                <th className="px-6 py-4">Waktu </th>
                <th className="px-6 py-4">Keterangan </th>
                <th className="px-6 py-4 text-right">Jumlah </th>
                <th className="px-6 py-4 text-center">Aksi </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? (
                filteredData.map((t, index) => (
                  <tr
                    key={t.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-zinc-600 font-mono text-xs text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-zinc-300 font-mono whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-zinc-600" />
                        {new Date(t.date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            t.type === "income"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {t.type === "income" ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                        </div>
                        <div className="truncate max-w-[150px] md:max-w-none">
                          <span className="font-medium text-white block truncate">
                            {t.description || "Tanpa Keterangan"}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase">
                            {categories.find((c) => c.id === t.categoryId)
                              ?.name || "Umum"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold font-mono whitespace-nowrap ${
                        t.type === "income"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(t.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 md:gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2.5 md:p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-90"
                          title="Edit"
                        >
                          <Pencil size={18} className="md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isDeleting === t.id}
                          className="p-2.5 md:p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all active:scale-90"
                          title="Hapus"
                        >
                          {isDeleting === t.id ? (
                            <span className="animate-spin text-[10px]">⏳</span>
                          ) : (
                            <Trash2 size={18} className="md:w-4 md:h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-600 italic text-sm"
                  >
                    Data tidak ditemukan berdasarkan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

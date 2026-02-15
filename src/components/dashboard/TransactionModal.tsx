"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { addTransaction, updateTransaction } from "@/server/transactions";

export function TransactionModal({
  categories,
  isOpen,
  onClose,
  initialData,
}: {
  categories: any[];
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mendapatkan format YYYY-MM-DDTHH:mm sesuai waktu lokal
  const getLocalDatetime = (date: Date = new Date()) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (isOpen && initialData) {
      setType(initialData.type);
    } else {
      setType("expense");
    }
  }, [isOpen, initialData]);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    formData.append("type", type);
    const result = initialData
      ? await updateTransaction(initialData.id, formData)
      : await addTransaction(formData);

    setIsLoading(false);
    if (result?.success) onClose();
    else alert("Gagal menyimpan transaksi");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit" : "Tambah"} Transaksi
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-2 text-sm font-medium rounded-lg ${type === "income" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400"}`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-2 text-sm font-medium rounded-lg ${type === "expense" ? "bg-rose-500/20 text-rose-400" : "text-zinc-400"}`}
            >
              Pengeluaran
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase font-semibold">
              Nominal (Rp)
            </label>
            <input
              name="amount"
              type="number"
              required
              defaultValue={initialData?.amount}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase font-semibold">
              Tanggal & Waktu
            </label>
            <input
              name="date"
              type="datetime-local"
              defaultValue={
                initialData
                  ? getLocalDatetime(new Date(initialData.date))
                  : getLocalDatetime()
              }
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase font-semibold">
              Kategori
            </label>
            <select
              name="categoryId"
              required
              defaultValue={initialData?.categoryId || ""}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white appearance-none"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase font-semibold">
              Keterangan
            </label>
            <input
              name="description"
              type="text"
              defaultValue={initialData?.description || ""}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neon-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check size={20} />
            )}
            {initialData ? "Update" : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}

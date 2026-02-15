"use client";

import { useState } from "react";
import { User, Tag, Plus, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { addCategory, deleteCategory } from "@/server/categories";

export function SettingsClient({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddCategory(formData: FormData) {
    const res = await addCategory(formData);
    if (res.success) {
      window.location.reload(); // Refresh untuk sinkronisasi data
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Hapus kategori ini? Transaksi dengan kategori ini mungkin akan terpengaruh.",
      )
    )
      return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-10 px-4 md:px-0">
      {/* Kolom Kiri: Profil & Akun - Backdrop Blur & Shadow Dihapus */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6 text-white font-bold">
            <User size={20} className="text-neon-blue" />
            <span className="text-sm md:text-base">Profil Pengguna</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center text-lg md:text-xl font-bold text-white shrink-0">
              UD
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold truncate">User Demo</h3>
              <p className="text-xs text-zinc-500 font-mono truncate">
                user.demo@fintrack.io
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-white/5">
              <span className="text-[10px] md:text-xs text-zinc-400 font-medium">
                Status Akun
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase">
                Free Plan
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 md:p-6 opacity-60 cursor-not-allowed">
          <div className="flex items-center gap-3 mb-4 text-zinc-400 font-bold">
            <ShieldCheck size={20} />
            <span className="text-sm md:text-base">Keamanan (Segera)</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Fitur otentikasi dua faktor dan ganti kata sandi akan tersedia pada
            pembaruan berikutnya.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Manajemen Kategori - Backdrop Blur & Shadow Dihapus */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-white font-bold">
              <Tag size={20} className="text-neon-blue" />
              <span className="text-sm md:text-base">Manajemen Kategori</span>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-[10px] md:text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={14} /> {isAdding ? "Batal" : "Tambah"}
            </button>
          </div>

          {isAdding && (
            <form
              action={handleAddCategory}
              className="mb-8 p-4 bg-zinc-950 border border-white/10 rounded-2xl animate-in slide-in-from-top-2 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">
                    Nama Kategori
                  </label>
                  <input
                    name="name"
                    placeholder="Contoh: Liburan"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-neon-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">
                    Tipe
                  </label>
                  <select
                    name="type"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-neon-blue appearance-none"
                  >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-5 bg-neon-blue text-white py-3 rounded-xl text-sm font-bold active:scale-95 transition-all"
              >
                Simpan Kategori Baru
              </button>
            </form>
          )}

          {/* Grid Kategori: Glow Shadow Dihapus pada titik indikator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Glow Shadow Dihapus */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${cat.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <span className="text-sm font-medium text-zinc-300 truncate max-w-[120px] md:max-w-none">
                    {cat.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-zinc-700 hover:text-rose-500 transition-colors active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

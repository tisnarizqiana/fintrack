"use client";

import { useState } from "react";
import {
  User,
  Tag,
  Plus,
  Trash2,
  ShieldCheck,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { addCategory, deleteCategory } from "@/server/categories";
import { useSession } from "next-auth/react";
import { requestPasswordReset, resetPasswordWithOTP } from "@/server/users";

export function SettingsClient({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);

  // State untuk Keamanan/OTP
  const [step, setStep] = useState(1); // 1: Default, 2: Input OTP & Password
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Helper Inisial
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "UD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  async function handleAddCategory(formData: FormData) {
    const res = await addCategory(formData);
    if (res.success) {
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini?")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  // Alur Ganti Password Tahap 1: Kirim OTP
  async function handleRequestOTP() {
    if (!session?.user?.email) return;
    setIsLoading(true);
    setMessage(null);

    const res = await requestPasswordReset(session.user.email);
    if (res.success) {
      setStep(2);
      setMessage({
        type: "success",
        text: "Kode OTP telah dikirim ke email Anda.",
      });
    } else {
      setMessage({ type: "error", text: res.error || "Gagal mengirim OTP." });
    }
    setIsLoading(false);
  }

  // Alur Ganti Password Tahap 2: Verifikasi & Update
  async function handleUpdatePassword() {
    if (!otp || !newPassword) return;
    setIsLoading(true);

    const res = await resetPasswordWithOTP(
      session?.user?.email!,
      otp,
      newPassword,
    );
    if (res.success) {
      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui!" });
      setStep(1);
      setOtp("");
      setNewPassword("");
    } else {
      setMessage({
        type: "error",
        text: res.error || "Gagal memperbarui kata sandi.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-10 px-4 md:px-0">
      {/* Kolom Kiri: Profil & Keamanan */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profil Pengguna Dinamis */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 text-white font-bold">
            <User size={20} className="text-neon-blue" />
            <span className="text-sm">Profil Pengguna</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-lg font-bold text-blue-500 shrink-0">
              {getInitials(session?.user?.name)}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold truncate">
                {session?.user?.name || "Loading..."}
              </h3>
              <p className="text-xs text-zinc-500 font-mono truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-white/5">
            <span className="text-xs text-zinc-400 font-medium">
              Status Akun
            </span>
            <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 uppercase">
              {(session?.user as any)?.role || "User"}
            </span>
          </div>
        </div>

        {/* Keamanan Aktif (Ganti Password OTP) */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold">
            <ShieldCheck size={20} className="text-neon-blue" />
            <span className="text-sm">Keamanan Akun</span>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-[11px] font-bold border ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              }`}
            >
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Ingin mengganti kata sandi? Kami akan mengirimkan kode
                verifikasi ke email Anda untuk memastikan keamanan.
              </p>
              <button
                onClick={handleRequestOTP}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <KeyRound size={16} />
                )}
                Ganti Kata Sandi
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-1">
                  Kode OTP
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6 Digit Kode"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="bg-zinc-800 text-white py-2.5 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kolom Ranan: Manajemen Kategori */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-white font-bold">
              <Tag size={20} className="text-neon-blue" />
              <span className="text-sm">Manajemen Kategori</span>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2"
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
                    placeholder="Liburan"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${cat.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <span className="text-sm font-medium text-zinc-300">
                    {cat.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-zinc-700 hover:text-rose-500 transition-colors"
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

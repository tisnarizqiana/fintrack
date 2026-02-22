"use client";

import { useState, useTransition } from "react";
import {
  Trash2,
  KeyRound,
  Loader2,
  AlertTriangle,
  X,
  ShieldCheck,
  User,
  Pencil,
  Save,
} from "lucide-react";
import {
  deleteUser,
  resetUserPassword,
  updateUserRole,
  updateUserAdmin,
} from "@/server/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserActions({
  userId,
  userName,
  userEmail,
  currentRole,
}: {
  userId: string;
  userName: string;
  userEmail: string;
  currentRole: string;
}) {
  // Hook untuk menangani sinkronisasi data tanpa "kedip" atau data hilang
  const [isPending, startTransition] = useTransition();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States untuk form
  const [newPassword, setNewPassword] = useState("");
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

  const router = useRouter();
  const isCurrentAdmin = currentRole === "admin";

  // --- Handlers dengan Sinkronisasi Total ---

  async function handleDelete() {
    setIsLoading(true);
    const result = await deleteUser(userId);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
      toast.success("User berhasil dihapus");
      setIsDeleting(false);
    }
    setIsLoading(false);
  }

  async function handleReset() {
    if (!newPassword) return toast.error("Masukkan password baru");
    setIsLoading(true);
    const result = await resetUserPassword(userId, newPassword);
    if (result.success) {
      // ✅ KUNCI UTAMA: Menggunakan startTransition agar UI tetap sinkron
      startTransition(() => {
        router.refresh();
      });
      toast.success(`Password ${userName} berhasil direset!`);
      setIsResetting(false);
      setNewPassword("");
    } else {
      toast.error(result.error || "Gagal meriset password");
    }
    setIsLoading(false);
  }

  async function handleUpdateRole() {
    setIsLoading(true);
    const newRole = isCurrentAdmin ? "user" : "admin";
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Role berhasil diperbarui");
      setIsChangingRole(false);
    }
    setIsLoading(false);
  }

  async function handleEditUser(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateUserAdmin(userId, editName, editEmail);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Data user berhasil diperbarui");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Gagal memperbarui data");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-end gap-1 md:gap-2">
      {/* Tombol-tombol dinonaktifkan saat 'isPending' atau 'isLoading' aktif */}
      <button
        disabled={isLoading || isPending}
        onClick={() => setIsEditing(true)}
        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-30"
        title="Edit Nama/Email"
      >
        <Pencil size={18} />
      </button>

      <button
        disabled={isLoading || isPending}
        onClick={() => setIsChangingRole(true)}
        className={`p-2 rounded-lg transition-all disabled:opacity-30 ${
          isCurrentAdmin
            ? "text-amber-500 hover:bg-amber-500/10"
            : "text-emerald-500 hover:bg-emerald-500/10"
        }`}
        title={isCurrentAdmin ? "Turunkan ke User" : "Jadikan Admin"}
      >
        {isCurrentAdmin ? <User size={18} /> : <ShieldCheck size={18} />}
      </button>

      <button
        disabled={isLoading || isPending}
        onClick={() => setIsResetting(true)}
        className="p-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-30"
        title="Reset Password"
      >
        <KeyRound size={18} />
      </button>

      <button
        disabled={isLoading || isPending}
        onClick={() => setIsDeleting(true)}
        className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-30"
        title="Hapus User"
      >
        <Trash2 size={18} />
      </button>

      {/* --- MODAL EDIT USER --- */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-black tracking-tighter uppercase text-white">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-4">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white"
                required
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white"
                required
              />
              <button
                disabled={isLoading || isPending}
                className="w-full bg-white text-black font-black py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {isLoading || isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} /> Simpan Perubahan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL UBAH ROLE --- */}
      {isChangingRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-2xl text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCurrentAdmin ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}
            >
              {isCurrentAdmin ? <User size={32} /> : <ShieldCheck size={32} />}
            </div>
            <div className="space-y-2">
              <h3 className="font-black tracking-tighter uppercase text-white text-xl">
                {isCurrentAdmin ? "Turunkan Akses?" : "Berikan Akses Admin?"}
              </h3>
              <p className="text-zinc-500 text-sm">
                Ubah role <span className="text-white">{userName}</span> menjadi{" "}
                <span className="text-white font-bold">
                  {isCurrentAdmin ? "USER" : "ADMIN"}
                </span>
                ?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsChangingRole(false)}
                className="py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:text-white transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={isLoading || isPending}
                className={`py-3 text-white font-bold rounded-xl flex items-center justify-center ${isCurrentAdmin ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
              >
                {isLoading || isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Ya, Ubah"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RESET PASSWORD --- */}
      {isResetting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-black tracking-tighter uppercase text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setIsResetting(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="password"
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white"
            />
            <button
              onClick={handleReset}
              disabled={isLoading || isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
            >
              {isLoading || isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Simpan Password"
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-rose-500/20 p-8 rounded-[2rem] space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-black tracking-tighter uppercase text-white text-xl">
              Hapus Pengguna?
            </h3>
            <p className="text-zinc-500 text-sm">
              Data transaksi <span className="text-white">{userName}</span> akan
              terhapus permanen.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsDeleting(false)}
                className="py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:text-white transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading || isPending}
                className="py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center"
              >
                {isLoading || isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

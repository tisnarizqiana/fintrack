"use client";

import { useState } from "react";
import { X, UserPlus, Loader2, Shield, User } from "lucide-react";
import { adminCreateUser } from "@/server/users";
import { toast } from "sonner";

export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "user">("user");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    try {
      const result = await adminCreateUser(formData);

      if (result.success) {
        toast.success("Akun baru berhasil dibuat!");
        setIsOpen(false);
        setRole("user"); // Reset role ke default
      } else {
        toast.error(result.error || "Terjadi kesalahan sistem");
      }
    } catch (error) {
      toast.error("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Tombol Pemicu di Table Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        <UserPlus size={16} />
        <span className="hidden sm:inline">Add New User</span>
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-2xl animate-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tighter uppercase text-white">
                  Create Account
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Registrasi internal tanpa OTP
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input: Nama */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Tisna Rizqiana"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              {/* Input: Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tisna@example.com"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              {/* Input: Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Initial Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              {/* Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Assign Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                      role === "user"
                        ? "bg-white/5 border-white/20 text-white shadow-inner"
                        : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700"
                    }`}
                  >
                    <User size={14} /> Regular User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                      role === "admin"
                        ? "bg-blue-600/10 border-blue-500/40 text-blue-500 shadow-inner"
                        : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700"
                    }`}
                  >
                    <Shield size={14} /> Administrator
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Confirm Creation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { updateUserAdmin } from "@/server/users";
import { toast } from "sonner";

export function EditUserModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateUserAdmin(
      user.id,
      formData.get("name") as string,
      formData.get("email") as string,
    );

    if (res.success) {
      toast.success("Data berhasil diperbarui");
      onClose();
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2rem] space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-black uppercase tracking-tighter">
            Edit User
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            defaultValue={user.name}
            placeholder="Nama"
            required
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
          />
          <input
            name="email"
            defaultValue={user.email}
            type="email"
            placeholder="Email"
            required
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
          />
          <button
            disabled={isLoading}
            className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} /> Update Data
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

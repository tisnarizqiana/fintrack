import { db } from "@/db";
import { users } from "@/db/schema";
import { Trash2, RotateCcw } from "lucide-react";

export default async function AdminUsersPage() {
  const data = await db.select().from(users);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <div className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-zinc-400 text-sm uppercase">
            <tr>
              <th className="p-5">Nama</th>
              <th className="p-5">Email</th>
              <th className="p-5">Role</th>
              <th className="p-5">Password (Hash)</th>
              <th className="p-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-5">{user.name}</td>
                <td className="p-5 font-medium">{user.email}</td>
                <td className="p-5 italic text-zinc-400">{user.role}</td>
                <td className="p-5 font-mono text-xs text-zinc-500 truncate max-w-[150px]">
                  {user.password}
                </td>
                <td className="p-5 text-right flex justify-end gap-3">
                  {/* FIX: Atribut title ganda telah dihapus agar lolos build TypeScript */}
                  <button
                    title="Reset Password"
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    title="Hapus User"
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

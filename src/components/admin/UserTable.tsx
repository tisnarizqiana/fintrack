"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { UserActions } from "./UserActions";
import { AddUserModal } from "./AddUserModal";
import { ExportButtons } from "./ExportButtons";

export function UserTable({
  usersData,
  sessionUserId,
}: {
  usersData: any[];
  sessionUserId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // FIX: Logika filter dibuat lebih aman (null-safe) agar tidak "pecah"
  // saat transisi data atau ketika data sedang di-refresh oleh server.
  const filteredUsers = (usersData || []).filter((user) => {
    if (!user) return false;

    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Header Section with Actions --- */}
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-6 bg-white/[0.01]">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="p-2.5 bg-zinc-800 rounded-xl text-blue-500 shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight uppercase text-white">
              User List
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {filteredUsers.length} of {usersData.length} Accounts
            </p>
          </div>
        </div>

        {/* Action Group: Export, Add, and Search */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <ExportButtons data={filteredUsers} />
            <AddUserModal />
          </div>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              size={14}
            />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-10 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide overscroll-x-contain">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-zinc-500 bg-black/20">
              <th className="px-6 md:px-8 py-5 font-black">Identitas</th>
              <th className="px-6 md:px-8 py-5 font-black">Email</th>
              <th className="px-6 md:px-8 py-5 font-black">Role</th>
              <th className="px-6 md:px-8 py-5 font-black text-right pr-10">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="px-6 md:px-8 py-5 text-sm font-bold tracking-tight text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-[10px] group-hover:border-blue-500/30 transition-colors">
                        {user.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[120px]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-xs text-zinc-500 lowercase truncate max-w-[150px]">
                    {user.email}
                  </td>
                  <td className="px-6 md:px-8 py-5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                        user.role === "admin"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-zinc-800/50 text-zinc-400 border-white/5"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-right pr-10">
                    {user.id !== sessionUserId ? (
                      <UserActions
                        userId={user.id}
                        userName={user.name}
                        userEmail={user.email}
                        currentRole={user.role}
                      />
                    ) : (
                      <div className="flex items-center justify-end pr-4 text-[10px] font-bold text-zinc-600 italic">
                        You (Active)
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-xs tracking-widest bg-black/5 italic"
                >
                  No users found for "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminStats, getAllUsers, getAdminChartData } from "@/server/users";
import { Users, CreditCard, Activity, ShieldAlert } from "lucide-react";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { UserTable } from "@/components/admin/UserTable";

// --- ⚡ KONFIGURASI DYNAMIC RENDER ---
// Memaksa Next.js mengambil data terbaru setiap kali halaman dibuka
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await auth();

  // Proteksi: Hanya Admin yang bisa masuk
  // Pengecekan dilakukan secara ketat agar lolos build TypeScript di Vercel
  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch semua data secara paralel agar performa kencang
  const [statsResult, userListResult, chartResult] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
    getAdminChartData(),
  ]);

  const stats = statsResult.data;
  const usersData = userListResult.data || [];
  const chartData = chartResult.data || [];

  return (
    <div className="space-y-6 md:space-y-10 pb-12 animate-in fade-in duration-500 will-change-contents">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Live System
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
            Admin Central<span className="text-blue-500">.</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-medium">
            Manajemen platform FinTrack.io
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-white/5 rounded-2xl shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
            <ShieldAlert size={16} />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              Admin Access
            </p>
            <p className="text-xs font-black text-white">
              {session.user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* --- Statistics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Users */}
        <div className="group p-6 md:p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-blue-500/30 transition-colors">
          <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-5">
            <Users size={22} />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Total Pengguna
          </p>
          <p className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            {stats?.userCount || 0}
          </p>
        </div>

        {/* Total Transactions */}
        <div className="group p-6 md:p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-5">
            <Activity size={22} />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Total Transaksi
          </p>
          <p className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            {stats?.transactionCount || 0}
          </p>
        </div>

        {/* Volume Keuangan */}
        <div className="group p-6 md:p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-5">
            <CreditCard size={22} />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Volume
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-zinc-600">Rp</span>
            <p className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              {stats?.volume?.toLocaleString("id-ID") || 0}
            </p>
          </div>
        </div>
      </div>

      {/* --- Growth Charts Section --- */}
      <AdminCharts data={chartData} />

      {/* --- Users Management Table --- */}
      {/* PENTING: Key dinamis untuk memaksa React re-render tabel saat data berubah */}
      <UserTable
        key={usersData.length + (usersData[0]?.id || "empty")}
        usersData={usersData}
        sessionUserId={session.user?.id || ""}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { TransactionModal } from "./TransactionModal";
import { CashFlowChart } from "./CashFlowChart";
import Link from "next/link";

export function DashboardClient({ transactions, categories, summary }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-24 md:pb-10">
      {/* Modal Form */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Ringkasan keuangan Anda.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-neon-blue hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Transaksi Baru
        </button>
      </div>

      {/* Cards Section: Backdrop Blur & Shadow Removed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <div className="bg-zinc-900 border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden h-full min-h-[150px] rounded-[2rem]">
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Total Saldo
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tighter">
              {formatCurrency(summary.balance)}
            </h2>
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Aktif
            </span>
            <Wallet
              className="text-zinc-800 absolute -right-4 -bottom-4 opacity-50"
              size={80}
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 flex items-center gap-5 h-full min-h-[120px] rounded-[2rem]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/10">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Pemasukan
            </p>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter mt-1">
              {formatCurrency(summary.income)}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 flex items-center gap-5 h-full min-h-[120px] rounded-[2rem]">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/10">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Pengeluaran
            </p>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter mt-1">
              {formatCurrency(summary.expense)}
            </h2>
          </div>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="bg-zinc-900 border border-white/5 p-5 md:p-6 rounded-[2rem]">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">
          Analitik Cashflow
        </h3>
        <div className="h-[250px] md:h-[350px] w-full">
          <CashFlowChart data={transactions} />
        </div>
      </div>

      {/* Recent Transactions List: Backdrop Blur & Shadow Removed */}
      <div className="bg-zinc-900 border border-white/5 p-5 md:p-6 rounded-[2rem]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white">Transaksi Terakhir</h3>
          <Link
            href="/transactions"
            className="text-xs text-neon-blue flex items-center gap-1 group"
          >
            Lihat Semua{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="space-y-4">
          {transactions && transactions.length > 0 ? (
            transactions.slice(0, 5).map((t: any) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                  >
                    {t.type === "income" ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {t.description || "Tanpa Keterangan"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5 font-mono">
                      <span>{formatDate(t.date)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />{" "}
                        {new Date(t.date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm md:text-base font-bold font-mono shrink-0 ml-3 ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 py-8 italic text-sm">
              Belum ada transaksi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
};

export function CashFlowChart({ data }: { data: Transaction[] }) {
  // Logic: Mengelompokkan transaksi berdasarkan tanggal
  const chartData = useMemo(() => {
    const groupedData: Record<
      string,
      { date: string; income: number; expense: number }
    > = {};

    // Urutkan data dari yang terlama ke terbaru untuk grafik
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    sortedData.forEach((t) => {
      const dateKey = new Date(t.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }

      if (t.type === "income") {
        groupedData[dateKey].income += t.amount;
      } else {
        groupedData[dateKey].expense += t.amount;
      }
    });

    return Object.values(groupedData);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-zinc-500">
        Belum ada data untuk ditampilkan grafik.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient untuk Pemasukan (Biru) */}
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            {/* Gradient untuk Pengeluaran (Merah/Rose) */}
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              borderColor: "#27272a",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#e4e4e7" }}
            formatter={(value: number) => [formatCurrency(value), "Jumlah"]}
          />

          <Area
            type="monotone"
            dataKey="income"
            name="Pemasukan"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Pengeluaran"
            stroke="#f43f5e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

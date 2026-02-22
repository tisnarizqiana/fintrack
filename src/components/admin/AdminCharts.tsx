"use client";

import React, { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from "recharts";

// Helper ringkas untuk sumbu Y agar tidak makan tempat
const formatYAxis = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
  return value.toString();
};

// Tooltip Solid: Ringan karena tidak pakai backdrop-blur
const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-white/10 p-3 rounded-xl shadow-lg">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-black text-white">
          {prefix}
          {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

export const AdminCharts = memo(({ data }: { data: any[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 will-change-transform">
      {/* --- Chart: User Growth --- */}
      <div className="bg-zinc-900 border border-white/5 p-6 md:p-8 rounded-[2rem] space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              User Growth
            </h3>
            <p className="text-zinc-500 text-[10px] font-bold mt-1">
              Pendaftaran 7 hari terakhir
            </p>
          </div>
          <div className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[9px] font-black border border-blue-500/20">
            LIVE
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.02)"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#52525b", fontSize: 10, fontWeight: "bold" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#52525b", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                isAnimationActive={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Chart: Financial Flow --- */}
      <div className="bg-zinc-900 border border-white/5 p-6 md:p-8 rounded-[2rem] space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Financial Flow
            </h3>
            <p className="text-zinc-500 text-[10px] font-bold mt-1">
              Volume Mingguan
            </p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[9px] font-black border border-emerald-500/20">
            REALTIME
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.02)"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#52525b", fontSize: 10, fontWeight: "bold" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                content={<CustomTooltip prefix="Rp" />}
                isAnimationActive={false}
              />
              <Bar
                dataKey="volume"
                radius={[6, 6, 6, 6]}
                isAnimationActive={false}
                barSize={28}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === data.length - 1 ? "#10b981" : "#10b98130"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

AdminCharts.displayName = "AdminCharts";

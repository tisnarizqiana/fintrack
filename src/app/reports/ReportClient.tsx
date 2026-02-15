"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileDown,
  Filter,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  transactions: any[];
  categories: any[];
};

export function ReportClient({ transactions, categories }: Props) {
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth());
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  const filteredData = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const startDate = new Date(startYear, startMonth, 1);
    const endDate = new Date(endYear, endMonth + 1, 0, 23, 59, 59);

    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const totalIncome = filteredData
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredData
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const categorySummary = filteredData.reduce((acc: any, t) => {
    const catName =
      categories.find((c) => c.id === t.categoryId)?.name || "Umum";
    if (!acc[catName]) acc[catName] = 0;
    acc[catName] += t.amount;
    return acc;
  }, {});

  const exportToCSV = () => {
    const startMonthName = new Intl.DateTimeFormat("id-ID", {
      month: "long",
    }).format(new Date(startYear, startMonth));
    const endMonthName = new Intl.DateTimeFormat("id-ID", {
      month: "long",
    }).format(new Date(endYear, endMonth));

    let csvRows = [];
    csvRows.push("FinTrack.io - Laporan Riwayat Transaksi Berkala");
    csvRows.push(
      `${startMonthName.toUpperCase()} ${startYear} - ${endMonthName.toUpperCase()} ${endYear}`,
    );
    csvRows.push(`Dicetak pada: ${formatDate(new Date())}`);
    csvRows.push("");

    csvRows.push("NO,TANGGAL,WAKTU,KETERANGAN,KATEGORI,TIPE,JUMLAH");
    filteredData.forEach((t, index) => {
      const row = [
        index + 1,
        formatDate(t.date),
        new Date(t.date).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        `"${t.description || "-"}"`,
        categories.find((c) => c.id === t.categoryId)?.name || "Umum",
        t.type === "income" ? "MASUK" : "KELUAR",
        `"${formatCurrency(t.amount)}"`,
      ];
      csvRows.push(row.join(","));
    });

    csvRows.push("");
    csvRows.push("Analisa per Kategori");
    csvRows.push("NAMA KATEGORI,TOTAL AKUMULASI");
    Object.entries(categorySummary).forEach(([name, total]) => {
      csvRows.push(
        `${name.toUpperCase()},"${formatCurrency(total as number)}"`,
      );
    });

    csvRows.push("");
    csvRows.push(`,,Total Pemasukan:,"${formatCurrency(totalIncome)}"`);
    csvRows.push(`,,Total Pengeluaran:,"${formatCurrency(totalExpense)}"`);
    csvRows.push(
      `,,SALDO AKHIR,"${formatCurrency(totalIncome - totalExpense)}"`,
    );

    const blob = new Blob(["\ufeff" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_FinTrack_${startMonthName}_${endMonthName}.csv`;
    link.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const startMonthName = new Intl.DateTimeFormat("id-ID", {
      month: "long",
    }).format(new Date(startYear, startMonth));
    const endMonthName = new Intl.DateTimeFormat("id-ID", {
      month: "long",
    }).format(new Date(endYear, endMonth));

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FinTrack", 14, 22);
    doc.setTextColor(147, 197, 253);
    doc.text(".io", 46, 22);
    doc.setFontSize(10);
    doc.setTextColor(219, 234, 254);
    doc.text("Laporan Riwayat Transaksi Berkala", 14, 30);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    const periodText = `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
    doc.text(periodText.toUpperCase(), 196, 22, { align: "right" });
    doc.setFontSize(9);
    doc.text(`Dicetak pada: ${formatDate(new Date())}`, 196, 30, {
      align: "right",
    });

    autoTable(doc, {
      startY: 55,
      head: [
        ["NO", "TANGGAL", "WAKTU", "KETERANGAN", "KATEGORI", "TIPE", "JUMLAH"],
      ],
      body: filteredData.map((t, index) => [
        index + 1,
        formatDate(t.date),
        new Date(t.date).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        t.description || "-",
        categories.find((c) => c.id === t.categoryId)?.name || "Umum",
        t.type === "income" ? "MASUK" : "KELUAR",
        formatCurrency(t.amount),
      ]),
      theme: "striped",
      headStyles: { fillColor: [30, 58, 138], halign: "center" },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        1: { halign: "center" },
        2: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center", fontStyle: "bold" },
      },
      styles: { fontSize: 8.5 },
    });

    const finalY1 = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.text("Analisa per Kategori", 14, finalY1);

    autoTable(doc, {
      startY: finalY1 + 5,
      head: [["NAMA KATEGORI", "TOTAL AKUMULASI"]],
      body: Object.entries(categorySummary).map(([name, total]) => [
        name.toUpperCase(),
        formatCurrency(total as number),
      ]),
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], halign: "center" },
      columnStyles: { 1: { halign: "center", fontStyle: "bold" } },
    });

    const finalY2 = (doc as any).lastAutoTable.finalY + 15;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, finalY2, 196, finalY2);
    doc.text("Total Pemasukan:", 130, finalY2 + 10);
    doc.setTextColor(16, 185, 129);
    doc.text(formatCurrency(totalIncome), 196, finalY2 + 10, {
      align: "right",
    });
    doc.setTextColor(100);
    doc.text("Total Pengeluaran:", 130, finalY2 + 18);
    doc.setTextColor(244, 63, 94);
    doc.text(formatCurrency(totalExpense), 196, finalY2 + 18, {
      align: "right",
    });
    doc.line(130, finalY2 + 22, 196, finalY2 + 22);
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.text("SALDO AKHIR", 130, finalY2 + 30);
    doc.text(formatCurrency(totalIncome - totalExpense), 196, finalY2 + 30, {
      align: "right",
    });

    doc.save(`Laporan_FinTrack_Berkala.pdf`);
  };

  return (
    <div className="space-y-6 pb-10 px-4 md:px-0">
      {/* FILTER SECTION: Backdrop Blur & Shadow Removed */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-500" />
          <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            Filter Rentang Periode
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs text-zinc-500 font-bold uppercase shrink-0">
              Dari:
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="flex-1 sm:flex-none bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
                      new Date(0, i),
                    )}
                  </option>
                ))}
              </select>
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="flex-1 sm:flex-none bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ArrowRight
            className="hidden md:block text-zinc-700 shrink-0"
            size={20}
          />
          <div className="md:hidden h-px w-full bg-zinc-800 my-1" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs text-zinc-500 font-bold uppercase shrink-0">
              Sampai:
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(Number(e.target.value))}
                className="flex-1 sm:flex-none bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
                      new Date(0, i),
                    )}
                  </option>
                ))}
              </select>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="flex-1 sm:flex-none bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons: Shadows Removed */}
          <div className="md:ml-auto flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
              className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <FileSpreadsheet size={18} /> Export CSV
            </button>
            <button
              onClick={generatePDF}
              disabled={filteredData.length === 0}
              className="flex-1 justify-center bg-neon-blue hover:bg-blue-600 disabled:opacity-30 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <FileDown size={18} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS: Backdrop Blur & Shadow Removed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 border-l-4 border-l-neon-blue">
          <div className="flex items-center gap-3 text-neon-blue mb-2">
            <PieChart size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Saldo (Periode)
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {formatCurrency(totalIncome - totalExpense)}
          </h3>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <TrendingUp size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pemasukan Berkala
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {formatCurrency(totalIncome)}
          </h3>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3 text-rose-500 mb-2">
            <TrendingDown size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pengeluaran Berkala
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {formatCurrency(totalExpense)}
          </h3>
        </div>
      </div>

      {/* PREVIEW TABLE: Backdrop Blur & Shadow Removed */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Preview Riwayat ({filteredData.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-black/20 font-bold">
              <tr>
                <th className="px-4 py-4 text-center shrink-0">No.</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">
                  Tanggal
                </th>
                <th className="px-4 py-4 text-center whitespace-nowrap">
                  Waktu
                </th>
                <th className="px-4 py-4 min-w-[150px]">Keterangan</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">
                  Kategori
                </th>
                <th className="px-4 py-4 text-center whitespace-nowrap">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? (
                filteredData.map((t, index) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-zinc-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 font-mono text-center whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-4 font-mono text-zinc-400 text-center">
                      {new Date(t.date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-4 text-white font-medium">
                      {t.description || "-"}
                    </td>
                    <td className="px-4 py-4 capitalize text-center whitespace-nowrap">
                      {categories.find((c) => c.id === t.categoryId)?.name ||
                        "Umum"}
                    </td>
                    <td
                      className={`px-4 py-4 text-center font-bold font-mono whitespace-nowrap ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-600 italic"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

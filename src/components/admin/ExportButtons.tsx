"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ExportButtons({ data }: { data: any[] }) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(
      workbook,
      `Fintrack_Users_${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Daftar Pengguna FinTrack.io", 14, 15);
    autoTable(doc, {
      head: [["Nama", "Email", "Role"]],
      body: data.map((u) => [u.name, u.email, u.role]),
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] }, // Warna biru sesuai tema
    });
    doc.save(`Fintrack_Users_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToExcel}
        className="p-2.5 bg-zinc-800 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 transition-all"
        title="Export to Excel"
      >
        <FileSpreadsheet size={18} />
      </button>
      <button
        onClick={exportToPDF}
        className="p-2.5 bg-zinc-800 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500/10 transition-all"
        title="Export to PDF"
      >
        <FileText size={18} />
      </button>
    </div>
  );
}

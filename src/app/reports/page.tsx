import { getTransactions } from "@/server/transactions";
import { getCategories } from "@/server/categories";
// import ReportClient from "./ReportClient";
import { ReportClient } from "./ReportClient";
export default async function ReportsPage() {
  const [transRes, catRes] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Laporan Keuangan</h1>
        <p className="text-zinc-400 mt-1">
          Ekspor riwayat transaksi Anda ke format PDF.
        </p>
      </div>

      <ReportClient
        transactions={transRes.data || []}
        categories={catRes.data || []}
      />
    </div>
  );
}

import { getCategories } from "@/server/categories";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Profil Saya
        </h1>
        <p className="text-zinc-400 mt-1">
          Kelola profil dan kategori transaksi Anda.
        </p>
      </div>

      <SettingsClient initialCategories={categories || []} />
    </div>
  );
}

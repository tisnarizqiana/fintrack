"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Ambil Kategori Milik User yang Sedang Login
export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const data = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, session.user.id));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Gagal mengambil kategori" };
  }
}

// Tambah Kategori Baru
export async function addCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  try {
    await db.insert(categories).values({
      userId: session.user.id,
      name,
      type,
      icon,
      color,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan" };
  }
}

// Edit Kategori Milik Sendiri
export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  try {
    await db
      .update(categories)
      .set({ name, icon, color })
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, session.user.id), // Keamanan: Pastikan milik user tsb
        ),
      );
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui" };
  }
}

// Hapus Kategori Milik Sendiri
export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(categories).where(
      and(
        eq(categories.id, id),
        eq(categories.userId, session.user.id), // Keamanan: Pastikan milik user tsb
      ),
    );
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus" };
  }
}

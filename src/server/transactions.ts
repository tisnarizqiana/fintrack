"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Import fungsi auth untuk mengambil sesi

export async function getTransactions() {
  const session = await auth(); // Ambil sesi pengguna

  // Proteksi: Pastikan user sudah login
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const data = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.user.id)) // Hanya ambil data milik user yang login
      .orderBy(desc(transactions.date));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function addTransaction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;
  const type = formData.get("type") as "income" | "expense";
  const categoryId = formData.get("categoryId") as string;

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await db.insert(transactions).values({
      userId: session.user.id, // Gunakan ID dinamis dari sesi
      amount,
      description,
      type,
      categoryId,
      date,
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Gagal menyimpan" };
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;
  const type = formData.get("type") as "income" | "expense";
  const categoryId = formData.get("categoryId") as string;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await db
      .update(transactions)
      .set({ amount, description, type, categoryId, date })
      .where(
        and(
          eq(transactions.id, id),
          eq(transactions.userId, session.user.id), // Keamanan tambahan: Pastikan milik user yang benar
        ),
      );

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.delete(transactions).where(
      and(
        eq(transactions.id, id),
        eq(transactions.userId, session.user.id), // Keamanan tambahan: Pastikan milik user yang benar
      ),
    );

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

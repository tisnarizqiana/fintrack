"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  try {
    const data = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function addTransaction(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;
  const type = formData.get("type") as "income" | "expense";
  const categoryId = formData.get("categoryId") as string;

  // Mengambil string datetime-local (YYYY-MM-DDTHH:mm)
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await db.insert(transactions).values({
      userId: "user-demo-1",
      amount,
      description,
      type,
      categoryId,
      date, // Sekarang menyimpan jam dan menit
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan" };
  }
}

export async function updateTransaction(id: string, formData: FormData) {
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
      .where(eq(transactions.id, id));

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await db.delete(transactions).where(eq(transactions.id, id));
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

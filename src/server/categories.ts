"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const data = await db.select().from(categories);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Gagal mengambil kategori" };
  }
}

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";

  try {
    await db.insert(categories).values({
      name,
      type,
    });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

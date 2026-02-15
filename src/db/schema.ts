import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Tabel Kategori
export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"), // Untuk menyimpan nama icon Lucide
  color: text("color"), // Untuk custom warna kategori
});

// Tabel Transaksi
export const transactions = sqliteTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(), // Relasi ke user (clerk/next-auth)
  amount: real("amount").notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

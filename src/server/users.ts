"use server";

import { db } from "@/db";
import { users, verificationCodes, transactions } from "@/db/schema";
import { eq, sql, and, ne } from "drizzle-orm"; // Digunakan untuk validasi edit
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// --- 📧 KONFIGURASI GMAIL (NODEMAILER) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// --- 🛡️ BAGIAN ADMIN: AKSI MANAJEMEN ---

/**
 * Admin: Membuat user baru secara langsung tanpa OTP
 */
export async function adminCreateUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "admin" | "user";

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) return { success: false, error: "Email sudah digunakan" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Admin Create User Error:", error);
    return { success: false, error: "Gagal membuat user baru" };
  }
}

/**
 * Admin: Update Nama & Email User (Edit Data)
 */
export async function updateUserAdmin(
  userId: string,
  name: string,
  email: string,
) {
  try {
    // Validasi: Cek apakah email baru sudah dipakai user LAIN
    const existing = await db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, userId)),
    });

    if (existing)
      return { success: false, error: "Email sudah digunakan user lain" };

    await db.update(users).set({ name, email }).where(eq(users.id, userId));

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Admin Update User Error:", error);
    return { success: false, error: "Gagal memperbarui data user" };
  }
}

/**
 * Admin: Mengubah role user (Admin <-> User)
 */
export async function updateUserRole(
  userId: string,
  newRole: "admin" | "user",
) {
  try {
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Role Error:", error);
    return { success: false, error: "Gagal mengubah role user" };
  }
}

/**
 * Admin: Meriset password user secara manual
 */
export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Admin Reset Password Error:", error);
    return { success: false, error: "Gagal meriset password" };
  }
}

/**
 * Admin: Menghapus akun user secara permanen
 */
export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    return { success: false, error: "Gagal menghapus user" };
  }
}

// --- 📧 BAGIAN AUTH: REGISTER DENGAN OTP ---

export async function sendOTP(email: string) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) return { success: false, error: "Email sudah terdaftar" };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db
      .insert(verificationCodes)
      .values({ email, code, expiresAt })
      .onConflictDoUpdate({
        target: verificationCodes.email,
        set: { code, expiresAt },
      });

    await transporter.sendMail({
      from: `"FinTrack.io" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verification Code - FinTrack.io",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; text-align: center; background-color: #f4f4f5; border-radius: 20px;">
          <h2 style="color: #3b82f6;">Verifikasi Akun FinTrack</h2>
          <p>Gunakan kode OTP di bawah ini untuk pendaftaran:</p>
          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e4e4e7;">
            <h1 style="color: #3b82f6; letter-spacing: 10px; font-size: 36px; margin: 0;">${code}</h1>
          </div>
          <p style="font-size: 12px; color: #71717a;">Kode ini akan kadaluarsa dalam 10 menit.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Gmail SMTP sendOTP Error:", error);
    return { success: false, error: "Gagal mengirim email verifikasi" };
  }
}

export async function verifyAndRegister(formData: FormData, code: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const storedRecord = await db.query.verificationCodes.findFirst({
      where: eq(verificationCodes.email, email),
    });

    if (!storedRecord || storedRecord.code !== code)
      return { success: false, error: "Kode OTP salah" };
    if (new Date() > storedRecord.expiresAt)
      return { success: false, error: "Kode OTP kadaluarsa" };

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role: "user" });
    await db
      .delete(verificationCodes)
      .where(eq(verificationCodes.email, email));

    return { success: true };
  } catch (error) {
    console.error("verifyAndRegister Error:", error);
    return { success: false, error: "Gagal mendaftarkan akun" };
  }
}

// --- 🔑 BAGIAN AUTH: LUPA PASSWORD ---

export async function requestPasswordReset(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) return { success: false, error: "Email tidak ditemukan" };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db
      .insert(verificationCodes)
      .values({ email, code, expiresAt })
      .onConflictDoUpdate({
        target: verificationCodes.email,
        set: { code, expiresAt },
      });

    await transporter.sendMail({
      from: `"FinTrack Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Password - FinTrack.io",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Pemulihan Kata Sandi</h2>
          <p>Gunakan kode di bawah ini untuk mereset password Anda:</p>
          <h1 style="color: #3b82f6; letter-spacing: 5px;">${code}</h1>
        </div>
      `,
    });

    return { success: true }; // FIX: Sebelumnya return { true: true }
  } catch (error) {
    console.error("requestPasswordReset Gmail Error:", error);
    return { success: false, error: "Gagal mengirim email reset" };
  }
}

export async function resetPasswordWithOTP(
  email: string,
  code: string,
  newPassword: string,
) {
  try {
    const storedRecord = await db.query.verificationCodes.findFirst({
      where: eq(verificationCodes.email, email),
    });
    if (!storedRecord || storedRecord.code !== code)
      return { success: false, error: "OTP Salah" };
    if (new Date() > storedRecord.expiresAt)
      return { success: false, error: "OTP Kadaluarsa" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
    await db.delete(verificationCodes).where(eq(users.email, email));

    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update password" };
  }
}

// --- 🚪 BAGIAN AUTH: LOGIN ---

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, error: "Kredensial salah" };
    }
    return {
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    };
  } catch (error) {
    return { success: false, error: "Server error" };
  }
}

// --- 📊 BAGIAN ADMIN: DATA & STATISTIK ---

export async function getAdminStats() {
  try {
    const [userCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(users);
    const [transactionCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(transactions);
    const [volume] = await db
      .select({ value: sql<number>`sum(${transactions.amount})` })
      .from(transactions);

    return {
      success: true,
      data: {
        userCount: userCount.value ?? 0,
        transactionCount: transactionCount.value ?? 0,
        volume: volume.value ?? 0,
      },
    };
  } catch (error) {
    console.error("getAdminStats Error:", error);
    return {
      success: false,
      data: { userCount: 0, transactionCount: 0, volume: 0 },
    };
  }
}

export async function getAllUsers() {
  try {
    const data = await db.select().from(users);
    const safeData = data.map(({ password, ...rest }) => rest);
    return { success: true, data: safeData };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/**
 * FIXED: Query Grafik Sesuai Schema (Seconds Based)
 */
export async function getAdminChartData() {
  try {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const userDateSql = sql`date(${users.createdAt}, 'unixepoch')`;
    const transDateSql = sql`date(${transactions.createdAt}, 'unixepoch')`;

    const userGrowth = await db
      .select({
        date: userDateSql,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(sql`${users.createdAt} >= strftime('%s', 'now', '-7 days')`)
      .groupBy(userDateSql);

    const transactionVolume = await db
      .select({
        date: transDateSql,
        total: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(sql`${transactions.createdAt} >= strftime('%s', 'now', '-7 days')`)
      .groupBy(transDateSql);

    const finalChartData = days.map((dateString) => {
      const userData = userGrowth.find((u) => u.date === dateString);
      const volumeData = transactionVolume.find((t) => t.date === dateString);

      return {
        date: new Date(dateString).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        users: userData?.count || 0,
        volume: volumeData?.total ? Number(volumeData.total) : 0,
      };
    });

    return { success: true, data: finalChartData };
  } catch (error) {
    console.error("getAdminChartData Error:", error);
    return { success: true, data: [] };
  }
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";

// --- ⚡ MODULE AUGMENTATION ---
// Bagian ini sangat penting agar Vercel tidak error saat build.
// Kita mendaftarkan properti 'role' dan 'id' ke dalam tipe data bawaan NextAuth.
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Cari user berdasarkan email
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        // Jika user tidak ditemukan atau password tidak cocok
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) return null;

        // Kembalikan objek user untuk disimpan di JWT/Session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Data dari database masuk ke sini
        };
      },
    }),
  ],
  callbacks: {
    // Memasukkan role & id ke dalam Token (JWT)
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Memasukkan data dari Token ke dalam Session agar bisa dibaca di UI (Client/Server Component)
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});

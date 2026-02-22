import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
          role: user.role, // Pastikan role ikut dikirim
        };
      },
    }),
  ],
  callbacks: {
    // Memasukkan role ke dalam Token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // Memasukkan role dari Token ke Session agar bisa dibaca di UI
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});

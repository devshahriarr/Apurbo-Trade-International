import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [CredentialsProvider({
    name: "Email and password",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;
      if (!email || !password) return null;
      const user = await prisma.user.findFirst({ where: { email, isActive: true } });
      if (!user || !(await compare(password, user.passwordHash))) return null;
      return { id: user.id, name: user.name, email: user.email };
    },
  })],
  callbacks: {
    async jwt({ token, user }) { if (user?.id) token.sub = user.id; return token; },
    async session({ session, token }) { if (session.user && token.sub) session.user.id = token.sub; return session; },
  },
};

import type { NextAuthOptions, Session } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma), // make sure you're using this so users get created in your DB
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }: {session: Session, user: AdapterUser}) {
      if (session.user) {
        session.user.id = user.id; // <- this adds the user id to session.user
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

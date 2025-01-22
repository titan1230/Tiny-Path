import NextAuth, { Account, NextAuthConfig } from "next-auth";
import client from "@/lib/db";
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./database/drizzle";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  basePath: BASE_PATH,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/error",
    signIn: "/onboarding"
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export default auth;

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      username?: string;
    };
  }
}

export const { GET, POST } = handlers;

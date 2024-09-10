import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Account } from "next-auth";
import client from "@/lib/db";
import authConfig from "./auth.config";
import { JWT } from "next-auth/jwt";

export const BASE_PATH = "/api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client, { databaseName: "tinypath" }),
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user, account }: { token: JWT; user: any; account: Account | null }) {

      if (user) {

        token.id = user.id;

        if (account) {
          token.accessToken = account.access_token;
          token.provider = account.provider;
        }
      }

      return token;
    },
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl;
        const unprotectedRoutes = ["/", "/onboarding", "/api/auth/signin"];

        if (unprotectedRoutes.includes(pathname)) {
          return true;
        }

        return !!auth;
      } catch (error) {
        console.error("Authorization check failed:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;

        try {
          const db = client.db("tinypath");
          const collection = db.collection("users");

          const user = await collection.findOne({ email: token.email });
          session.user.id = user?._id.toString() as string;

          if (user?.username) {
            session.user.username = user.username;
          } else {
            console.log("User not found, creating new user");
            const newUser = {
              username: token.email?.substring(0, token.email.indexOf("@")) || "defaultUsername",
            };

            const insertResult = await collection.findOneAndUpdate(
              { email: token.email },                  // Filter by email
              { $set: newUser },                       // Update with new user data
              { returnDocument: 'after', upsert: true } // Return the updated document after upserting
            );

            session.user.username = newUser.username;
          }
        } catch (error) {
          console.error("Failed to fetch or insert user:", error);
        }
      }

      return session;
    },
  },
  basePath: BASE_PATH,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
});

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

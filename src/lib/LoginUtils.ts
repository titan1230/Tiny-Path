"use server";
import { signIn as naSignIn, signOut as naSignOut } from "@/auth";

export async function signIn(to: string = "/dashboard") {
  await naSignIn("google", {redirectTo: to});
}

export async function signOut() {
  await naSignOut({ redirectTo: "/" });
}
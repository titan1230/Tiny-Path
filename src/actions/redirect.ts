"use server";

import { redirect } from "next/navigation";

export async function redr(dest: string) {
    redirect(dest);
}
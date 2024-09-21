import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import NextAuth from "next-auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|plans|contact|.*\.svg|.*\.png|.*\.mp4|.*\.lottie).*)"]
}

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const reqUrl = new URL(req.url);

  if (!req.auth && reqUrl?.pathname !== "/") {
    if (reqUrl.pathname === "/onboarding") return;

    return NextResponse.redirect(new URL(`/onboarding?to=${encodeURIComponent(reqUrl.pathname)}`, req.url));
  }

  if (req.auth && reqUrl?.pathname === "/onboarding") {

    const redTO = reqUrl.searchParams.get("to");

    if (redTO) {
      return NextResponse.redirect(new URL(redTO, req.url));
    } else {
      return NextResponse.redirect(new URL(`/dashboard`, req.url));
    }
  }
});
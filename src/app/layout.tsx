import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TinyPath",
  description: "Shorten, Share, and Track Your Links with Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6673007622499235"
        crossOrigin="anonymous"></script>
      <body className={inter.className}>
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

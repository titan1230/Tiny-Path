// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Dashboard/Sidebar';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'A simple URL shortener application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar>{children}</Sidebar>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

import React, { Suspense } from "react";
import { format, formatDistanceToNow } from "date-fns";
import LinkViewer from "@/components/LinkViewer";

interface LinkData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  expiresAt: string;
}

interface PageProps {
  params: Promise<{
    linkID: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { linkID } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/urls/${linkID}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-2xl p-8 shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Link not found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{`We couldn't find a link with that ID.`}</p>
        </div>
      </main>
    );
  }

  const data: LinkData = await res.json();
  const fullShortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/travel/${data.shortUrl}`;
  const expiresIn = formatDistanceToNow(new Date(data.expiresAt), { addSuffix: true });
  const expiresFull = format(new Date(data.expiresAt), "PPpp");

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="rounded-xl p-8 bg-white dark:bg-slate-800 shadow">Loading…</div>}>
          <LinkViewer
            data={data}
            fullShortUrl={fullShortUrl}
            expiresIn={expiresIn}
            expiresFull={expiresFull}
          />
        </Suspense>
      </div>
    </main>
  );
}
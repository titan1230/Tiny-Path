"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

interface LinkData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  expiresAt: string;
}

export default function LinkViewer({
  data,
  fullShortUrl,
  expiresIn,
  expiresFull,
}: {
  data: LinkData;
  fullShortUrl: string;
  expiresIn: string;
  expiresFull: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async (text: string) => {
    if (!navigator.clipboard) {
      setCopyState("failed");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (e) {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const handleShare = async (url: string) => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Check this link", url });
      } catch (e) {}
    } else {
      await handleCopy(url);
    }
  };

  const qrSrc = `/api/get-qr?data=${encodeURIComponent(fullShortUrl)}`;

  return (
    <div className="rounded-3xl shadow-2xl border dark:border-slate-700 overflow-hidden">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border">
            <Image src={"/TinyPath.png"} height={40} width={40} alt="logo" />
          </div>
    
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Link Created</h1>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white dark:bg-slate-800">
        <section className="md:col-span-2 bg-transparent">
          <div className="mb-3">
            <label className="text-xs text-gray-500 dark:text-gray-400">Original URL</label>
            <a href={data.originalUrl} target="_blank" rel="noreferrer" className="block mt-1 text-sm font-medium break-all text-indigo-600 dark:text-indigo-300 underline">
              {data.originalUrl}
            </a>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Short URL</label>
            <div className="flex items-center gap-3 mt-2">
              <code className="flex-1 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg font-mono text-sm break-all">{fullShortUrl}</code>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(fullShortUrl)}
                  className="px-3 py-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm bg-white dark:bg-slate-800"
                >
                  {copyState === "copied" ? "Copied! ✅" : "Copy"}
                </button>

                <button
                  onClick={() => handleShare(fullShortUrl)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                >
                  Share
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Clicks:</strong> <span className="ml-1">{data.clicks}</span>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-200 text-right">
                <strong>Expires:</strong>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{expiresIn} — <span className="italic">{expiresFull}</span></div>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={data.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow hover:scale-[1.01] transition-transform"
              >
                Visit Original URL
              </a>
            </div>
          </div>
        </section>

        <aside className="bg-transparent flex flex-col items-center gap-4">
          <Image src={qrSrc} alt="QR code" width={150} height={150} className="w-40 h-40 rounded-lg bg-white dark:bg-slate-700 p-2" />

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Scan to open</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">or copy / share the short link</p>
          </div>

          <div className="w-full">
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrSrc;
                a.download = `qr-${data.shortUrl}.png`;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800"
            >
              Download QR
            </button>
          </div>
        </aside>
      </div>

      <footer className="p-6 bg-white dark:bg-slate-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <div>Short link: <span className="font-mono">{data.shortUrl}</span></div>
      </footer>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

import StatCard from '@/components/Dashboard/StatCard';
import ValueComponent from '@/components/Dashboard/StatValue';
import { useSession } from 'next-auth/react';

interface LinkData {
  id: number;
  userID: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  expiresAt: Date | null;
  urlType: string;
}

async function fetchLinks(userID: string | undefined): Promise<{ [key: string]: LinkData[] }> {
  if (!userID) {
    return { "0": [] };
  }

  const res = await fetch(`/api/user/links?userID=${userID}`)
  if (!res.ok) {
    throw new Error('Failed to fetch links');
  }

  const data = await res.json();
  return data;
}

export default function Dashboard() {
  const session = useSession();

  const [links, setLinks] = useState<LinkData[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadLinks = useCallback(() => {
    fetchLinks(session.data?.user.id).then((data) => {
      setLinks(data[0]);

      setPages(Math.ceil(Object.keys(data).length / 10));
    });
  }, [session.data?.user.id]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Links" value={<ValueComponent />} change="+12.5%" positive />
        <StatCard title="Total Clicks" value="45.2k" change="+8.1%" positive />
        <StatCard title="Avg. CTR" value="3.2%" change="-2.3%" positive={false} />
        <StatCard title="Active Links" value="891" change="+5.4%" positive />
      </div>

      {/* Recent Links */}
      <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Recent Links
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600">
              <Plus size={16} />
              <span>New Link</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                <th className="pb-4">Original URL</th>
                <th className="pb-4">Short URL</th>
                <th className="pb-4">Clicks</th>
                <th className="pb-4">Created</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {links?.map((data, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded mr-3 flex items-center justify-center">
                        {/* <Globe size={16} className="text-gray-500 dark:text-gray-400" /> */}
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${data.originalUrl}&sz=24`}
                          alt="Site favicon"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                        {data.originalUrl}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-blue-600 dark:text-blue-400">{data.shortUrl}</span>
                  </td>
                  <td className="py-4 dark:text-gray-300">{data.clicks}</td>
                  <td className="py-4 text-gray-500 dark:text-gray-400">
                    {data.createdAt ? (
                      formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

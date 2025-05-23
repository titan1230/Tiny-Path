"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';

import 'react-loading-skeleton/dist/skeleton.css';

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
  if (!userID) return { "0": [] };

  const res = await fetch(`/api/user/links?userID=${userID}`);
  if (!res.ok) throw new Error('Failed to fetch links');

  return res.json();
}

export default function Dashboard() {
  const session = useSession();

  const [links, setLinks] = useState<LinkData[]>([]);
  const [totalLinks, setTotalLinks] = useState<{ [key: string]: LinkData[] }>({ "0": [] });
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLinks = useCallback(() => {
    setLoading(true);
    fetchLinks(session.data?.user.id).then((data) => {
      setTotalLinks(data);
      setLinks(data['0']);
      setPages(Object.keys(data).length);
      setLoading(false);
    });
  }, [session.data?.user.id]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  return (
  <div className="p-4 md:p-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <StatCard title="Total Links" value={<ValueComponent />} change="+12.5%" positive />
      <StatCard title="Total Clicks" value="45.2k" change="+8.1%" positive />
      <StatCard title="Avg. CTR" value="3.2%" change="-2.3%" positive={false} />
      <StatCard title="Active Links" value="891" change="+5.4%" positive />
    </div>

    {/* Recent Links */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Links</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm">
          <Plus size={16} />
          <span>New Link</span>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="pb-4">Original URL</th>
                <th className="pb-4">Short URL</th>
                <th className="pb-4">Clicks</th>
                <th className="pb-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="py-4"><Skeleton width={160} /></td>
                    <td className="py-4"><Skeleton width={100} /></td>
                    <td className="py-4"><Skeleton width={40} /></td>
                    <td className="py-4"><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : (
                links.map((data, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${data.originalUrl}&sz=24`}
                          alt="favicon"
                          width={16}
                          height={16}
                          className="object-cover"
                        />
                        <span className="truncate max-w-[200px] text-gray-600 dark:text-gray-300">{data.originalUrl}</span>
                      </div>
                    </td>
                    <td className="py-4 text-blue-600 dark:text-blue-400">{data.shortUrl}</td>
                    <td className="py-4 dark:text-gray-300">{data.clicks}</td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded p-4 space-y-2">
                <Skeleton width="80%" />
                <Skeleton width="60%" />
                <Skeleton width="30%" />
                <Skeleton width="50%" />
              </div>
            ))
          ) : (
            links.map((data, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-1 text-sm">
                <div><strong className="text-gray-500">Original URL: </strong>{data.originalUrl}</div>
                <div><strong className="text-gray-500">Short URL: </strong>
                  <span className="text-blue-600 dark:text-blue-400">{data.shortUrl}</span>
                </div>
                <div><strong className="text-gray-500">Clicks: </strong>{data.clicks}</div>
                <div><strong className="text-gray-500">Created: </strong>
                  {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                setLinks(totalLinks[(currentPage - 2).toString()] || []);
              }}
            >
              Previous
            </button>

            {Array.from({ length: pages }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 text-sm rounded ${currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    setLinks(totalLinks[(pageNum - 1).toString()] || []);
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              disabled={currentPage === pages}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                setLinks(totalLinks[currentPage.toString()] || []);
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

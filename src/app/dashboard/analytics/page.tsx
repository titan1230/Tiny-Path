"use client";

import { ChartCard } from "@/components/Analytics/ChartCard";
import { SummaryCard } from "@/components/Analytics/SummaryCard";
import { TopLinksTable } from "@/components/Analytics/TopLinksTable";
import {
  AreaChart,
  BarChart,
  PieChart,
  LineChart,
  Pie,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { GlobeIcon, RefreshCcw, Smartphone, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface AnalyticsData {
  totalClicks: number;
  oldClicks: number;
  bounceRate: number;
  oldBounceRate: number;
  totalDailyVisitors: number;
  oldDailyUniqueVisitors: number;
  click_change: string;
  bounce_change: string;
  visitor_change: string;
  urlCount: number;
  recentClicks: { day: string; clicks: number }[];
  deviceData?: { name: string; value: number }[];
  locationData?: { name: string; value: number }[];
}

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#7c3aed"];

async function fetchAnalytics(userID: string | undefined): Promise<AnalyticsData> {
  if (!userID) {
    return {
      totalClicks: 0,
      oldClicks: 0,
      bounceRate: 0,
      oldBounceRate: 0,
      totalDailyVisitors: 0,
      oldDailyUniqueVisitors: 0,
      click_change: "0%",
      bounce_change: "0%",
      visitor_change: "0%",
      urlCount: 0,
      recentClicks: [],
    };
  }

  const res = await fetch(`/api/analytics?userID=${userID}`);

  if (res.status !== 200) {
    console.error("Failed to fetch analytics", await res.text());
    return {
      totalClicks: 0,
      oldClicks: 0,
      bounceRate: 0,
      oldBounceRate: 0,
      totalDailyVisitors: 0,
      oldDailyUniqueVisitors: 0,
      click_change: "0%",
      bounce_change: "0%",
      visitor_change: "0%",
      urlCount: 0,
      recentClicks: [],
    };
  }

  return res.json();
}

const fetchTopLinks = async (userID: string | undefined) => {
  if (!userID) return [];

  const res = await fetch(`/api/analytics/top?userID=${userID}`, {
    cache: "no-store",
  });

  if (res.status !== 200) {
    console.error("Failed to fetch top links", await res.text());
    return [];
  }

  return res.json();
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [linkData, setLinkData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const analytics = await fetchAnalytics(session.data?.user?.id);
      setData(analytics);

      const linkData = await fetchTopLinks(session.data?.user?.id);
      setLinkData(linkData);
    } catch (err) {
      console.error("fetch analytics error", err);
    } finally {
      setLoading(false);
    }
  }, [session.data?.user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-center">
        <div>
          <span className="loading loading-spinner loading-xl"></span>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const trafficData = data?.recentClicks.map((r) => ({ name: r.day, value: r.clicks })) ?? [];
  const timeData = trafficData;
  const deviceData = data?.deviceData ?? [];
  const locationData = data?.locationData ?? [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overview of clicks, traffic and conversions</p>
          </div>

          <div>
            <button className="btn btn-primary" onClick={fetchData}>
              <RefreshCcw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Clicks"
            value={data?.totalClicks ?? 0}
            change={data?.click_change ?? "0%"}
            positive
            icon={<Users className="text-indigo-600" />}
            accent="bg-indigo-50 dark:bg-indigo-900/20"
          />

          <SummaryCard
            title="Daily Unique Visitors"
            value={data?.totalDailyVisitors ?? 0}
            change={data?.visitor_change ?? "0%"}
            positive
            icon={<Smartphone className="text-cyan-500" />}
            accent="bg-cyan-50 dark:bg-cyan-900/20"
          />

          <SummaryCard
            title="Bounce Rate"
            value={`${data?.bounceRate ?? 0}%`}
            change={data?.bounce_change ?? "0%"}
            positive={false}
            icon={<GlobeIcon className="text-amber-500" />}
            accent="bg-amber-50 dark:bg-amber-900/20"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Traffic Overview">
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ fontSize: 13, color: '#4f46e5' }} />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#trafficGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Traffic by Time of Day">
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 13, color: '#06b6d4' }} />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Secondary charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Device Breakdown">
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Top Locations">
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 13, color: '#f59e0b' }} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={12}>
                    {locationData.map((entry, index) => (
                      <Cell key={`loc-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Top Links Table */}
        <section className="mb-6">
          <ChartCard title="Top Performing Links">
            <TopLinksTable linkData={linkData} />
          </ChartCard>
        </section>
      </div>
    </main>
  );
}

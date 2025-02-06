"use client"

import React from 'react';
import { Link, BarChart3, Globe, Users, Clock, TrendingUp } from 'lucide-react';
import ClicksLineChart from '@/components/Analytics/ClicksLineChart';

const StatCard = ({ icon: Icon, title, value, change }: { icon: React.ElementType, title: string, value: string, change: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl text-black font-semibold mt-1">{value}</h3>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
    <p className="mt-2 text-sm">
      <span className="text-green-500">{change}</span> vs last week
    </p>
  </div>
);

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link className="w-6 h-6 text-blue-500" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">URL Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: Just now</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <StatCard 
            icon={BarChart3}
            title="Total Clicks"
            value="1,234"
            change="+12.5%"
          />
          <StatCard 
            icon={Globe}
            title="Unique Visitors"
            value="892"
            change="+8.2%"
          />
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Click Analytics</h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-500">Trending up</span>
            </div>
          </div>
          <div className="h-80">
            <ClicksLineChart />
          </div>
        </div>

        {/* Recent Links Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Links</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">https://example.com/very-long-url...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">short.ly/abc123</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">245</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">https://anotherexample.com/page...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">short.ly/xyz789</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">182</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
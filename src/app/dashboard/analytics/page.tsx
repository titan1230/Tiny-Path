import React, { Suspense } from 'react';
import ClicksLineChart from '@/components/Analytics/ClicksLineChart';
import UserDevicesPieChart from '@/components/Analytics/UserDevicesPieChart';
import { generatePast30Days } from '@/lib/utils/dateHelpers';

async function getDailyClicks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/1/clicks`, { cache: 'no-store' });
  const { dailyClicks } = await res.json();

  const past30Days = generatePast30Days();

  const filledClicks = past30Days.map((date) => ({
    date,
    clicks: dailyClicks[date] || 0,
  }));

  return filledClicks;
}


async function getUserDevices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/1/devices`, { cache: 'no-store' });
  const data = await res.json();
  return data.userDevices;
}

export default async function AnalyticsPage() {
  const dailyClicks = await getDailyClicks();
  const userDevices = await getUserDevices();

  return (
    <div className="analytics-dashboard p-6">
      <div className='isolate rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 pr-8 pt-5'>
        <h2 className='text-3xl font-semibold pl-5 pb-3 text-black'>Clicks per day</h2>
        <Suspense fallback={<span className='loading loading-spinner'></span>}>
          <ClicksLineChart dailyClicks={dailyClicks} />
        </Suspense>
      </div>

      <Suspense fallback={<p>Loading User Devices Data...</p>}>
        <UserDevicesPieChart userDevices={userDevices} />
      </Suspense>
    </div>
  );
}

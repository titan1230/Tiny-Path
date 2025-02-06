'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const clickData = [
  { date: '2024-03-01', clicks: 120 },
  { date: '2024-03-02', clicks: 150 },
  { date: '2024-03-03', clicks: 180 },
  { date: '2024-03-04', clicks: 220 },
  { date: '2024-03-05', clicks: 190 },
  { date: '2024-03-06', clicks: 250 },
  { date: '2024-03-07', clicks: 280 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-black p-3 rounded-md text-white'>
        <p>{`Clicks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ClicksLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={clickData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClicksLineChart;

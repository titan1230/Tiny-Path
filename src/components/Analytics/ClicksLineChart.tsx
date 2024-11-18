'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const ClicksLineChart = ({ dailyClicks }: any) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dailyClicks}>
        <CartesianGrid strokeDasharray="5 5" stroke='#808080' />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="clicks" name='Clicks' stroke="#000" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClicksLineChart;

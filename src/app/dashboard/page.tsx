"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LinkData {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([
    { id: 1, originalUrl: 'https://example.com', shortUrl: 'https://short.ly/1', clicks: 50 },
    { id: 2, originalUrl: 'https://example.org', shortUrl: 'https://short.ly/2', clicks: 30 },
    { id: 3, originalUrl: 'https://example.net', shortUrl: 'https://short.ly/3', clicks: 20 },
  ]);

  const [newUrl, setNewUrl] = useState<string>('');

  const handleShorten = () => {
    if (newUrl) {
      const newLink: LinkData = {
        id: links.length + 1,
        originalUrl: newUrl,
        shortUrl: `https://short.ly/${links.length + 1}`,
        clicks: 0,
      };
      setLinks([...links, newLink]);
      setNewUrl('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">URL Shortener Dashboard</h1>
    </div>
  );
}

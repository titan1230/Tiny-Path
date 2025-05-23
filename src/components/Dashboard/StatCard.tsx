import { ReactNode, Suspense } from 'react';

interface StatCardProps {
  title: string;
  value: ReactNode;
  change: string;
  positive: boolean;
}

export default function StatCard({ title, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <Suspense fallback={<span className="loading loading-dots loading-xl"></span>}>
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
        </Suspense>
        <span className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
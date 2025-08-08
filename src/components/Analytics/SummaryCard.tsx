export function SummaryCard({ title, value, change, positive = true, icon, accent = "bg-gray-100" }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-lg sm:text-2xl font-semibold">{value}</p>
        </div>

        <div className={`p-2 rounded-lg ${accent} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-sm font-medium ${positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{change}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      )}

    </div>
  );
}
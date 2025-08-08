export function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
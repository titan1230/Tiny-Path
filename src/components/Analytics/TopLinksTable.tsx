import Image from "next/image";

interface RowData {
  clicks: number;
  unique: number;
  bounce: number;
  short: string;
  original: string;
  id: string;
}

export function TopLinksTable({ linkData }: { linkData: Array<RowData> }) {

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unique</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv. Rate</th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {linkData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${row.original}&sz=24`}
                      alt="favicon"
                      width={16}
                      height={16}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{row.short}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]" title={row.original}>{row.original}</div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.clicks.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.unique.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.bounce.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
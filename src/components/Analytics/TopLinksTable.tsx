import { Globe } from "lucide-react";

export function TopLinksTable(): JSX.Element {
  // static example rows
  const rows = [
    {
      id: 1,
      short: "short.ly/ab12cd",
      url: "https://example.com/very/long/url/that/needs/to/be/shortened",
      clicks: 8120,
      unique: 4200,
      conv: 3.21,
    },
    {
      id: 2,
      short: "short.ly/xk9z",
      url: "https://another-example.com/long/path/with/params?utm=1",
      clicks: 6120,
      unique: 3100,
      conv: 2.18,
    },
    {
      id: 3,
      short: "short.ly/hq77",
      url: "https://cool-site.com/some/deep/page",
      clicks: 5120,
      unique: 2900,
      conv: 4.02,
    },
    {
      id: 4,
      short: "short.ly/zz01",
      url: "https://shop.example.com/products/12345?ref=nav",
      clicks: 4120,
      unique: 2100,
      conv: 1.93,
    },
    {
      id: 5,
      short: "short.ly/pp66",
      url: "https://docs.example.com/article/how-to-use-this-dashboard",
      clicks: 3120,
      unique: 1800,
      conv: 0.95,
    },
  ];

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
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Globe size={16} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{row.short}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]" title={row.url}>{row.url}</div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.clicks.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.unique.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{row.conv.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
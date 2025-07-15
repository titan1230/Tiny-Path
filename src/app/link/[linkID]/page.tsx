import { format, formatDistanceToNow } from 'date-fns';

interface Props {
  params: Promise<{ linkID: string }>;
}

export default async function LinkPage({ params }: Props) {
  const { linkID } = await params;

  const link = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/urls/${linkID}`)
  const data = await link.json();

  const fullShortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/travel/${data.shortUrl}`;
  const expiresIn = formatDistanceToNow(new Date(data.expiresAt), { addSuffix: true });

  return (
    <main className="max-w-xl mx-auto mt-20 p-6 rounded-2xl shadow-xl border bg-white space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">🔗 Link Created Successfully</h1>

      <div className="space-y-3">
        <div>
          <span className="text-gray-500">Original URL:</span>
          <a href={data.originalUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline break-all">
            {data.originalUrl}
          </a>
        </div>

        <div>
          <span className="text-gray-500">Short URL:</span>
          <div className="flex items-center gap-2 mt-1 text-black">
            <code className="bg-gray-100 px-3 py-1 rounded font-mono">{fullShortUrl}</code>
            <button
              className="text-sm text-blue-600 underline"
              // onClick={() => navigator.clipboard.writeText(fullShortUrl)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-gray-700">
          <strong>Clicks:</strong> {data.clicks}
        </div>

        <div className="text-gray-700">
          <strong>Expires:</strong> {expiresIn} <span className="text-sm text-gray-500">({format(new Date(data.expiresAt), "PPpp")})</span>
        </div>

        <div>
          <a
            href={data.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Visit Original URL
          </a>
        </div>
      </div>
    </main>
  );
}
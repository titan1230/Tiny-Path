'use client';

import { FiHome } from 'react-icons/fi';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-xl md:text-2xl font-light mb-10">
          {error ? `An unexpected error occurred: ${error.message}` : "An unexpected error occurred."}
        </p>
        <Link href="/" className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-blue-600 transition ease-in-out duration-300"
          >
            <FiHome className="mr-2 text-2xl" />
            Go Back Home
          </button>
        </Link>
        <button
          onClick={() => reset()} // Reset the error boundary on button click
          className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 transition ease-in-out duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

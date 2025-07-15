'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

const spinnerVariants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

function Spinner() {
  return (
    <motion.div
      className="flex items-center justify-center"
      variants={spinnerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <svg
        className="animate-spin h-14 w-14 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </motion.div>
  );
}

export default function LinkLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const longURL = localStorage.getItem('longURL');
      if (!longURL) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/urls', {
          method: 'POST',
          body: JSON.stringify({ originalUrl: longURL, urlType: 'temp', expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000 }),
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await res.json();

        if (result?.shortUrl) {
          router.push(`/link/${result.shortUrl}`);
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error(e);
        router.push('/');
      } finally {
        localStorage.removeItem('longURL');
      }
    };

    fetchData();
  }, [router]);

  return (
    <div
      className={`
        flex flex-col items-center justify-center min-h-screen w-full relative
        overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#5fd9ca]
        animate-gradientBG
      `}
    >
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradientBG {
          background-size: 200% 200%;
          animation: gradientBG 8s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        className="
        bg-white/20 shadow-2xl rounded-2xl px-6 py-10 w-full max-w-md mx-4
        flex flex-col items-center backdrop-blur-2xl border border-white/30
        ring-1 ring-white/10
      "
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2 text-center drop-shadow-sm">
          Creating Your Link...
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-6 text-base md:text-lg">
          Please wait while we generate your short link.
        </p>


        <AnimatePresence initial={false} mode="wait">
          <Spinner key="spinner" />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

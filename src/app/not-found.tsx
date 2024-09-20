"use client";

import { FiHome } from 'react-icons/fi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
      <div className="text-center space-y-6">
        <div className="w-80 h-80 mx-auto">
          <DotLottieReact
            src="/404.lottie"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <p className="text-2xl md:text-3xl font-light" style={{ marginBottom: '40px' }}>
          {"Oops! The page you're looking for doesn't exist."}
        </p>
        <Link href={"/"} style={{ marginTop: '20px' }}>
          <button
            className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-[#1171ee] transition ease-in-out duration-300"
          >
            <FiHome className="mr-2 text-2xl" />
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}

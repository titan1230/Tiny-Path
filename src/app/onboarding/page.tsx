"use client";

import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from '@/lib/LoginUtils';

const OnboardingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 relative">
      
      <Link href="/" className="absolute top-4 left-4">
        <FiArrowLeft className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer" />
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-8 md:w-1/3 w-full mx-4 flex flex-col items-center">
        
        <div className="mb-8">
          <Image src="/TinyPath.png" alt="Logo" width={80} height={80} className="mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-700 mt-4 text-center">Welcome Back!</h1>
        <p className="text-gray-500 text-center">Sign in to continue to TinyPath</p>

        <button
          type='button'
          className="bg-green-500 text-white py-3 px-4 w-full rounded-lg flex items-center justify-center gap-3 hover:bg-green-600 transition ease-in-out mt-8"
          onClick={async () => await signIn()}
        >
          <FcGoogle className="text-2xl" />
          <span className="font-semibold">Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;

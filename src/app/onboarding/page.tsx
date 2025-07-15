"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import React, { Suspense, useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";

import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";

import { signIn } from "@/lib/LoginUtils";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 16 },
  },
};

const buttonVariants = {
  hover: { scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0,255,200,0.18)" },
  tap: { scale: 0.98 },
};

const textVariants = {
  initial: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
};

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
        className="animate-spin h-6 w-6 text-white"
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

const OnboardingContent: React.FC = () => {
  const searchParams = useSearchParams();
  const to = searchParams.get("to");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn(to || "/dashboard");
  };

  return (
    <motion.div
      className="
        bg-white/20 shadow-2xl rounded-2xl px-6 py-10 w-full max-w-md mx-4
        flex flex-col items-center backdrop-blur-2xl border border-white/30
        ring-1 ring-white/10
      "
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-white/40 p-2 shadow-lg ring-2 ring-cyan-300/40">
          <Image
            src="/TinyPath.png"
            alt="TinyPath Logo"
            width={72}
            height={72}
            className="mx-auto drop-shadow-lg"
            priority
          />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2 text-center drop-shadow-sm">
        Welcome Back!
      </h1>
      <p className="text-gray-600 text-center mt-2 mb-6 text-base md:text-lg">
        Sign in to continue to <span className="font-semibold text-cyan-600">TinyPath</span>
      </p>

      <motion.button
        type="button"
        className={`
          bg-gradient-to-r from-cyan-500 to-green-400 text-white py-3 px-4 w-full
          rounded-xl flex items-center justify-center gap-3 font-semibold text-lg
          shadow-lg mt-8 focus:outline-none focus:ring-2 focus:ring-cyan-400
          focus:ring-offset-2 relative h-14
        `}
        variants={buttonVariants}
        whileHover={!loading ? "hover" : undefined}
        whileTap={!loading ? "tap" : undefined}
        onClick={handleSignIn}
        aria-label="Login with Google"
        disabled={loading}
        style={{ minHeight: "3.5rem" }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!loading ? (
            <motion.div
              className="flex items-center gap-3"
              key="text"
              variants={textVariants}
              initial="initial"
              animate="initial"
              exit="exit"
            >
              <FcGoogle className="text-2xl" />
              <span>Login with Google</span>
            </motion.div>
          ) : (
            <Spinner key="spinner" />
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

const OnboardingPage: React.FC = () => {
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

      <Link
        href="/"
        className="
          absolute top-4 left-4 bg-white/60 rounded-full p-2 shadow
          hover:bg-white/80 transition focus:outline-none focus:ring-2
          focus:ring-cyan-400
        "
        aria-label="Back to home"
      >
        <FiArrowLeft className="text-2xl text-gray-700" />
      </Link>

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
};

export default OnboardingPage;

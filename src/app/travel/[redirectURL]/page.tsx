"use client";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiExternalLink, FiAlertTriangle } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

interface PageParams {
  redirectURL: string;
}

type Params = Promise<PageParams>;

export default function Redirect({ params }: { params: Params }) {
  const [redirectURL, setRedirectURL] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [travelError, setTravelError] = useState<boolean>(false);
  const [travelErrorMessage, setTravelErrorMessage] = useState<string>("");
  const [destinationInfo, setDestinationInfo] = useState<{
    title: string;
    domain: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setRedirectURL(resolvedParams.redirectURL);
    });
  }, [params]);

  useEffect(() => {
    if (!redirectURL) return;

    const fetchDestinationData = async () => {
      setIsLoading(true);
      try {
        const userAgent = getUserAgent();
        const { browser, device } = userAgent;

        const ip = await getClientIp();
        const referrer = document.referrer || "direct";

        const response = await fetch(
          `/api/match-url?slug=${redirectURL}&ip=${ip}&source=${referrer}&browser=${browser}&device=${device}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.url) {
          try {
            const urlObj = new URL(data.url);
            setDestinationInfo({
              title: data.title || "Your destination",
              domain: urlObj.hostname,
              url: data.url
            });
          } catch (e) {
            console.error("Error parsing URL:", e);
          }
        } else if (data.error) {
          setTravelError(true);
          setTravelErrorMessage(data.error);
        } else {
          throw new Error("Invalid redirection URL received from API");
        }
      } catch (error) {
        console.error("Error during redirection:", error);
        setTravelError(true);
        setTravelErrorMessage("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationData();
  }, [redirectURL]);

  // Handle countdown and redirect separately
  useEffect(() => {
    if (isLoading || travelError || !destinationInfo) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownInterval);
          window.location.assign(destinationInfo.url);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isLoading, travelError, destinationInfo]);

  const getClientIp = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "unknown";
    } catch (error) {
      console.error("Error getting IP:", error);
      return "unknown";
    }
  };

  const getUserAgent = () => {
    const userAgent = window.navigator.userAgent;

    let browser = "Unknown Browser";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR"))
      browser = "Opera";
    else if (userAgent.includes("Trident")) browser = "Internet Explorer";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";

    let device = "Unknown Device";
    if (userAgent.includes("iPhone")) device = "iPhone";
    else if (userAgent.includes("iPad")) device = "iPad";
    else if (userAgent.includes("Android")) device = "Android";
    else if (userAgent.includes("Windows")) device = "Windows";
    else if (userAgent.includes("Macintosh")) device = "Mac";

    return { browser, device };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a2540] to-[#106b7c] flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading your destination...</p>
          </div>
        ) : travelError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <FiAlertTriangle className="text-red-500 text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {travelErrorMessage || "Link Not Found"}
            </h1>
            <p className="text-gray-600 text-center mb-6">
              The URL you requested could not be found or it may have expired.
            </p>
            <div className="flex justify-center">
              <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Home
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-blue-600 stroke-current"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (5 - countdown)) / 5}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {countdown}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              You are being redirected
            </h1>

            {destinationInfo && (
              <div className="mt-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Destination:</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 bg-gray-200 rounded overflow-hidden">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${destinationInfo.domain}&sz=64`}
                      alt="Site favicon"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-medium text-gray-800 truncate">
                      {destinationInfo.title}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {destinationInfo.domain}
                    </p>
                  </div>
                  <FiExternalLink className="text-gray-400 ml-2" />
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure redirect in progress</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Powered by <span className="font-semibold underline"><Link href='/' target="_blank">TinyPath</Link></span>
            </div>
            <div className="flex space-x-2">
              <a
                href="/terms"
                className="text-xs text-blue-600 hover:underline"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-xs text-blue-600 hover:underline"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

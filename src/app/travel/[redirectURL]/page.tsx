"use client";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { useEffect, useState } from "react";
import { Adsense as AdSense } from '@ctrl/react-adsense';
import Script from "next/script";

interface PageParams {
  redirectURL: string;
}

type Params = Promise<PageParams>;

export default function Redirect({ params }: { params: Params }) {
  const [redirectURL, setRedirectURL] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    params.then((resolvedParams) => {
      setRedirectURL(resolvedParams.redirectURL);
    });
  }, [params]);

  useEffect(() => {
    if (!redirectURL) return;

    const fetchData = async () => {
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
          // Uncomment to enable redirection:
          // window.location.assign(data.url);
        } else {
          throw new Error("Invalid redirection URL received from API");
        }
      } catch (error) {
        console.error("Error during redirection:", error);
      }
    };

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          fetchData();
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [redirectURL]);

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
    <div className="h-screen bg-gradient-to-b to-[#5fd9ca] from-[#000025] flex justify-center items-center flex-col relative">
      {/* Main Content */}
      <span className="text-2xl font-bold text-center block loading-spinner loading" />
      <p className="text-white text-center mt-4 text-4xl">
        Redirecting in {countdown}...
      </p>

      {/* Vertical Ads for Larger Screens */}
      <div className="hidden lg:flex absolute top-0 left-0 h-full w-[160px] justify-center items-center">
        <AdSense
          client="ca-pub-6673007622499235"
          slot="8748244823"
          style={{ display: 'block', width: '160px', height: '600px' }}
          format="auto"
        />
      </div>
      <div className="hidden lg:flex absolute top-0 right-0 h-full w-[160px] justify-center items-center">
        <AdSense
          client="ca-pub-6673007622499235"
          slot="8748244823"
          style={{ display: 'block', width: '160px', height: '600px' }}
          format="auto"
        />
      </div>

      {/* Horizontal Ad for Smaller Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full text-center py-2">
        <AdSense
          client="ca-pub-6673007622499235"
          slot="4457646027"
          style={{ display: 'block', width: '100%', height: '90px' }}
          format="auto"
        />
      </div>

      {/* Ensure Script loads after DOM */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        onLoad={() => {
          if (window.adsbygoogle && window.adsbygoogle.length === 0) {
            window.adsbygoogle.push({});
          }
        }}
      />
    </div>
  );
}

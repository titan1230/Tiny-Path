"use client";

import { useEffect, useState } from "react";

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
          window.location.assign(data.url);
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
    <div className="h-screen bg-gradient-to-b to-[#5fd9ca] from-[#000025] flex justify-center items-center flex-col">
      <span className="text-2xl font-bold text-center block loading-spinner loading" />
      <p className="text-white text-center mt-4 text-4xl">
        Redirecting in {countdown}...
      </p>
    </div>
  );
}

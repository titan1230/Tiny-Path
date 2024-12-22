"use client";

import { use, useEffect } from "react";

interface PageParams {
  redirectURL: string;
}

type Params = Promise<PageParams>;

export default function Redirect( props: {params : Params}) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAgent = getUserAgent();
        const { browser, device } = userAgent;

        const ip = await getClientIp();
        const slug = use(props.params).redirectURL;
        const referrer = document.referrer || "direct";

        const response = await fetch(
          `/api/match-url?slug=${slug}&ip=${ip}&source=${referrer}&browser=${browser}&device=${device}`
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
        // Fallback redirection to home
        window.location.assign("/");
      }
    };

    fetchData();
  }, [props.params]);

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

    // Detecting browser
    let browser = "Unknown Browser";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR"))
      browser = "Opera";
    else if (userAgent.includes("Trident")) browser = "Internet Explorer";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";

    // Detecting device
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
      <p className="text-white text-center mt-4 text-4xl">Redirecting</p>
    </div>
  );
}

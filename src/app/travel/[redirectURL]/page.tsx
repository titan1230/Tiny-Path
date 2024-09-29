"use client";
import { useEffect, useState } from "react";

export default function Redirect({ params }: { params: { redirectURL: string } }) {
  
  useEffect(() => {
    const userAgent = getUserAgent();
    const { browser, device } = userAgent;
    const getClientIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();

        return data.ip;
      } catch (error) {
        console.error("Error getting IP:", error);
        return "unknown";
      }
    };

    const fetchData = async () => {
      const ip = await getClientIp();
      const slug = params.redirectURL;
      const referrer = document.referrer;

      fetch(`/api/match-url?slug=${slug}&ip=${ip}&source=${referrer}&browser=${browser}&device=${device}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          window.location.assign(data.url);
        })
        .catch((error) => {
          console.error("Error:", error);
          // window.location.assign("/");
        });
    };

    fetchData();
  }, [params.redirectURL]);

  function getUserAgent() {
    var userAgent = window.navigator.userAgent;

    var browser = "Unknown Browser";
    switch (true) {
      case userAgent.includes("Firefox"):
        browser = "Firefox";
        break;
      case userAgent.includes("SamsungBrowser"):
        browser = "Samsung Browser";
        break;
      case userAgent.includes("Opera") || userAgent.includes("OPR"):
        browser = "Opera";
        break;
      case userAgent.includes("Trident"):
        browser = "Internet Explorer";
        break;
      case userAgent.includes("Edge"):
        browser = "Edge";
        break;
      case userAgent.includes("Chrome"):
        browser = "Chrome";
        break;
      case userAgent.includes("Safari"):
        browser = "Safari";
        break;
      default:
        browser = "Other";
        break;
    }

    // Detecting device
    var device = "Unknown Device";
    switch (true) {
      case userAgent.includes("iPhone"):
        device = "iPhone";
        break;
      case userAgent.includes("iPad"):
        device = "iPad";
        break;
      case userAgent.includes("Linux"):
        device = "Linux";
        break;
      case userAgent.includes("Android"):
        device = "Android";
        break;
      case userAgent.includes("Windows"):
        device = "Windows";
        break;
      case userAgent.includes("Macintosh"):
        device = "Mac";
        break;
      default:
        device = "Other";
        break;
    }

    return { browser: browser, device: device };
  }
  return (
    <div className="h-screen bg-gradient-to-b to-[#5fd9ca] from-[#000025] flex justify-center items-center flex-col">
      <span className="text-2xl font-bold text-center block loading-spinner loading" />
      <p className="text-white text-center mt-4 text-4xl">Redirecting</p>
    </div>
  )
}
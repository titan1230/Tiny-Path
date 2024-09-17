"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { FiLink, FiEdit, FiBarChart2, FiLock } from 'react-icons/fi';
import Link from "next/link";
import PricingCard from "@/components/PricingCard";

const LandingPage: React.FC = () => {

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
      setIsMobileNavOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileNavOpen]);

  return (
    <div className="bg-base-100 text-white">
      {/* Header */}
      <div className="drawer">
        {/* Toggle drawer for mobile */}
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isMobileNavOpen}
          onChange={toggleMobileNav}
        />

        {/* Header */}
        <header className="bg-neutral text-white py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 w-full z-50 shadow-lg">
          <div className="flex items-center">
            <Image src="/TinyPath.png" alt="TinyPath Logo" height={40} width={40} priority />

            {/* Desktop Navigation */}
            <nav className="ml-8 hidden md:flex space-x-6">
              <Link href="#home" className="text-lg font-medium hover:text-primary transition">Home</Link>
              <Link href="#features" className="text-lg font-medium hover:text-primary transition">Features</Link>
              <Link href="#pricing" className="text-lg font-medium hover:text-primary transition">Pricing</Link>
              <Link href="#about" className="text-lg font-medium hover:text-primary transition">About Us</Link>
            </nav>
          </div>

          {/* Get Started Button for Desktop */}
          <Link href="/dashboard" className="hidden md:block">
            <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-[#1171ee] ease-in-out transition-all shadow-md">
              Get Started
            </button>
          </Link>

          {/* Hamburger Menu for Mobile */}
          <label htmlFor="my-drawer" className="md:hidden text-2xl cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </label>
        </header>

        {/* Mobile Navigation Drawer */}
        <div className="drawer-content">
          <div className={`fixed inset-0 z-40 transition-transform transform ${isMobileNavOpen ? "translate-x-0" : "translate-x-full"} md:hidden`} ref={drawerRef}>
            <div className="bg-neutral p-6 w-64 h-full">
              <nav className="space-y-6">
                <Link href="#home" className="text-xl font-medium block hover:text-primary transition" onClick={toggleMobileNav}>Home</Link>
                <Link href="#features" className="text-xl font-medium block hover:text-primary transition" onClick={toggleMobileNav}>Features</Link>
                <Link href="#pricing" className="text-xl font-medium block hover:text-primary transition" onClick={toggleMobileNav}>Pricing</Link>
                <Link href="#about" className="text-xl font-medium block hover:text-primary transition" onClick={toggleMobileNav}>About Us</Link>
              </nav>

              {/* Get Started Button for Mobile */}
              <Link href="/dashboard">
                <button className="mt-6 bg-primary text-white py-2 px-6 w-full rounded-lg hover:bg-[#1171ee] ease-in-out transition-all shadow-md">
                  Get Started
                </button>
              </Link>
            </div>w
          </div>
        </div>
      </div>


      {/* Hero Section */}
      <section id="home" className="hero text-white py-32 flex flex-col items-center text-center min-h-screen justify-center relative">
        <div className="absolute inset-0">
          <Image
            src="/HeroBackground.png"
            alt="Hero Background"
            fill
            quality={100}
            className="z-0 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-0"></div>
        </div>

        <div className="z-10">
          <h1 className="text-6xl font-extrabold mb-6">Shorten, Share, and Track Your Links with Ease</h1>
          <p className="text-xl mb-8">TinyPath makes URL shortening simple and effective for everyone.</p>
          <Link href="/dashboard">
            <button className="bg-primary text-white py-4 px-8 rounded-full hover:bg-[#1171ee] ease-in-out transition-all shadow-lg">
              Shorten Your First Link Now
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features bg-base-200 text-white py-32 px-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose TinyPath?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="feature-item flex flex-col items-center p-6 bg-neutral rounded-lg shadow-lg transition-transform hover:scale-105">
              <FiLink className="text-primary text-6xl mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Easy URL Shortening</h3>
              <p>Shorten any URL in seconds with our user-friendly interface.</p>
            </div>
            <div className="feature-item flex flex-col items-center p-6 bg-neutral rounded-lg shadow-lg transition-transform hover:scale-105">
              <FiEdit className="text-primary text-6xl mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Customizable Links</h3>
              <p>Create branded and customizable short links to enhance your brand identity.</p>
            </div>
            <div className="feature-item flex flex-col items-center p-6 bg-neutral rounded-lg shadow-lg transition-transform hover:scale-105">
              <FiBarChart2 className="text-primary text-6xl mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard</h3>
              <p>Track link performance with real-time analytics and insights.</p>
            </div>
            <div className="feature-item flex flex-col items-center p-6 bg-neutral rounded-lg shadow-lg transition-transform hover:scale-105">
              <FiLock className="text-primary text-6xl mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Secure and Reliable</h3>
              <p>Enjoy secure and reliable service with top-notch privacy features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingCard />

      {/* About Us Section */}
      <section id="about" className="about bg-base-200 text-white py-32">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">About TinyPath</h2>
          <p className="mb-8 text-xl">TinyPath is committed to providing the best URL shortening service to help you streamline your online presence and enhance your marketing efforts.</p>
          <p className="mb-8 text-xl">Our mission is to make sharing and tracking links easier, faster, and more efficient for everyone.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-white py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2024 TinyPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

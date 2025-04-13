"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Link from "next/link";

import { FiLink, FiEdit, FiBarChart2, FiLock } from 'react-icons/fi';
import { FaDollarSign, FaHouseChimney } from "react-icons/fa6";

import PricingCard from "@/components/PricingCard";
import isValidUrl from "@/lib/utils/urlChecker";

const LandingPage: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [longUrl, setLongUrl] = useState<string>("");
  const [isValid, setIsValid] = useState(true);

  const handleShortenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    setIsValid(longUrl !== "" && isValidUrl(longUrl));
  }

  return (
    <div className="bg-base-100 text-white">

      <div className="drawer">
        <input
          id="LandingDrawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
        <div className="drawer-content flex flex-col">

          {/* Navbar */}
          <div className="navbar bg-base-300 w-full fixed z-50">
            <div className="flex-none lg:hidden">
              <label htmlFor="LandingDrawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <div className="flex items-center">
                <Image src="/TinyPath.png" alt="TinyPath Logo" height={40} width={40} priority />

                {/* Desktop Navigation */}
                <nav className="ml-8 hidden md:flex space-x-6">
                  <Link href="#home" className="text-lg font-medium hover:text-primary transition">Home</Link>
                  <Link href="#features" className="text-lg font-medium hover:text-primary transition">Features</Link>
                  <Link href="#pricing" className="text-lg font-medium hover:text-primary transition">Pricing</Link>
                </nav>
              </div>
            </div>

            <div className="navbar-end">
              <Link href="/dashboard" className="hidden md:block">
                <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-[#1171ee] ease-in-out transition-all shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Section */}
          <section id="home" className="hero text-white py-32 flex flex-col items-center text-center min-h-screen justify-center relative">
            <div className="absolute inset-0 overflow-hidden">
              <main>
                <video
                  src="https://xzy5oofpng.ufs.sh/f/HHzxRMaeyzLrKOLnam11Toy7bkZdXSeMfvJViwj6rcmPnqYp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full z-0 object-cover object-center"
                  aria-hidden="true"
                  role="presentation"
                >
                  Your browser does not support the video tag.
                </video>
              </main>
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/30 z-0"></div>
            </div>

            {/* Hero Content */}
            <div className="z-10">
              <h1 className="text-6xl font-extrabold mb-6">Shorten, Share, and Track Your Links with Ease</h1>
              <p className="text-xl mb-8 px-1">TinyPath makes URL shortening simple and effective for everyone.</p>

              {/* Joined Input + Button */}
              <div className="join w-full justify-center mb-2">
                <input
                  type="text"
                  placeholder="Paste your long URL here"
                  autoComplete="off"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="input input-bordered join-item w-full sm:w-[400px] bg-white text-black rounded-l-full"
                />
                <button
                  className="btn btn-primary join-item rounded-r-full px-6"
                  onClick={handleShortenClick}
                >
                  Shorten
                </button>
              </div>

              {longUrl !== "" && !isValid && (
                <p className="text-red-400 text-sm">Please enter a valid URL.</p>
              )}

              <Link href="/dashboard">
                <button className="mt-4 bg-primary text-white py-4 px-8 rounded-full hover:bg-[#1171ee] ease-in-out transition-all shadow-lg">
                  Shorten Your First Link Now
                </button>
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="features bg-gradient-to-b to-[#5fd9ca] from-[#000025] text-white py-32 px-10">
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

          {/* Footer */}
          <footer className="bg-neutral py-5">
            <div className="container text-lef text-lg pl-5">
              {`Made by `}
              <a href="https://github.com/titan1230" target="_blank" rel="noopener noreferrer" className="text-info">
                Titan
              </a>
              {` • `}
              <a href="https://github.com/titan1230/tiny-path" target="_blank" rel="noopener noreferrer" className="text-info">
                Github
              </a>
            </div>
          </footer>
        </div>

        {/* Mobile Drawer */}
        <div className="drawer-side z-50">
          <label htmlFor="LandingDrawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            <li>
              <Link href="#home" onClick={() => { setIsOpen(false) }} className="text-xl font-medium hover:text-primary transition mb-2">
                <FaHouseChimney className="text-primary text-2xl mr-2 inline" />
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" onClick={() => { setIsOpen(false) }} className="text-xl font-medium hover:text-primary transition mb-2">
                <FiLink className="text-primary text-2xl mr-2 inline" />
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" onClick={() => { setIsOpen(false) }} className="text-xl font-medium hover:text-primary transition">
                <FaDollarSign className="text-primary text-2xl mr-2 inline" />
                Pricing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";

import { 
  FiLink, 
  FiEdit, 
  FiBarChart2, 
  FiLock, 
  FiArrowRight, 
  FiMenu, 
  FiX
} from 'react-icons/fi';
import { FaDollarSign, FaHouseChimney } from "react-icons/fa6";

import isValidUrl from '@/lib/utils/urlChecker';
import PricingCard from "@/components/PricingCard";

const LandingPageMain: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [longUrl, setLongUrl] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShortenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const v = longUrl !== "" && isValidUrl(longUrl);
    setIsValid(v);

    if (!v) return;

    (document.getElementById("new_link_modal") as HTMLDialogElement)?.showModal();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-base-100 text-white overflow-x-hidden">
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
          <div className={`navbar fixed z-50 transition-all duration-300 ${
            isScrolled ? "bg-base-300/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
          }`}>
            <div className="flex-none lg:hidden">
              <label htmlFor="LandingDrawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                {isOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <div className="flex items-center">
                <div className="relative h-10 w-10">
                  <Image 
                    src="/TinyPath.png" 
                    alt="TinyPath Logo" 
                    fill 
                    className="object-contain"
                    priority 
                  />
                </div>
                <span className="ml-2 text-xl font-bold">TinyPath</span>

                {/* Desktop Navigation */}
                <nav className="ml-8 hidden md:flex space-x-6">
                  <Link href="#home" className="text-lg font-medium hover:text-primary transition-colors duration-300">Home</Link>
                  <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors duration-300">Features</Link>
                  <Link href="#pricing" className="text-lg font-medium hover:text-primary transition-colors duration-300">Pricing</Link>
                </nav>
              </div>
            </div>

            <div className="navbar-end">
              <Link href="/dashboard" className="hidden md:block">
                <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-[#1171ee] ease-in-out transition-all duration-300 shadow-md">
                  {session ? 'Dashboard' : 'Get Started'}
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Section */}
          <section id="home" className="hero text-white py-32 flex flex-col items-center text-center min-h-screen justify-center relative">
            <div className="absolute inset-0 overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 z-0"></div>
            </div>

            {/* Hero Content */}
            <motion.div 
              className="z-10 max-w-4xl px-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
                variants={fadeInUp}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#5fd9ca]">
                  Shorten, Share, and Track
                </span> 
                <br />Your Links with Ease
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-8 px-1 text-gray-200"
                variants={fadeInUp}
              >
                TinyPath makes URL shortening simple and effective for everyone.
              </motion.p>

              {/* Joined Input + Button */}
              <motion.div 
                className="join w-full justify-center mb-2"
                variants={fadeInUp}
              >
                <input
                  type="text"
                  placeholder="Paste your long URL here"
                  autoComplete="off"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="input input-bordered join-item w-full sm:w-[400px] bg-white/90 text-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="btn btn-primary join-item rounded-r-full px-6 hover:bg-[#1171ee] transition-colors duration-300"
                  onClick={handleShortenClick}
                >
                  Shorten
                </button>
              </motion.div>

              <AnimatePresence>
                {longUrl !== "" && !isValid && (
                  <motion.p 
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Please enter a valid URL.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiArrowRight className="rotate-90 text-white/70 text-2xl" />
            </motion.div>
          </section>

          {/* Features Section */}
          <section id="features" className="features scroll-mt-[4rem] bg-gradient-to-b to-[#5fd9ca]/90 from-[#000025] text-white py-32 px-6 md:px-10">
            <motion.div 
              className="container mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-4xl font-bold mb-4"
                variants={fadeInUp}
              >
                Why Choose TinyPath?
              </motion.h2>
              
              <motion.p 
                className="text-xl mb-12 max-w-2xl mx-auto text-gray-200"
                variants={fadeInUp}
              >
                Our platform offers everything you need to manage, track, and optimize your links.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
              >
                <motion.div 
                  className="feature-item flex flex-col items-center p-6 bg-neutral/80 backdrop-blur-sm rounded-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
                  variants={fadeInUp}
                >
                  <div className="bg-primary/20 p-4 rounded-full mb-6">
                    <FiLink className="text-primary text-4xl" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Easy URL Shortening</h3>
                  <p className="text-gray-300">Shorten any URL in seconds with our user-friendly interface.</p>
                </motion.div>
                
                <motion.div 
                  className="feature-item flex flex-col items-center p-6 bg-neutral/80 backdrop-blur-sm rounded-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
                  variants={fadeInUp}
                >
                  <div className="bg-primary/20 p-4 rounded-full mb-6">
                    <FiEdit className="text-primary text-4xl" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Customizable Links</h3>
                  <p className="text-gray-300">Create branded and customizable short links to enhance your brand identity.</p>
                </motion.div>
                
                <motion.div 
                  className="feature-item flex flex-col items-center p-6 bg-neutral/80 backdrop-blur-sm rounded-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
                  variants={fadeInUp}
                >
                  <div className="bg-primary/20 p-4 rounded-full mb-6">
                    <FiBarChart2 className="text-primary text-4xl" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard</h3>
                  <p className="text-gray-300">Track link performance with real-time analytics and insights.</p>
                </motion.div>
                
                <motion.div 
                  className="feature-item flex flex-col items-center p-6 bg-neutral/80 backdrop-blur-sm rounded-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
                  variants={fadeInUp}
                >
                  <div className="bg-primary/20 p-4 rounded-full mb-6">
                    <FiLock className="text-primary text-4xl" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Secure and Reliable</h3>
                  <p className="text-gray-300">Enjoy secure and reliable service with top-notch privacy features.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* Pricing Section */}
          <PricingCard />

          {/* Footer */}
          <footer className="bg-neutral py-8">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="relative h-8 w-8 mr-2">
                    <Image 
                      src="/TinyPath.png" 
                      alt="TinyPath Logo" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold">TinyPath</span>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-gray-400">
                    Made by{" "}
                    <a 
                      href="https://github.com/titan1230" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-info hover:text-info/80 transition-colors"
                    >
                      Titan
                    </a>
                    {" • "}
                    <a 
                      href="https://github.com/titan1230/tiny-path" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-info hover:text-info/80 transition-colors"
                    >
                      Github
                    </a>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">© {new Date().getFullYear()} TinyPath. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Mobile Drawer */}
        <div className="drawer-side z-50">
          <label htmlFor="LandingDrawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu bg-base-200/95 backdrop-blur-sm min-h-full w-80 p-4">
            <div className="flex items-center mb-8 px-4">
              <div className="relative h-8 w-8 mr-2">
                <Image 
                  src="/TinyPath.png" 
                  alt="TinyPath Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">TinyPath</span>
            </div>
            
            <ul>
              <li className="mb-2">
                <Link 
                  href="#home" 
                  onClick={() => { setIsOpen(false) }} 
                  className="flex items-center p-3 text-lg font-medium hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <FaHouseChimney className="text-primary text-xl mr-3" />
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="#features" 
                  onClick={() => { setIsOpen(false) }} 
                  className="flex items-center p-3 text-lg font-medium hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <FiLink className="text-primary text-xl mr-3" />
                  Features
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="#pricing" 
                  onClick={() => { setIsOpen(false) }} 
                  className="flex items-center p-3 text-lg font-medium hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <FaDollarSign className="text-primary text-xl mr-3" />
                  Pricing
                </Link>
              </li>
            </ul>
            
            <div className="mt-8 px-4">
              <Link href="/dashboard" className="w-full">
                <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-[#1171ee] transition-colors duration-300">
                  {session ? 'Go to Dashboard' : 'Get Started'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageMain;

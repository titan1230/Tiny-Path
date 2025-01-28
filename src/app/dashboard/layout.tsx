"use client";

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineAreaChart 
} from 'react-icons/ai';
import { BiWorld } from "react-icons/bi";
import { MdLink } from "react-icons/md";
import { usePathname } from 'next/navigation'

import Image from 'next/image';

export default function Layout({ children }: { children: ReactNode }) {

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const p = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 text-white w-64 space-y-6 px-2 py-7 absolute inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >

        {/* Navigation Links with Icons */}
        <nav className="space-y-4 text-xl">
          <Link href="/dashboard" onClick={toggleSidebar} 
            className={"flex items-center py-2 px-4 rounded hover:bg-gray-600" + (p === '/dashboard' ? ' bg-gray-600' : '')}
          >
            <AiOutlineHome className="mr-2" /> Home
          </Link>
          <Link href="/dashboard/analytics" onClick={toggleSidebar} 
            className={"flex items-center py-2 px-4 rounded hover:bg-gray-600" + (p === '/dashboard/analytics' ? ' bg-gray-600' : '')}
          >
            <AiOutlineAreaChart className="mr-2" /> Analytics
          </Link>
          <Link href="/dashboard/geography" onClick={toggleSidebar} 
            className={"flex items-center py-2 px-4 rounded hover:bg-gray-600" + (p === '/dashboard/geography' ? ' bg-gray-600' : '')}
          >
            <BiWorld className="mr-2" /> Geography
          </Link>
          <Link href="/dashboard/links" onClick={toggleSidebar} 
            className={"flex items-center py-2 px-4 rounded hover:bg-gray-600" + (p === '/dashboard/links' ? ' bg-gray-600' : '')}
          >
            <MdLink className="mr-2" /> Links
          </Link>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {isOpen ? (
              <AiOutlineClose className="w-6 h-6" />
            ) : (
              <AiOutlineMenu className="w-6 h-6" />
            )}
          </button>
          <Image src="/TinyPath.png" className='items-center mx-4' alt="MyApp Logo" height={40} width={40} priority />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#9db4c0]">{children}</main>
      </div>
    </div>
  );
}

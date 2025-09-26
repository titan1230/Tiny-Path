'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Link as LinkIcon,
  Globe2Icon,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Network
} from 'lucide-react';
import { signOut } from '@/lib/LoginUtils';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links: SidebarLink[] = [
    { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Tree', href: '/dashboard/links', icon: <Network size={20} /> },
    { name: 'Geography', href: '/dashboard/geography', icon: <Globe2Icon size={20} /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);

    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-30">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <div className="ml-4 font-semibold">Tiny Path</div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col z-50 ${collapsed ? 'w-16' : 'w-64'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && <span className="font-semibold">Tiny Path</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === link.href
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!collapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button (at bottom) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            className="flex items-center w-full px-1 py-1 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={signOut}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all bg-[#2C3642] duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-64'
          } pt-16 md:pt-0`}
      >
        {children}
      </main>
    </>
  );
}

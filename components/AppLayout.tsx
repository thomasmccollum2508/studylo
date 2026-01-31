'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useEffect, useState } from 'react';

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    setCollapsed(stored === 'true');
  }, [mounted]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    }
  };

  function navLink(href: string, label: string, icon: React.ReactNode, active?: boolean) {
    const isActive = active ?? (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)));
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg font-medium transition-colors ${
          isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left column: hamburger + sidebar */}
      <div
        className={`flex flex-col shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out ${
          collapsed ? 'w-14' : 'w-64'
        }`}
      >
        <div className="flex items-center shrink-0 w-full pt-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center justify-center w-14 h-14 shrink-0 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={collapsed ? 'Show sidebar' : 'Hide sidebar'}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {!collapsed && (
            <div className="flex-1 min-w-0 pr-3">
              <Link href="/" className="flex items-center">
                <img
                  src={theme === 'dark' ? '/studylo%20logo%20dark.png' : '/studylo%20logo%202.png'}
                  alt="StudyLo Logo"
                  className="h-12 w-auto transition-opacity duration-300"
                />
              </Link>
            </div>
          )}
        </div>
        {!collapsed && (
          <>
            <nav className="flex-1 px-3 pt-5 overflow-y-auto">
              {navLink(
                '/dashboard',
                'Dashboard',
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
              {navLink(
                '/my-study-sets',
                'My Study Sets',
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {navLink(
                '/flashcards',
                'Flashcards',
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {navLink(
                '/quizzes',
                'Quizzes',
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="13" r="0.5" fill="currentColor" />
                </svg>
              )}
              {navLink(
                '/ai-chat',
                'AI Chat',
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 9.5C17 13.09 13.64 16 9.5 16C8.22 16 7.02 15.63 6 15L2 16L3.5 12.5C2.37 11.48 1.5 10.08 1.5 8.5C1.5 4.91 4.86 2 9 2C13.14 2 17 4.91 17 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </nav>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  pathname === '/settings' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 10C16 10 15 12 10 12C5 12 4 10 4 10C4 10 5 8 10 8C15 8 16 10 16 10Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Settings
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}

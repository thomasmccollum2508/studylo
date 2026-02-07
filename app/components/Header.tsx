'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function Header() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between max-w-7xl mx-auto relative">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
          <img 
            src={pathname === '/' ? '/studylo%20logo%202.png' : theme === 'dark' ? '/studylo%20logo%20dark.png' : '/studylo%20logo%202.png'} 
            alt="StudyLo Logo" 
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 translate-y-[0.5px]">
          <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 text-[16px] font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Home
          </Link>
          <Link href="/library" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 text-[16px] font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Library
          </Link>
          
          {/* Resources Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 text-[16px] font-semibold flex items-center gap-1 transition-all duration-300 hover:-translate-y-0.5">
              Resources
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fadeIn">
                <Link href="/resources/blog" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Blog
                </Link>
                <Link href="/resources/study-tips" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Study Tips
                </Link>
                <Link href="/resources/help-center" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Help Center
                </Link>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 text-[16px] font-semibold flex items-center gap-1 transition-all duration-300 hover:-translate-y-0.5">
              Solutions
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fadeIn">
                <Link href="/solutions/for-students" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  For Students
                </Link>
                <Link href="/solutions/for-teachers" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  For Teachers
                </Link>
                <Link href="/solutions/for-schools" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  For Schools
                </Link>
                <Link href="/solutions/enterprise" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Enterprise
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile: Auth + Hamburger (hamburger on the right) */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {user ? (
            <>
              <button
                onClick={signOut}
                className="hidden md:inline-block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign out
              </button>
              <Link href="/dashboard">
                <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-[15px] text-xs md:text-[15px] font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:scale-105">
                  Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-block">
                <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 px-4 py-2 text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5">
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-[15px] text-xs md:text-[15px] font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </>
          )}

          {/* Hamburger - mobile only */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown panel */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
            <nav className="px-4 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
              <Link href="/" className="px-3 py-2.5 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/library" className="px-3 py-2.5 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Library
              </Link>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileResourcesOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Resources
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`}>
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {mobileResourcesOpen && (
                  <div className="pl-4 pb-2 flex flex-col gap-0.5">
                    <Link href="/resources/blog" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    <Link href="/resources/study-tips" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Study Tips</Link>
                    <Link href="/resources/help-center" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Help Center</Link>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileSolutionsOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Solutions
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`}>
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {mobileSolutionsOpen && (
                  <div className="pl-4 pb-2 flex flex-col gap-0.5">
                    <Link href="/solutions/for-students" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>For Students</Link>
                    <Link href="/solutions/for-teachers" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>For Teachers</Link>
                    <Link href="/solutions/for-schools" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>For Schools</Link>
                    <Link href="/solutions/enterprise" className="px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Enterprise</Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

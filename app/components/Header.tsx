'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="w-full px-8 py-3 flex items-center justify-between max-w-7xl mx-auto relative">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
          <img 
            src="/studylo%20logo%202.png" 
            alt="StudyLo Logo" 
            className="h-12 w-auto"
          />
        </Link>

        {/* Navigation - centered */}
        <nav className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 translate-y-[0.5px]">
          <Link href="/" className="text-gray-800 hover:text-gray-600 text-[16px] font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Home
          </Link>
          <Link href="/library" className="text-gray-800 hover:text-gray-600 text-[16px] font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Library
          </Link>
          
          {/* Resources Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="text-gray-800 hover:text-gray-600 text-[16px] font-semibold flex items-center gap-1 transition-all duration-300 hover:-translate-y-0.5">
              Resources
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fadeIn">
                <Link href="/resources/blog" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  Blog
                </Link>
                <Link href="/resources/study-tips" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  Study Tips
                </Link>
                <Link href="/resources/help-center" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
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
            <button className="text-gray-800 hover:text-gray-600 text-[16px] font-semibold flex items-center gap-1 transition-all duration-300 hover:-translate-y-0.5">
              Solutions
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fadeIn">
                <Link href="/solutions/for-students" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  For Students
                </Link>
                <Link href="/solutions/for-teachers" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  For Teachers
                </Link>
                <Link href="/solutions/for-schools" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  For Schools
                </Link>
                <Link href="/solutions/enterprise" className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-sm font-medium transition-colors">
                  Enterprise
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right side: Login and Get Started buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Login Button */}
          <button className="text-gray-800 hover:text-gray-600 px-4 py-2 text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5">
            Log In
          </button>

          {/* Get Started Button */}
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-[15px] text-[15px] font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

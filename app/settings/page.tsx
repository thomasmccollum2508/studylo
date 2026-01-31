'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';
import AppLayout from '@/components/AppLayout';

export default function Settings() {
  const { theme } = useTheme();
  return (
    <AppLayout>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search study sets, flashcards, quizzes..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3C10 3 8 3 8 5C8 6 8 10 6 10C4 10 4 8 4 8V12C4 12 4 10 6 10C8 10 8 14 8 15C8 17 10 17 10 17C10 17 12 17 12 15C12 14 12 10 14 10C16 10 16 12 16 12V8C16 8 16 10 14 10C12 10 12 6 12 5C12 3 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              
              <button className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 17C5 14.2386 7.23858 12 10 12C12.7614 12 15 14.2386 15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>
            
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value="Alex" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" value="alex@example.com" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive study reminders and updates</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 dark:bg-blue-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Sound Effects</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds during study sessions</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-gray-300 rounded-full"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

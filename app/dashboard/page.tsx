'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <img 
              src="/studylo%20logo%202.png" 
              alt="StudyLo Logo" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </Link>
          
          <Link href="/my-study-sets" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Study Sets
          </Link>

          <Link href="/flashcards" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Flashcards
          </Link>

          <Link href="/quizzes" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
            </svg>
            Quizzes
          </Link>

          <Link href="/subjects" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V14C16 15.1046 15.1046 16 14 16H6C4.89543 16 4 15.1046 4 14V6Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V16" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Subjects
          </Link>

          <Link href="/ai-generator" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            AI Generator
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="p-3">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 10C16 10 15 12 10 12C5 12 4 10 4 10C4 10 5 8 10 8C15 8 16 10 16 10Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search study sets, flashcards, quizzes..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3C10 3 8 3 8 5C8 6 8 10 6 10C4 10 4 8 4 8V12C4 12 4 10 6 10C8 10 8 14 8 15C8 17 10 17 10 17C10 17 12 17 12 15C12 14 12 10 14 10C16 10 16 12 16 12V8C16 8 16 10 14 10C12 10 12 6 12 5C12 3 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 17C5 14.2386 7.23858 12 10 12C12.7614 12 15 14.2386 15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex gap-6">
              {/* Main Column */}
              <div className="flex-1">
                {/* AI-Powered Learning Banner */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-6 shadow-sm">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">Good evening, Alex! 👋</h1>
                  <p className="text-gray-700 text-lg">Ready to crush your study goals? Your AI study buddy is here to help you learn faster and remember longer.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {/* Study Sets */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5.5C5 4.67157 5.67157 4 6.5 4H17.5C18.3284 4 19 4.67157 19 5.5V20L12 17L5 20V5.5Z" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                    <div className="text-gray-600 font-medium mb-1">Study Sets</div>
                    <div className="text-sm text-gray-500">+2 this week</div>
                  </div>

                  {/* Flashcards */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#10B981" strokeWidth="2"/>
                          <path d="M7 4H17" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">248</div>
                    <div className="text-gray-600 font-medium mb-1">Flashcards</div>
                    <div className="text-sm text-gray-500">+34 this week</div>
                  </div>

                  {/* Quizzes Done */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="#8B5CF6" strokeWidth="2"/>
                          <path d="M8 12L11 15L16 9" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
                    <div className="text-gray-600 font-medium mb-1">Quizzes Done</div>
                    <div className="text-sm text-gray-500">+5 this week</div>
                  </div>

                  {/* Day Streak */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 3C12 3 8 6 8 10C8 13 10 15 12 15C14 15 16 13 16 10C16 6 12 3 12 3Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C12 15 10 16 10 18C10 19.5 11 21 12 21C13 21 14 19.5 14 18C14 16 12 15 12 15Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">7</div>
                    <div className="text-gray-600 font-medium mb-1">Day Streak</div>
                    <div className="text-sm text-gray-500">Keep it up! 🔥</div>
                  </div>
                </div>

                {/* Create with AI Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" fill="#0055FF"/>
                      </svg>
                      <h2 className="text-xl font-bold text-gray-900">Create with AI</h2>
                    </div>
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      View all
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    {/* Upload Notes */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 15V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V15" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-2">Upload Notes</h3>
                      <p className="text-xs text-gray-500 text-center">Drop your PDFs, docs, or images</p>
                    </div>

                    {/* Paste Text */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="#8B5CF6" strokeWidth="2"/>
                          <rect x="9" y="3" width="6" height="4" rx="1" stroke="#8B5CF6" strokeWidth="2"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-2">Paste Text</h3>
                      <p className="text-xs text-gray-500 text-center">Copy-paste any text content</p>
                    </div>

                    {/* AI Flashcards */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#10B981" strokeWidth="2"/>
                          <path d="M7 4H17" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-2">AI Flashcards</h3>
                      <p className="text-xs text-gray-500 text-center">Generate smart flashcards instantly</p>
                    </div>

                    {/* AI Quizzes */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="#F97316" strokeWidth="2"/>
                          <path d="M12 8V12" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="16" r="0.5" fill="#F97316" stroke="#F97316"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-2">AI Quizzes</h3>
                      <p className="text-xs text-gray-500 text-center">Create practice tests in seconds</p>
                    </div>

                    {/* AI Study Sets */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" stroke="#EF4444" strokeWidth="2"/>
                          <path d="M9 5V19" stroke="#EF4444" strokeWidth="2"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-2">AI Study Sets</h3>
                      <p className="text-xs text-gray-500 text-center">Build complete study materials</p>
                    </div>
                  </div>
                </div>

                {/* Recent Study Sets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                      </svg>
                      <h2 className="text-xl font-bold text-gray-900">Recent Study Sets</h2>
                    </div>
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      View all
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {/* Study Set 1 */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Organic Chemistry - Reactions</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Chemistry</span>
                              <span className="text-sm text-gray-500">45 cards</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            2 hours ago
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">68%</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="5" r="1" fill="currentColor"/>
                              <circle cx="10" cy="10" r="1" fill="currentColor"/>
                              <circle cx="10" cy="15" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Study Set 2 */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">World War II Timeline</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">History</span>
                              <span className="text-sm text-gray-500">32 cards</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Yesterday
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">85%</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="5" r="1" fill="currentColor"/>
                              <circle cx="10" cy="10" r="1" fill="currentColor"/>
                              <circle cx="10" cy="15" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Study Set 3 */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Spanish Vocabulary - Unit 5</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Languages</span>
                              <span className="text-sm text-gray-500">60 cards</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            2 days ago
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">42%</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="5" r="1" fill="currentColor"/>
                              <circle cx="10" cy="10" r="1" fill="currentColor"/>
                              <circle cx="10" cy="15" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Study Set 4 */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Calculus Formulas</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Mathematics</span>
                              <span className="text-sm text-gray-500">28 cards</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            3 days ago
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">90%</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="5" r="1" fill="currentColor"/>
                              <circle cx="10" cy="10" r="1" fill="currentColor"/>
                              <circle cx="10" cy="15" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-80">
                {/* Continue Studying */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4L14 10L6 16V4Z" fill="#10B981"/>
                    </svg>
                    <h2 className="text-lg font-bold text-gray-900">Continue Studying</h2>
                  </div>

                  <div className="space-y-3">
                    {/* Continue Item 1 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="#0055FF" strokeWidth="1.5"/>
                            <path d="M6 3H14" stroke="#0055FF" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Organic Chemistry</h3>
                          <p className="text-sm text-gray-500">23/45 · Left off 2h ago</p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '51%' }}></div>
                      </div>
                    </div>

                    {/* Continue Item 2 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="7" stroke="#8B5CF6" strokeWidth="1.5"/>
                            <path d="M10 7V10" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="10" cy="13" r="0.5" fill="#8B5CF6"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">WWII Quiz</h3>
                          <p className="text-sm text-gray-500">8/12 · Left off yesterday</p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>

                    {/* Continue Item 3 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="#0055FF" strokeWidth="1.5"/>
                            <path d="M6 3H14" stroke="#0055FF" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Spanish Vocab</h3>
                          <p className="text-sm text-gray-500">15/60 · Left off 3 days ago</p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" fill="#0055FF"/>
                      </svg>
                      <h2 className="text-lg font-bold text-gray-900">AI Suggestions</h2>
                    </div>
                    <p className="text-sm text-gray-500">Smart actions based on your study habits</p>
                  </div>

                  <div className="space-y-3">
                    {/* Suggestion 1 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4H10C11.1046 4 12 4.89543 12 6V16C12 17.1046 11.1046 18 10 18H6C4.89543 18 4 17.1046 4 16V6C4 4.89543 4.89543 4 6 4Z" stroke="#8B5CF6" strokeWidth="1.5"/>
                            <rect x="8" y="2" width="4" height="2" rx="0.5" stroke="#8B5CF6" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Turn notes into a test</h3>
                          <p className="text-sm text-gray-500 mb-3">Your Chemistry notes are ready for a quiz</p>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2L9 6L11 3L10 7H11L8 14L7 10L5 13L6 9H5L8 2Z" fill="currentColor"/>
                            </svg>
                            Generate Quiz
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Suggestion 2 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M16 4V8H12" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Revise yesterday's deck</h3>
                          <p className="text-sm text-gray-500 mb-3">Review 12 cards from History</p>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2L9 6L11 3L10 7H11L8 14L7 10L5 13L6 9H5L8 2Z" fill="currentColor"/>
                            </svg>
                            Start Review
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Suggestion 3 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="#10B981" strokeWidth="1.5"/>
                            <path d="M6 3H14" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Generate more flashcards</h3>
                          <p className="text-sm text-gray-500 mb-3">Expand your Spanish set with AI</p>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2L9 6L11 3L10 7H11L8 14L7 10L5 13L6 9H5L8 2Z" fill="currentColor"/>
                            </svg>
                            Create Cards
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

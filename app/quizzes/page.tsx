'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function Quizzes() {
  const { theme } = useTheme();
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <img 
              src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"}
              alt="StudyLo Logo" 
              className="h-10 w-auto transition-opacity duration-300"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </Link>
          
          <Link href="/my-study-sets" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Study Sets
          </Link>

          <Link href="/flashcards" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Flashcards
          </Link>

          <Link href="/quizzes" className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
            </svg>
            Quizzes
          </Link>

        </nav>

        <div className="p-3">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
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
          <div className="max-w-6xl">
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Quizzes</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Test your knowledge and track your progress</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Chemistry Chapter 5', questions: 20, score: 85, status: 'completed' },
                { title: 'World War II', questions: 15, score: 92, status: 'completed' },
                { title: 'Spanish Verbs', questions: 25, score: 0, status: 'not started' },
                { title: 'Calculus Practice', questions: 18, score: 78, status: 'completed' },
                { title: 'Biology Cells', questions: 22, score: 45, status: 'in progress' },
                { title: 'French Grammar', questions: 16, score: 0, status: 'not started' },
              ].map((quiz, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">{quiz.title}</h3>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="7" stroke="#8B5CF6" strokeWidth="1.5"/>
                        <path d="M10 7V10" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="10" cy="13" r="0.5" fill="#8B5CF6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Questions</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{quiz.questions}</span>
                    </div>
                    {quiz.status === 'completed' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Score</span>
                        <span className="font-medium text-green-600">{quiz.score}%</span>
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                    quiz.status === 'completed' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    quiz.status === 'in progress' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                    'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {quiz.status === 'completed' ? 'Completed' :
                     quiz.status === 'in progress' ? 'In Progress' :
                     'Not Started'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

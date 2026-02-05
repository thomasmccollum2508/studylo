'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createClient } from '@/lib/supabase/client';
import AppLayout from '@/components/AppLayout';

interface SavedQuiz {
  id: string;
  studySetId: string;
  title: string;
  questions: number;
  score: number;
  status: string;
  completedAt: string;
}

export default function Quizzes() {
  const { theme } = useTheme();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const key = `quizzes-${user.id}`;
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const list: SavedQuiz[] = raw ? JSON.parse(raw) : [];
      setQuizzes(list);
      setLoading(false);
    }
    loadQuizzes();
  }, [router]);
  
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
              
              <Link
                href="/settings"
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Settings"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 17C5 14.2386 7.23858 12 10 12C12.7614 12 15 14.2386 15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
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
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No quizzes yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Complete a practice test from a study set to see your results here.</p>
                  <Link href="/my-study-sets" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Go to My Study Sets
                  </Link>
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <Link key={quiz.id} href={`/my-study-sets/${quiz.studySetId}/practice`} className="block">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer">
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
                        'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {quiz.status === 'completed' ? 'Completed' : quiz.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

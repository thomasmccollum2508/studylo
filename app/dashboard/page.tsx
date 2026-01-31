'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatTimeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function subjectBadgeClass(subject: string): string {
  const m: Record<string, string> = {
    Chemistry: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    History: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Languages: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    Mathematics: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Biology: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  };
  return m[subject] ?? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
}

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateStudySetChoice, setShowCreateStudySetChoice] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return;
        }
        const name = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'there';
        setUserName(name);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData as Profile);
        else {
          await supabase.from('profiles').upsert(
            { id: user.id, display_name: name },
            { onConflict: 'id' }
          );
          setProfile({ id: user.id, display_name: name, avatar_url: null, quizzes_done: 0, day_streak: 0, updated_at: new Date().toISOString() });
        }

        const { data: sets } = await supabase
          .from('study_sets')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        setStudySets((sets ?? []) as StudySet[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const studySetsCount = studySets.length;
  const flashcardsCount = studySets.reduce((s, x) => s + (x.card_count ?? 0), 0);
  const quizzesDone = profile?.quizzes_done ?? 0;
  const dayStreak = profile?.day_streak ?? 0;
  const recentSets = studySets.slice(0, 4);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <img 
              src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"}
              alt="StudyLo Logo" 
              className="h-10 w-auto transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
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

          <Link href="/quizzes" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
            </svg>
            Quizzes
          </Link>

        </nav>

        {/* Settings at bottom */}
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
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
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

            {/* Right Icons */}
            <div className="flex items-center gap-4 ml-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 group"
                aria-label="Toggle dark mode"
                type="button"
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  {/* Sun Icon (Light Mode) */}
                  <svg
                    className={`absolute w-5 h-5 transition-all duration-500 ${
                      theme === 'light'
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-90 scale-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {/* Moon Icon (Dark Mode) */}
                  <svg
                    className={`absolute w-5 h-5 transition-all duration-500 ${
                      theme === 'dark'
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 -rotate-90 scale-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 pointer-events-none"></span>
              </button>

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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex gap-6">
              {/* Main Column */}
              <div className="flex-1">
                {/* AI-Powered Learning Banner */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-8 mb-6 shadow-sm border border-blue-100 dark:border-blue-800/50 transition-colors">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{loading ? 'Loading…' : `${greeting()}, ${userName || 'there'}! 👋`}</h1>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">Ready to crush your study goals? Your AI study buddy is here to help you learn faster and remember longer.</p>
                </div>

                {/* Stats Cards - all start at 0, update from user data */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5.5C5 4.67157 5.67157 4 6.5 4H17.5C18.3284 4 19 4.67157 19 5.5V20L12 17L5 20V5.5Z" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{loading ? '—' : studySetsCount}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Study Sets</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">Create sets to see progress</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#10B981" strokeWidth="2"/>
                          <path d="M7 4H17" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{loading ? '—' : flashcardsCount}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Flashcards</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">Add cards to study sets</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="#8B5CF6" strokeWidth="2"/>
                          <path d="M8 12L11 15L16 9" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{loading ? '—' : quizzesDone}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Quizzes Done</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">Complete quizzes to count</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 3C12 3 8 6 8 10C8 13 10 15 12 15C14 15 16 13 16 10C16 6 12 3 12 3Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C12 15 10 16 10 18C10 19.5 11 21 12 21C13 21 14 19.5 14 18C14 16 12 15 12 15Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{loading ? '—' : dayStreak}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Day Streak</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">{dayStreak > 0 ? 'Keep it up! 🔥' : 'Study daily to build streak'}</div>
                  </div>
                </div>

                {/* Primary Create Study Set CTA */}
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Your Study Set</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">Upload your notes and Studylo turns them into a complete study set with flashcards, practice tests, and more.</p>
                        <button
                          type="button"
                          onClick={() => setShowCreateStudySetChoice(true)}
                          className="inline-flex items-center gap-2 bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Create Study Set
                        </button>
                      </div>
                      <div className="hidden md:block ml-8">
                        <div className="w-32 h-32 bg-blue-200 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" fill="#0055FF" opacity="0.3"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Study Sets - from user data, empty state when none */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                      </svg>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Study Sets</h2>
                    </div>
                    <Link href="/my-study-sets" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1 transition-colors">
                      View all
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 transition-colors">Loading…</div>
                    ) : recentSets.length === 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-100 dark:border-gray-700 text-center transition-colors">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">No study sets yet. Create one to get started.</p>
                        <button
                          type="button"
                          onClick={() => setShowCreateStudySetChoice(true)}
                          className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium"
                        >
                          Create Study Set
                        </button>
                      </div>
                    ) : (
                      recentSets.map((set) => {
                        const sub = set.subject || 'General';
                        return (
                          <Link
                            key={set.id}
                            href={`/my-study-sets/${set.id}`}
                            className="block bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{set.title}</h3>
                                  <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 ${subjectBadgeClass(sub)} text-xs font-medium rounded-full`}>{sub}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{set.card_count ?? 0} cards</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                  {formatTimeAgo(set.updated_at)}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-80">
                {/* Continue Studying - empty until user has progress */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4L14 10L6 16V4Z" fill="#10B981"/>
                    </svg>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Continue Studying</h2>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 text-center transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No study in progress.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Start a set or quiz to see it here.</p>
                  </div>
                </div>

                {/* AI Suggestions - empty until user has data */}
                <div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" fill="#0055FF"/>
                      </svg>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Suggestions</h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Smart actions based on your study habits</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 text-center transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No suggestions yet.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Create study sets and we&apos;ll recommend next steps.</p>
                    <button
                      type="button"
                      onClick={() => setShowCreateStudySetChoice(true)}
                      className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                      Create Study Set →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Study Set: Manual or AI choice */}
      {showCreateStudySetChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create Study Set</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Choose how you want to create your study set.</p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateStudySetChoice(false);
                  router.push('/ai-generator');
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="block font-semibold">With AI</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Paste notes or upload — we generate flashcards and content</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateStudySetChoice(false);
                  router.push('/my-study-sets/create/manual');
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <span className="block font-semibold">Create manually</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Type in your own terms and definitions</span>
                </div>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateStudySetChoice(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

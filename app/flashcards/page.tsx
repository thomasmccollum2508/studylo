'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';
import AppLayout from '@/components/AppLayout';

interface ManualFlashcardMetadata {
  id: string;
  title: string;
  description: string | null;
  cardCount: number;
  createdAt: string;
  isManual: boolean;
}

interface FlashcardSet {
  studySet?: StudySet;
  manualMetadata?: ManualFlashcardMetadata;
  totalCards: number;
  mastered: number;
  flashcardId: string; // ID used in localStorage key
}

export default function Flashcards() {
  const { theme } = useTheme();
  const router = useRouter();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFlashcardSets = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: studySets, error } = await supabase
        .from('study_sets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading study sets:', error);
        setLoading(false);
        return;
      }

      const setsWithFlashcards: FlashcardSet[] = [];
      
      // Load flashcard sets from database (AI-generated)
      (studySets || []).forEach((studySet) => {
        const savedCards = localStorage.getItem(`flashcards-${studySet.id}`);
        if (savedCards) {
          try {
            const cards = JSON.parse(savedCards);
            if (Array.isArray(cards) && cards.length > 0) {
              const mastered = 0;
              setsWithFlashcards.push({
                studySet,
                totalCards: cards.length,
                mastered,
                flashcardId: studySet.id,
              });
            }
          } catch (e) {
            console.error('Error parsing flashcards for', studySet.id, e);
          }
        }
      });

      // Load manual flashcard sets (no study set in database)
      const manualFlashcardKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('flashcard-metadata-manual-')) {
          manualFlashcardKeys.push(key);
        }
      }

      manualFlashcardKeys.forEach((metadataKey) => {
        try {
          const metadataJson = localStorage.getItem(metadataKey);
          if (metadataJson) {
            const metadata: ManualFlashcardMetadata = JSON.parse(metadataJson);
            const savedCards = localStorage.getItem(`flashcards-${metadata.id}`);
            if (savedCards) {
              const cards = JSON.parse(savedCards);
              if (Array.isArray(cards) && cards.length > 0) {
                const mastered = 0;
                setsWithFlashcards.push({
                  manualMetadata: metadata,
                  totalCards: cards.length,
                  mastered,
                  flashcardId: metadata.id,
                });
              }
            }
          }
        } catch (e) {
          console.error('Error loading manual flashcard set:', e);
        }
      });

      // Sort by creation date (newest first)
      setsWithFlashcards.sort((a, b) => {
        const dateA = a.studySet?.created_at || a.manualMetadata?.createdAt || '';
        const dateB = b.studySet?.created_at || b.manualMetadata?.createdAt || '';
        return dateB.localeCompare(dateA);
      });

      setFlashcardSets(setsWithFlashcards);
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadFlashcardSets();
  }, []);
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl">
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Flashcards</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Review and master your study materials</p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading flashcards...</p>
                </div>
              </div>
            ) : flashcardSets.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No flashcards created yet.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Create a study set to generate flashcards automatically.</p>
                <Link 
                  href="/ai-generator"
                  className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Create Study Set
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flashcardSets.map((flashcardSet) => {
                  const { studySet, manualMetadata, totalCards, mastered, flashcardId } = flashcardSet;
                  const title = studySet?.title || manualMetadata?.title || 'Untitled';
                  const progressPercent = totalCards > 0 ? (mastered / totalCards) * 100 : 0;
                  
                  return (
                    <button
                      key={flashcardId}
                      type="button"
                      onClick={() => {
                        if (studySet) {
                          router.push(`/my-study-sets/${studySet.id}/flashcards`);
                        } else if (manualMetadata) {
                          router.push(`/flashcards/${flashcardId}`);
                        }
                      }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer text-left w-full"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{title}</h3>
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="#10B981" strokeWidth="1.5"/>
                            <path d="M6 3H14" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total Cards</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{totalCards}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Mastered</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{mastered}</span>
                        </div>
                        <div className="pt-2">
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-600 rounded-full transition-all" 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>
    </AppLayout>
  );
}

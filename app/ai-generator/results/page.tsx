'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ResultsPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [summary, setSummary] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [useCustomSubject, setUseCustomSubject] = useState(false);

  useEffect(() => {
    // Get summary from sessionStorage only (URL params cause HTTP 431 for large content)
    const storedSummary = sessionStorage.getItem('ai-summary');
    if (storedSummary) {
      setSummary(storedSummary);
    } else {
      // If no summary found, redirect back to generator
      router.push('/ai-generator');
    }

    // Load available subjects from user's study sets
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error loading subjects:', authError);
          setLoadingSubjects(false);
          return;
        }
        
        if (!user) {
          setLoadingSubjects(false);
          return;
        }

        // Get all study sets for the user
        const { data: studySets, error } = await supabase
          .from('study_sets')
          .select('subject')
          .eq('user_id', user.id)
          .not('subject', 'is', null);

        if (error) {
          console.error('Error loading subjects:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          // Don't show error to user, just use empty list
          setAvailableSubjects([]);
          setLoadingSubjects(false);
          return;
        }

        // Extract unique subjects
        const uniqueSubjects = Array.from(
          new Set(
            (studySets || [])
              .map(set => set.subject)
              .filter((subject): subject is string => subject !== null && subject.trim() !== '')
          )
        ).sort();

        setAvailableSubjects(uniqueSubjects);
      } catch (error: any) {
        console.error('Error loading subjects:', {
          message: error?.message,
          error: error,
          stack: error?.stack
        });
        // Don't show error to user, just use empty list
        setAvailableSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, [searchParams, router]);

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

          <Link href="/quizzes" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
            </svg>
            Quizzes
          </Link>

          <Link href="/ai-generator" className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            AI Generator
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Summary</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your analyzed content summary</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L10 5L5 10M10 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Note
              </button>
              <Link
                href="/ai-generator"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {summary ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400">Loading summary...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Save Note Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Save Note</h2>
            
            {saveSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">Flashcards created successfully!</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Your study set and flashcards have been saved. Redirecting to flashcards page...</p>
                <div className="flex gap-3">
                  <Link
                    href="/flashcards"
                    className="flex-1 px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors text-center"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setSaveSuccess(false);
                      setNoteTitle('');
                      setNoteSubject('');
                      setUseCustomSubject(false);
                    }}
                  >
                    Go to Flashcards
                  </Link>
                  <button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setSaveSuccess(false);
                      setNoteTitle('');
                      setNoteSubject('');
                      setUseCustomSubject(false);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Enter note title"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject (optional)
                    </label>
                    {!useCustomSubject ? (
                      <select
                        value={noteSubject}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setUseCustomSubject(true);
                            setNoteSubject('');
                          } else {
                            setNoteSubject(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                      >
                        <option value="">None</option>
                        {loadingSubjects ? (
                          <option disabled>Loading subjects...</option>
                        ) : (
                          <>
                            {availableSubjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                            <option value="__custom__">+ Add New Subject</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={noteSubject}
                          onChange={(e) => setNoteSubject(e.target.value)}
                          placeholder="Enter new subject name"
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUseCustomSubject(false);
                            setNoteSubject('');
                          }}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          ← Select from existing subjects
                        </button>
                      </div>
                    )}
                    {availableSubjects.length > 0 && !useCustomSubject && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {availableSubjects.length} subject{availableSubjects.length !== 1 ? 's' : ''} from your study sets
                      </p>
                    )}
                  </div>

                  {saveError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                      {saveError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setNoteTitle('');
                      setNoteSubject('');
                      setSaveError('');
                      setUseCustomSubject(false);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!noteTitle.trim()) {
                        setSaveError('Please enter a title');
                        return;
                      }

                      setSaving(true);
                      setSaveError('');

                      try {
                        const supabase = createClient();
                        const { data: { user }, error: authError } = await supabase.auth.getUser();
                        
                        if (authError) {
                          console.error('Auth error saving note:', authError);
                          setSaveError('Authentication error. Please log in again.');
                          setSaving(false);
                          return;
                        }
                        
                        if (!user) {
                          setSaveError('You must be logged in to save notes');
                          setSaving(false);
                          return;
                        }

                        // Save to study_sets
                        const { data, error } = await supabase
                          .from('study_sets')
                          .insert({
                            user_id: user.id,
                            title: noteTitle.trim(),
                            subject: noteSubject.trim() || null,
                            card_count: 0,
                          })
                          .select()
                          .single();

                        if (error) {
                          console.error('Supabase error saving note:', {
                            message: error.message,
                            details: error.details,
                            hint: error.hint,
                            code: error.code
                          });
                          throw new Error(error.message || error.details || 'Failed to save note to database');
                        }

                        if (!data) {
                          throw new Error('No data returned after saving note');
                        }

                        // Also save the summary content to localStorage with the study set ID
                        // This way we can retrieve it later if needed
                        if (summary) {
                          localStorage.setItem(`note-content-${data.id}`, summary);
                        }

                        // Generate flashcards from the summary
                        try {
                          const textContent = summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                          const maxLength = 50000;
                          const truncatedContent = textContent.length > maxLength 
                            ? textContent.substring(0, maxLength)
                            : textContent;

                          const flashcardResponse = await fetch('/api/generate-flashcards', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              content: truncatedContent,
                            }),
                          });

                          const flashcardData = await flashcardResponse.json();

                          if (flashcardData.success && flashcardData.cards) {
                            // Save flashcards to localStorage
                            localStorage.setItem(`flashcards-${data.id}`, JSON.stringify(flashcardData.cards));
                          }
                        } catch (flashcardError) {
                          console.error('Error generating flashcards:', flashcardError);
                          // Continue even if flashcard generation fails
                        }

                        setSaveSuccess(true);
                        
                        // Redirect to flashcards page after a short delay
                        setTimeout(() => {
                          router.push('/flashcards');
                        }, 1000);
                        
                        // Refresh subjects list after saving
                        const { data: updatedSets, error: refreshError } = await supabase
                          .from('study_sets')
                          .select('subject')
                          .eq('user_id', user.id)
                          .not('subject', 'is', null);
                        
                        if (!refreshError && updatedSets) {
                          const uniqueSubjects = Array.from(
                            new Set(
                              updatedSets
                                .map(set => set.subject)
                                .filter((subject): subject is string => subject !== null && subject.trim() !== '')
                            )
                          ).sort();
                          setAvailableSubjects(uniqueSubjects);
                        }
                      } catch (error: any) {
                        console.error('Error saving note:', {
                          message: error?.message,
                          error: error,
                          stack: error?.stack
                        });
                        const errorMessage = error?.message || error?.toString() || 'Failed to save note. Please try again.';
                        setSaveError(errorMessage);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving || !noteTitle.trim()}
                    className="flex-1 px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

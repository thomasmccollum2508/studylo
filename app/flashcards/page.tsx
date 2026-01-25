'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [inputMethod, setInputMethod] = useState<'upload' | 'paste' | 'camera'>('paste');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pastedText, setPastedText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFlashcardSets = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    setError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyzeAndCreate = async () => {
    setError('');
    
    if (inputMethod === 'upload' && uploadedFiles.length === 0) {
      setError('Please upload at least one file.');
      return;
    }
    if (inputMethod === 'paste' && !pastedText.trim()) {
      setError('Please paste some text content.');
      return;
    }

    if (!noteTitle.trim()) {
      setError('Please enter a title for your flashcard set.');
      return;
    }

    setProcessing(true);
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create flashcards');
        setProcessing(false);
        setSaving(false);
        return;
      }

      // Step 1: Analyze the content
      const formData = new FormData();
      formData.append('inputMethod', inputMethod);
      
      if (inputMethod === 'paste') {
        formData.append('textContent', pastedText);
      } else if (inputMethod === 'upload') {
        uploadedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      let analyzeData;
      try {
        analyzeData = await analyzeResponse.json();
      } catch (jsonError) {
        const text = await analyzeResponse.text();
        throw new Error(`Server error: ${analyzeResponse.status} ${analyzeResponse.statusText}. ${text.substring(0, 200)}`);
      }

      if (!analyzeResponse.ok || !analyzeData.success) {
        throw new Error(analyzeData.error || `Failed to analyze content (${analyzeResponse.status})`);
      }

      const summaryText = analyzeData.summary;

      // Step 2: Create study set
      const { data: studySetData, error: studySetError } = await supabase
        .from('study_sets')
        .insert({
          user_id: user.id,
          title: noteTitle.trim(),
          subject: noteSubject.trim() || null,
          card_count: 0,
        })
        .select()
        .single();

      if (studySetError || !studySetData) {
        throw new Error(studySetError?.message || 'Failed to create study set');
      }

      // Step 3: Save content to localStorage
      localStorage.setItem(`note-content-${studySetData.id}`, summaryText);

      // Step 4: Generate flashcards directly
      const textContent = summaryText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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

      if (flashcardResponse.ok && flashcardData.success && flashcardData.cards) {
        // Save flashcards to localStorage
        localStorage.setItem(`flashcards-${studySetData.id}`, JSON.stringify(flashcardData.cards));
      } else {
        console.error('Error generating flashcards:', flashcardData.error);
        // Continue even if flashcard generation fails - user can regenerate later
      }

      // Step 5: Reset form and reload flashcard sets
      setPastedText('');
      setUploadedFiles([]);
      setNoteTitle('');
      setNoteSubject('');
      setShowAIGenerator(false);
      setShowCreateModal(false);
      
      // Reload flashcard sets to show the new one
      await loadFlashcardSets();
      
    } catch (err) {
      console.error('Error creating flashcards:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flashcards. Please try again.';
      setError(errorMessage);
    } finally {
      setProcessing(false);
      setSaving(false);
    }
  };

  useEffect(() => {
    loadFlashcardSets();
  }, []);
  
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

          <Link href="/flashcards" className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
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

          <Link href="/ai-generator" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            AI Generator
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Flashcards</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Review and master your study materials</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create Flashcard
              </button>
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
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Create a study set and generate flashcards to get started.</p>
                <Link 
                  href="/ai-generator"
                  className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Create Flashcard Set
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

            {/* AI Generator Section (shown when Create with AI is clicked) */}
            {showAIGenerator && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Flashcards with AI</h2>
                  <button
                    onClick={() => {
                      setShowAIGenerator(false);
                      setPastedText('');
                      setUploadedFiles([]);
                      setNoteTitle('');
                      setNoteSubject('');
                      setError('');
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Input Method Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setInputMethod('paste')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      inputMethod === 'paste'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    onClick={() => setInputMethod('upload')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      inputMethod === 'upload'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Upload Files
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Paste Text Section */}
                {inputMethod === 'paste' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Paste your notes here
                    </label>
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your study notes, lecture content, or any text you want to turn into flashcards..."
                      className="w-full h-48 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                )}

                {/* Upload Files Section */}
                {inputMethod === 'upload' && (
                  <div className="mb-6">
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 15V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V15" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Drop files here or click to browse
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Supports PDF, DOC, DOCX, TXT, JPG, PNG
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-900 dark:text-gray-100">{file.name}</span>
                            <button
                              onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Study Set Details */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Flashcard Set Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g., Biology Chapter 5, French Vocabulary"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject (optional)
                    </label>
                    <input
                      type="text"
                      value={noteSubject}
                      onChange={(e) => setNoteSubject(e.target.value)}
                      placeholder="e.g., Biology, History, Math"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyzeAndCreate}
                  disabled={processing || saving || !noteTitle.trim() || (inputMethod === 'paste' && !pastedText.trim()) || (inputMethod === 'upload' && uploadedFiles.length === 0)}
                  className="w-full bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {processing || saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {saving ? 'Creating flashcards...' : 'Analyzing notes...'}
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      Create Flashcards
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Flashcard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create Flashcard Set</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Choose how you'd like to create your flashcards</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowAIGenerator(true);
                }}
                className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                Create with AI
              </button>
              
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  router.push('/flashcards/create');
                }}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create Manually
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Flashcard {
  front: string;
  back: string;
  image?: string;
}

interface ManualFlashcardMetadata {
  id: string;
  title: string;
  description: string | null;
  cardCount: number;
  createdAt: string;
  isManual: boolean;
}

export default function ManualFlashcards() {
  const params = useParams();
  const router = useRouter();
  const [metadata, setMetadata] = useState<ManualFlashcardMetadata | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackProgress, setTrackProgress] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    function loadFlashcards() {
      try {
        setLoading(true);
        const flashcardId = params.id as string;

        if (!flashcardId || !flashcardId.startsWith('manual-')) {
          router.push('/flashcards');
          return;
        }

        // Load metadata
        const metadataJson = localStorage.getItem(`flashcard-metadata-${flashcardId}`);
        if (!metadataJson) {
          router.push('/flashcards');
          return;
        }

        const parsedMetadata: ManualFlashcardMetadata = JSON.parse(metadataJson);
        setMetadata(parsedMetadata);

        // Load flashcards
        const savedCards = localStorage.getItem(`flashcards-${flashcardId}`);
        if (savedCards) {
          const parsed = JSON.parse(savedCards);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCards(parsed);
          } else {
            router.push('/flashcards');
            return;
          }
        } else {
          router.push('/flashcards');
          return;
        }
      } catch (error) {
        console.error('Error loading flashcards:', error);
        router.push('/flashcards');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadFlashcards();
    }
  }, [params.id, router]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const toggleStar = () => {
    setStarredCards(prev => {
      const next = new Set(prev);
      if (next.has(currentCardIndex)) next.delete(currentCardIndex);
      else next.add(currentCardIndex);
      return next;
    });
  };

  const isStarred = starredCards.has(currentCardIndex);
  const hint = currentCardIndex < cards.length
    ? (cards[currentCardIndex]?.back ?? '').slice(0, 80) + ((cards[currentCardIndex]?.back ?? '').length > 80 ? '…' : '')
    : '';

  if (loading) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!metadata || cards.length === 0) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Flashcards not found.</p>
          <Link 
            href="/flashcards"
            className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-4 transition-colors duration-300 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/flashcards"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0055FF] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="12" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M7 5V3M13 5V3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Flashcards</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
              <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentCardIndex + 1} / {cards.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{metadata.title}</span>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-auto">
        <div
          className="relative w-full max-w-2xl"
          style={{ minHeight: '420px', perspective: '1000px' }}
        >
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={flipCard}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '420px',
            }}
          >
            {/* Front of Card */}
            <div
              className="absolute inset-0 w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-xl p-8 flex flex-col"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                minHeight: '420px',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0055FF] dark:hover:text-blue-400 transition-colors text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.5 13.5 11.5 12 12.5M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Get a hint
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Audio">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V18M8 9V15M16 11V13M4 10C4 10 6 10 8 10C10 10 10 12 10 14C10 16 8 18 8 18M20 10C20 10 18 10 16 10C14 10 14 12 14 14C14 16 16 18 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); toggleStar(); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Star">
                    {isStarred ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 hover:text-amber-500">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {currentCard.front}
                </h2>
                {showHint && hint && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">{hint}</p>
                )}
                <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">Tap to flip</p>
              </div>
            </div>

            {/* Back of Card */}
            <div
              className="absolute inset-0 w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-xl p-8 flex flex-col"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                minHeight: '420px',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">Answer</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button type="button" onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Audio">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V18M8 9V15M16 11V13M4 10C4 10 6 10 8 10C10 10 10 12 10 14C10 16 8 18 8 18M20 10C20 10 18 10 16 10C14 10 14 12 14 14C14 16 16 18 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); toggleStar(); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Star">
                    {isStarred ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 hover:text-amber-500">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                {currentCard.image && (
                  <img src={currentCard.image} alt="Card illustration" className="mb-4 max-w-full max-h-48 rounded-lg" />
                )}
                <p className="text-xl lg:text-2xl text-gray-900 dark:text-gray-100 leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">Tap to flip</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-5 transition-colors duration-300 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#0055FF] dark:text-blue-400">Track progress</span>
            <button
              type="button"
              role="switch"
              aria-checked={trackProgress}
              onClick={() => setTrackProgress(!trackProgress)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:ring-offset-2 ${
                trackProgress ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                  trackProgress ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToPreviousCard}
              disabled={currentCardIndex === 0}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700 transition-colors"
              aria-label="Previous card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNextCard}
              disabled={currentCardIndex === cards.length - 1}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700 transition-colors"
              aria-label="Next card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={(e) => e.stopPropagation()} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z"/>
              </svg>
            </button>
            <button type="button" onClick={(e) => e.stopPropagation()} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Fullscreen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

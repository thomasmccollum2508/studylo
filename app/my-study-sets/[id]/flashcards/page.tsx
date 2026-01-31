'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { stripMarkdownCodeFences } from '@/lib/utils/text';
import AppLayout from '@/components/AppLayout';

interface Flashcard {
  front: string;
  back: string;
}

type MasteryStatus = 'new' | 'learning' | 'mastered';

interface FlashcardMastery {
  status: MasteryStatus;
  correctStreak: number;
  lastReviewedAt: string | null;
}

const MASTERY_THRESHOLD = 2;

interface FlashcardWithMastery extends Flashcard {
  mastery?: FlashcardMastery;
  cardId: string; // Unique identifier for the card
}

export default function Flashcards() {
  const params = useParams();
  const router = useRouter();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [content, setContent] = useState<string>('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [trackProgress, setTrackProgress] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<number>>(new Set());
  const [cardsWithMastery, setCardsWithMastery] = useState<FlashcardWithMastery[]>([]);
  const [reviewMastered, setReviewMastered] = useState(false);
  const [showMasteryButtons, setShowMasteryButtons] = useState(false);

  useEffect(() => {
    async function loadStudySet() {
      try {
        setLoading(true);
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

        const studySetId = params.id as string;
        
        // Get study set from database
        const { data: setData, error } = await supabase
          .from('study_sets')
          .select('*')
          .eq('id', studySetId)
          .eq('user_id', user.id)
          .single();

        if (error || !setData) {
          console.error('Error loading study set:', error);
          router.push('/my-study-sets');
          return;
        }

        setStudySet(setData as StudySet);

        // Get content from localStorage
        const savedContent = localStorage.getItem(`note-content-${studySetId}`);
        if (savedContent) {
          setContent(stripMarkdownCodeFences(savedContent));
        }

        // Always check for saved flashcards (for both AI-generated and manually created)
        const savedCards = localStorage.getItem(`flashcards-${studySetId}`);
        const parsed = savedCards ? JSON.parse(savedCards) : null;
        
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          // For manually created flashcards (no savedContent), always use them
          // For AI-generated flashcards, only use if >10 cards (skip old "limit 10" cache)
          if (!savedContent || parsed.length > 10) {
            setCards(parsed);
            initializeCardsWithMastery(parsed, studySetId);
            setLoading(false);
          } else {
            // Old AI-generated set with ≤10 cards - regenerate
            if (parsed.length <= 10) {
              localStorage.removeItem(`flashcards-${studySetId}`);
            }
            if (savedContent) {
              await generateFlashcards(savedContent, studySetId);
            } else {
              setLoading(false);
            }
          }
        } else if (savedContent) {
          // No flashcards but have content - generate them
          await generateFlashcards(savedContent, studySetId);
        } else {
          // No content and no flashcards - nothing to show
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading study set:', error);
        router.push('/my-study-sets');
      }
    }

    if (params.id) {
      loadStudySet();
    }
  }, [params.id, router]);

  // Adjust currentCardIndex when filtered cards change
  useEffect(() => {
    const filtered = getFilteredCards();
    if (filtered.length > 0 && currentCardIndex >= filtered.length) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowMasteryButtons(false);
    } else if (filtered.length === 0 && cardsWithMastery.length > 0) {
      // All cards are mastered and reviewMastered is false
      setIsFlipped(false);
      setShowMasteryButtons(false);
    }
  }, [cardsWithMastery, reviewMastered]);

  const generateFlashcards = async (notesContent: string, studySetId: string) => {
    try {
      setGenerating(true);
      
      // Strip HTML tags for AI processing; keep all content for max flashcards
      const textContent = notesContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const maxLength = 50000;
      const truncatedContent = textContent.length > maxLength 
        ? textContent.substring(0, maxLength)
        : textContent;

      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: truncatedContent,
        }),
      });

      const data = await response.json();

      if (data.success && data.cards) {
        setCards(data.cards);
        // Save flashcards to localStorage
        localStorage.setItem(`flashcards-${studySetId}`, JSON.stringify(data.cards));
        // Initialize mastery data for new cards
        initializeCardsWithMastery(data.cards, studySetId);
      } else {
        console.error('Error generating flashcards:', data.error);
        // Create fallback flashcards
        createFallbackFlashcards(truncatedContent);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      // Create fallback flashcards
      createFallbackFlashcards(notesContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const createFallbackFlashcards = (textContent: string) => {
    // Fallback: create as many cards as possible from sentences/phrases
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const fallbackCards: Flashcard[] = [];
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 25) {
        const words = sentence.split(' ').filter(Boolean);
        const keyTerm = words.find(w => w.length > 5) || words[0];
        if (keyTerm) {
          fallbackCards.push({
            front: `What is ${keyTerm}?`,
            back: sentence,
          });
        }
      }
    }
    
    if (fallbackCards.length > 0) {
      setCards(fallbackCards);
      const studySetId = params.id as string;
      initializeCardsWithMastery(fallbackCards, studySetId);
    }
  };

  const initializeMastery = (cardId: string): FlashcardMastery => ({
    status: 'new',
    correctStreak: 0,
    lastReviewedAt: null,
  });

  const normalizeMastery = (raw: unknown): FlashcardMastery => {
    if (raw && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      if (typeof o.status === 'string' && (o.status === 'new' || o.status === 'learning' || o.status === 'mastered') &&
          typeof o.correctStreak === 'number' && (o.lastReviewedAt === null || typeof o.lastReviewedAt === 'string')) {
        return { status: o.status as MasteryStatus, correctStreak: o.correctStreak, lastReviewedAt: o.lastReviewedAt as string | null };
      }
      const level = typeof o.mastery_level === 'number' ? o.mastery_level : 0;
      const isMastered = o.is_mastered === true;
      const lastReviewedAt = (o.last_reviewed_at ?? o.lastReviewedAt) as string | null;
      return {
        status: isMastered ? 'mastered' : (level > 0 ? 'learning' : 'new'),
        correctStreak: isMastered ? MASTERY_THRESHOLD : Math.min(level, MASTERY_THRESHOLD - 1),
        lastReviewedAt: lastReviewedAt ?? null,
      };
    }
    return initializeMastery('');
  };

  const loadMasteryData = (studySetId: string): { [cardId: string]: FlashcardMastery } => {
    try {
      const saved = localStorage.getItem(`flashcard-mastery-${studySetId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as { [cardId: string]: unknown };
        const result: { [cardId: string]: FlashcardMastery } = {};
        for (const [id, val] of Object.entries(parsed)) result[id] = normalizeMastery(val);
        return result;
      }
    } catch (error) {
      console.error('Error loading mastery data:', error);
    }
    return {};
  };

  // Save mastery data to localStorage
  const saveMasteryData = (studySetId: string, masteryData: { [cardId: string]: FlashcardMastery }) => {
    try {
      localStorage.setItem(`flashcard-mastery-${studySetId}`, JSON.stringify(masteryData));
    } catch (error) {
      console.error('Error saving mastery data:', error);
    }
  };

  // Get card ID from flashcard content (hash-based for consistency)
  const getCardId = (card: Flashcard): string => {
    return `${card.front}-${card.back}`;
  };

  // Initialize cards with mastery data
  const initializeCardsWithMastery = (flashcards: Flashcard[], studySetId: string) => {
    const masteryData = loadMasteryData(studySetId);
    const cardsWithMastery: FlashcardWithMastery[] = flashcards.map(card => {
      const cardId = getCardId(card);
      return {
        ...card,
        cardId,
        mastery: masteryData[cardId] || initializeMastery(cardId),
      };
    });
    setCardsWithMastery(cardsWithMastery);
  };

  const getFilteredCards = (): FlashcardWithMastery[] => {
    let filtered = [...cardsWithMastery];
    if (!reviewMastered) {
      filtered = filtered.filter(card => card.mastery?.status !== 'mastered');
    }
    filtered.sort((a, b) => {
      const aStatus = a.mastery?.status ?? 'new';
      const bStatus = b.mastery?.status ?? 'new';
      const order = { new: 0, learning: 1, mastered: 2 };
      if (order[aStatus] !== order[bStatus]) return order[aStatus] - order[bStatus];
      const aLast = a.mastery?.lastReviewedAt || '';
      const bLast = b.mastery?.lastReviewedAt || '';
      if (aLast && bLast) return new Date(aLast).getTime() - new Date(bLast).getTime();
      if (aLast) return 1;
      if (bLast) return -1;
      return 0;
    });
    return filtered;
  };

  const flipCard = () => {
    if (!isFlipped) {
      // When revealing the answer, show mastery buttons if trackProgress is enabled
      setIsFlipped(true);
      if (trackProgress) {
        setShowMasteryButtons(true);
      }
    } else {
      setIsFlipped(false);
      setShowMasteryButtons(false);
    }
  };

  const handleKnow = () => {
    const studySetId = params.id as string;
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;
    const currentCard = filteredCards[currentCardIndex];
    if (!currentCard) return;
    const current = currentCard.mastery || initializeMastery(currentCard.cardId);
    const updatedMastery: FlashcardMastery = {
      status: current.status === 'new' ? 'learning' : current.status,
      correctStreak: current.correctStreak + 1,
      lastReviewedAt: new Date().toISOString(),
    };
    if (updatedMastery.correctStreak >= MASTERY_THRESHOLD) updatedMastery.status = 'mastered';
    setCardsWithMastery(prev => {
      const updated = prev.map(card => card.cardId === currentCard.cardId ? { ...card, mastery: updatedMastery } : card);
      const masteryData: { [cardId: string]: FlashcardMastery } = {};
      updated.forEach(card => { if (card.mastery) masteryData[card.cardId] = card.mastery; });
      saveMasteryData(studySetId, masteryData);
      return updated;
    });
    setTimeout(() => goToNextCard(), 100);
  };

  const handleDontKnow = () => {
    const studySetId = params.id as string;
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;
    const currentCard = filteredCards[currentCardIndex];
    if (!currentCard) return;
    const updatedMastery: FlashcardMastery = {
      status: 'learning',
      correctStreak: 0,
      lastReviewedAt: new Date().toISOString(),
    };
    setCardsWithMastery(prev => {
      const updated = prev.map(card => card.cardId === currentCard.cardId ? { ...card, mastery: updatedMastery } : card);
      const masteryData: { [cardId: string]: FlashcardMastery } = {};
      updated.forEach(card => { if (card.mastery) masteryData[card.cardId] = card.mastery; });
      saveMasteryData(studySetId, masteryData);
      return updated;
    });
    setTimeout(() => goToNextCard(), 100);
  };

  const goToNextCard = () => {
    const filtered = getFilteredCards();
    if (filtered.length === 0) return;
    
    if (currentCardIndex < filtered.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Reached end, reset to beginning
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
    setShowHint(false);
    setShowMasteryButtons(false);
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
      setShowMasteryButtons(false);
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

  const handleRegenerate = async () => {
    const id = params.id as string;
    const savedContent = localStorage.getItem(`note-content-${id}`);
    if (!savedContent || !studySet) return;
    localStorage.removeItem(`flashcards-${id}`);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setShowMasteryButtons(false);
    await generateFlashcards(savedContent, id);
  };

  // Reset mastery for current card
  const resetCurrentCardMastery = () => {
    const studySetId = params.id as string;
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;
    
    const currentCard = filteredCards[currentCardIndex];
    if (!currentCard) return;
    
    const resetMastery = initializeMastery(currentCard.cardId);
    
    setCardsWithMastery(prev => {
      const updated = prev.map(card => 
        card.cardId === currentCard.cardId 
          ? { ...card, mastery: resetMastery }
          : card
      );
      
      // Save to localStorage
      const masteryData: { [cardId: string]: FlashcardMastery } = {};
      updated.forEach(card => {
        if (card.mastery) {
          masteryData[card.cardId] = card.mastery;
        }
      });
      saveMasteryData(studySetId, masteryData);
      
      return updated;
    });
  };

  // Reset mastery for entire study set
  const resetAllMastery = () => {
    if (!window.confirm('Are you sure you want to reset mastery for all flashcards in this set?')) {
      return;
    }
    
    const studySetId = params.id as string;
    const resetMasteryData: { [cardId: string]: FlashcardMastery } = {};
    
    setCardsWithMastery(prev => {
      const updated = prev.map(card => {
        const resetMastery = initializeMastery(card.cardId);
        resetMasteryData[card.cardId] = resetMastery;
        return { ...card, mastery: resetMastery };
      });
      
      saveMasteryData(studySetId, resetMasteryData);
      return updated;
    });
    
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setShowMasteryButtons(false);
  };

  const filteredCards = getFilteredCards();
  const currentCardWithMastery = filteredCards[currentCardIndex];
  const currentCard = currentCardWithMastery || { front: '', back: '', cardId: '' };
  const hint = currentCard.back ? (currentCard.back.slice(0, 80) + (currentCard.back.length > 80 ? '…' : '')) : '';
  const isStarred = starredCards.has(currentCardIndex);

  if (loading || generating) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {generating ? 'Generating flashcards...' : 'Loading...'}
          </p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!studySet || cardsWithMastery.length === 0) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!content ? 'No content available to generate flashcards from.' : 'Unable to generate flashcards.'}
          </p>
          <Link 
            href={`/my-study-sets/${params.id}`}
            className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Study Set
          </Link>
        </div>
        </div>
      </AppLayout>
    );
  }

  // Check if we have any cards to show
  if (filteredCards.length === 0) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All flashcards are mastered! Enable "Review mastered" to see them again.
          </p>
          <Link 
            href={`/my-study-sets/${params.id}`}
            className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Study Set
          </Link>
        </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-4 transition-colors duration-300 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/my-study-sets/${params.id}`}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Back to Study Set</span>
          </Link>

          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {filteredCards.length > 0 ? currentCardIndex + 1 : 0} / {filteredCards.length || cardsWithMastery.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{studySet.title}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={generating}
                className="text-xs text-[#0055FF] dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Regenerating…' : 'Regenerate'}
              </button>
              <span className="text-xs text-gray-400">|</span>
              <button
                type="button"
                onClick={resetAllMastery}
                className="text-xs text-red-500 dark:text-red-400 hover:underline"
              >
                Reset mastery
              </button>
            </div>
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
            className="relative w-full h-full"
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
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    flipCard();
                  }}
                  className="mt-6 px-6 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors"
                >
                  Reveal
                </button>
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
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <p className="text-xl lg:text-2xl text-gray-900 dark:text-gray-100 leading-relaxed mb-8">
                  {currentCard.back}
                </p>
                
                {/* Mastery Buttons - Only show when card is flipped and trackProgress is enabled */}
                {showMasteryButtons && trackProgress && (
                  <div className="flex gap-4 w-full max-w-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDontKnow();
                      }}
                      className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      I don't know this
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKnow();
                      }}
                      className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      I know this
                    </button>
                  </div>
                )}
                
                {!trackProgress && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                      setShowMasteryButtons(false);
                    }}
                    className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
                  >
                    Flip back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-5 transition-colors duration-300 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#0055FF] dark:text-blue-400">Track progress</span>
              <button
                type="button"
                role="switch"
                aria-checked={trackProgress}
                onClick={() => {
                  setTrackProgress(!trackProgress);
                  if (!trackProgress) {
                    // When enabling, show mastery buttons if card is flipped
                    if (isFlipped) {
                      setShowMasteryButtons(true);
                    }
                  } else {
                    setShowMasteryButtons(false);
                  }
                }}
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
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Review mastered</span>
              <button
                type="button"
                role="switch"
                aria-checked={reviewMastered}
                onClick={() => {
                  setReviewMastered(!reviewMastered);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                  setShowMasteryButtons(false);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:ring-offset-2 ${
                  reviewMastered ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    reviewMastered ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
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
              disabled={filteredCards.length === 0 || currentCardIndex === filteredCards.length - 1}
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
    </AppLayout>
  );
}

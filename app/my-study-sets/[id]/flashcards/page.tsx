'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';

interface Flashcard {
  front: string;
  back: string;
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

  useEffect(() => {
    async function loadStudySet() {
      try {
        setLoading(true);
        const supabase = createClient();
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
          setContent(savedContent);
          // Check if flashcards already exist in localStorage
          const savedCards = localStorage.getItem(`flashcards-${studySetId}`);
          if (savedCards) {
            setCards(JSON.parse(savedCards));
            setLoading(false);
          } else {
            // Generate flashcards
            await generateFlashcards(savedContent, studySetId);
          }
        } else {
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

  const generateFlashcards = async (notesContent: string, studySetId: string) => {
    try {
      setGenerating(true);
      
      // Strip HTML tags for AI processing
      const textContent = notesContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Limit content length
      const maxLength = 10000;
      const truncatedContent = textContent.length > maxLength 
        ? textContent.substring(0, maxLength) + '...'
        : textContent;

      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: truncatedContent,
          count: 10, // Generate 10 flashcards
        }),
      });

      const data = await response.json();

      if (data.success && data.cards) {
        setCards(data.cards);
        // Save flashcards to localStorage
        localStorage.setItem(`flashcards-${studySetId}`, JSON.stringify(data.cards));
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
    // Simple fallback: extract key terms and definitions
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const fallbackCards: Flashcard[] = [];
    
    for (let i = 0; i < Math.min(10, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 30) {
        const words = sentence.split(' ');
        const keyTerm = words.find(w => w.length > 5) || words[0];
        fallbackCards.push({
          front: `What is ${keyTerm}?`,
          back: sentence,
        });
      }
    }
    
    if (fallbackCards.length > 0) {
      setCards(fallbackCards);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  if (loading || generating) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {generating ? 'Generating flashcards...' : 'Loading...'}
          </p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!studySet || cards.length === 0) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
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
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href={`/my-study-sets/${params.id}`}
            className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to {studySet.title}
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousCard}
              disabled={currentCardIndex === 0}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {currentCardIndex + 1} of {cards.length}
            </span>
            <button
              onClick={goToNextCard}
              disabled={currentCardIndex === cards.length - 1}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Flashcard */}
        <div 
          className="relative w-full max-w-2xl mx-auto"
          style={{ height: '400px', perspective: '1000px' }}
        >
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={flipCard}
            style={{ 
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-8 flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)'
              }}
            >
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentCard.front}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Click to flip</p>
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 w-full h-full bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg p-8 flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Answer</p>
                <p className="text-xl text-gray-900 dark:text-gray-100 leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Click to flip</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Click the card to flip • Use arrows to navigate
        </div>
      </main>
    </div>
  );
}

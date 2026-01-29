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

interface FlashcardMastery {
  mastery_level: number;
  times_known: number;
  times_unknown: number;
  last_reviewed_at: string | null;
  is_mastered: boolean;
}

interface FlashcardWithMastery extends Flashcard {
  mastery?: FlashcardMastery;
  cardId: string;
}

type QuestionType = 'multiple-choice' | 'typed-answer';
type QuestionDirection = 'front-to-back' | 'back-to-front';

interface LearnQuestion {
  card: FlashcardWithMastery;
  type: QuestionType;
  direction: QuestionDirection;
  options?: string[]; // For multiple choice
  correctAnswer: string;
}

export default function LearnMode() {
  const params = useParams();
  const router = useRouter();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [cardsWithMastery, setCardsWithMastery] = useState<FlashcardWithMastery[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Setup state
  const [showSetup, setShowSetup] = useState(true);
  const [questionTypePreference, setQuestionTypePreference] = useState<'multiple-choice' | 'typed-answer' | 'both'>('both');
  
  // Session state
  const [currentQuestion, setCurrentQuestion] = useState<LearnQuestion | null>(null);
  const [sessionCards, setSessionCards] = useState<FlashcardWithMastery[]>([]); // Cards in current session
  const [incorrectCards, setIncorrectCards] = useState<FlashcardWithMastery[]>([]); // Cards to repeat
  const [correctCards, setCorrectCards] = useState<FlashcardWithMastery[]>([]); // Cards answered correctly (delayed)
  const [correctCardDelays, setCorrectCardDelays] = useState<Map<string, number>>(new Map()); // Track delay count for correct cards
  
  // Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Session stats
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

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

        // Load flashcards from localStorage
        const savedCards = localStorage.getItem(`flashcards-${studySetId}`);
        if (savedCards) {
          const parsed = JSON.parse(savedCards);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCards(parsed);
            initializeCardsWithMastery(parsed, studySetId);
          } else {
            setLoading(false);
            return;
          }
        } else {
          setLoading(false);
          return;
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

  // Initialize mastery for a card
  const initializeMastery = (cardId: string): FlashcardMastery => ({
    mastery_level: 0,
    times_known: 0,
    times_unknown: 0,
    last_reviewed_at: null,
    is_mastered: false,
  });

  // Load mastery data from localStorage
  const loadMasteryData = (studySetId: string): { [cardId: string]: FlashcardMastery } => {
    try {
      const saved = localStorage.getItem(`flashcard-mastery-${studySetId}`);
      if (saved) {
        return JSON.parse(saved);
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

  // Get card ID from flashcard content
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
    
    // Start session with non-mastered cards, sorted by lowest mastery level
    const nonMastered = cardsWithMastery
      .filter(card => !card.mastery?.is_mastered)
      .sort((a, b) => {
        const aLevel = a.mastery?.mastery_level || 0;
        const bLevel = b.mastery?.mastery_level || 0;
        if (aLevel !== bLevel) {
          return aLevel - bLevel;
        }
        const aLastReviewed = a.mastery?.last_reviewed_at || '';
        const bLastReviewed = b.mastery?.last_reviewed_at || '';
        if (aLastReviewed && bLastReviewed) {
          return new Date(aLastReviewed).getTime() - new Date(bLastReviewed).getTime();
        }
        if (aLastReviewed) return 1;
        if (bLastReviewed) return -1;
        return 0;
      });
    
    setSessionCards(nonMastered);
    setLoading(false);
    
    // Don't generate questions yet - wait for user to select question type preference
    if (nonMastered.length === 0) {
      // All cards already mastered
      setSessionComplete(true);
      setShowSetup(false);
    }
  };

  // Generate multiple choice options
  const generateMultipleChoiceOptions = (correctAnswer: string, allCards: FlashcardWithMastery[]): string[] => {
    const options = [correctAnswer];
    const otherAnswers = allCards
      .map(card => [card.back, card.front]) // Get both front and back as potential distractors
      .flat()
      .filter(answer => answer !== correctAnswer && answer.trim().length > 0);
    
    // Remove duplicates
    const uniqueAnswers = Array.from(new Set(otherAnswers));
    
    // Shuffle and take up to 3 random wrong answers
    const shuffled = uniqueAnswers.sort(() => Math.random() - 0.5);
    const wrongAnswers = shuffled.slice(0, Math.min(3, shuffled.length));
    options.push(...wrongAnswers);
    
    // If we don't have 4 options, add generic options
    while (options.length < 4) {
      options.push(`Option ${options.length}`);
    }
    
    // Shuffle all options
    return options.sort(() => Math.random() - 0.5);
  };

  // Generate next question
  const generateNextQuestion = (availableCards: FlashcardWithMastery[]) => {
    // Prioritize incorrect cards (they reappear immediately)
    if (incorrectCards.length > 0) {
      const nextCard = incorrectCards[0];
      setIncorrectCards(prev => prev.slice(1));
      createQuestion(nextCard, cardsWithMastery);
      return;
    }

    // Then check for available cards (non-mastered)
    if (availableCards.length > 0) {
      // Sort by mastery level (lowest first)
      const sorted = [...availableCards].sort((a, b) => {
        const aLevel = a.mastery?.mastery_level || 0;
        const bLevel = b.mastery?.mastery_level || 0;
        return aLevel - bLevel;
      });
      
      // Pick from the lowest mastery cards (first 30% of sorted list)
      const lowMasteryCount = Math.max(1, Math.floor(sorted.length * 0.3));
      const lowMasteryCards = sorted.slice(0, lowMasteryCount);
      const randomIndex = Math.floor(Math.random() * lowMasteryCards.length);
      const selectedCard = lowMasteryCards[randomIndex];
      createQuestion(selectedCard, cardsWithMastery);
      return;
    }

    // Check if correct cards can be reintroduced (after delay)
    // Reintroduce correct cards that have been delayed enough (2+ questions since they were correct)
    if (correctCards.length > 0) {
      // Find a card that has been delayed enough
      const readyCardIndex = correctCards.findIndex(card => {
        const delay = correctCardDelays.get(card.cardId) || 0;
        return delay >= 2; // Require at least 2 questions before reintroducing
      });
      
      if (readyCardIndex !== -1) {
        const nextCard = correctCards[readyCardIndex];
        setCorrectCards(prev => prev.filter((_, i) => i !== readyCardIndex));
        setCorrectCardDelays(prev => {
          const newMap = new Map(prev);
          newMap.delete(nextCard.cardId);
          return newMap;
        });
        createQuestion(nextCard, cardsWithMastery);
        return;
      }
    }

    // Session complete - all cards mastered or no more cards to review
    setSessionComplete(true);
  };

  // Create a question from a card
  const createQuestion = (card: FlashcardWithMastery, allCards: FlashcardWithMastery[]) => {
    // Choose question type based on user preference
    let questionType: QuestionType;
    if (questionTypePreference === 'both') {
      // Randomly choose if both are selected
      questionType = Math.random() < 0.5 ? 'multiple-choice' : 'typed-answer';
    } else {
      questionType = questionTypePreference;
    }
    
    // Always use front-to-back (term → definition)
    // Question shows the term (front), answer is always the definition (back)
    const direction: QuestionDirection = 'front-to-back';
    
    const prompt = card.front; // Always show the term
    const correctAnswer = card.back; // Always answer with the definition

    let options: string[] | undefined;
    if (questionType === 'multiple-choice') {
      options = generateMultipleChoiceOptions(correctAnswer, allCards);
    }

    setCurrentQuestion({
      card,
      type: questionType,
      direction,
      options,
      correctAnswer,
    });
    
    setUserAnswer('');
    setSelectedOption(null);
    setShowFeedback(false);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    let correct = false;
    
    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedOption === currentQuestion.correctAnswer;
    } else {
      // Typed answer - case-insensitive, trimmed comparison
      const userAnswerTrimmed = userAnswer.trim().toLowerCase();
      const correctAnswerTrimmed = currentQuestion.correctAnswer.trim().toLowerCase();
      correct = userAnswerTrimmed === correctAnswerTrimmed;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Update mastery
    updateMastery(currentQuestion.card, correct);
  };

  // Update mastery after answer
  const updateMastery = (card: FlashcardWithMastery, isCorrect: boolean) => {
    const studySetId = params.id as string;
    const cardId = card.cardId;
    
    // Use current state from cardsWithMastery, not localStorage (to get latest values)
    setCardsWithMastery(prev => {
      const currentCard = prev.find(c => c.cardId === cardId);
      const currentMastery = currentCard?.mastery || initializeMastery(cardId);
      
      // Create updated mastery object
      const updatedMastery: FlashcardMastery = { ...currentMastery };
      
      if (isCorrect) {
        // Correct answer: mastery_level +1
        updatedMastery.mastery_level = Math.min(updatedMastery.mastery_level + 1, 10); // Cap at 10
        updatedMastery.times_known += 1;
        
        // Check if mastered (mastery_level >= 3)
        if (updatedMastery.mastery_level >= 3) {
          updatedMastery.is_mastered = true;
        }
        
        // Add to correct cards (will be delayed before reappearing)
        // Only add if not already mastered (mastered cards don't need to reappear)
        if (updatedMastery.mastery_level < 3) {
          setCorrectCards(prevCards => [...prevCards, card]);
          setCorrectCardDelays(prevDelays => {
            const newMap = new Map(prevDelays);
            newMap.set(card.cardId, 0);
            return newMap;
          });
        }
      } else {
        // Incorrect answer: mastery_level -1 (minimum 0)
        updatedMastery.mastery_level = Math.max(updatedMastery.mastery_level - 1, 0);
        updatedMastery.times_unknown += 1;
        updatedMastery.is_mastered = false;
        
        // Add to incorrect cards (will reappear soon)
        setIncorrectCards(prevCards => [...prevCards, card]);
      }
      
      updatedMastery.last_reviewed_at = new Date().toISOString();
      
      // Save to localStorage
      const masteryData = loadMasteryData(studySetId);
      masteryData[cardId] = updatedMastery;
      saveMasteryData(studySetId, masteryData);
      
      // Update state and return new array to trigger re-render
      const updated = prev.map(c => 
        c.cardId === cardId ? { ...c, mastery: updatedMastery } : c
      );
      
      // Remove from session cards if mastered
      if (updatedMastery.is_mastered) {
        setSessionCards(prevSession => prevSession.filter(c => c.cardId !== cardId));
      }
      
      return updated;
    });
  };

  // Move to next question after feedback
  const handleNext = () => {
    if (!currentQuestion) return;
    
    // Update delay counters for correct cards
    if (isCorrect) {
      setCorrectCardDelays(prev => {
        const newMap = new Map(prev);
        // Increment delay for all correct cards
        prev.forEach((delay, cardId) => {
          newMap.set(cardId, delay + 1);
        });
        return newMap;
      });
    }
    
    // Remove current card from session cards if mastered
    const updatedMastery = cardsWithMastery.find(c => c.cardId === currentQuestion.card.cardId)?.mastery;
    if (updatedMastery?.is_mastered) {
      setSessionCards(prev => prev.filter(c => c.cardId !== currentQuestion.card.cardId));
      // Also remove from correct cards queue if mastered
      setCorrectCards(prev => prev.filter(c => c.cardId !== currentQuestion.card.cardId));
      setCorrectCardDelays(prev => {
        const newMap = new Map(prev);
        newMap.delete(currentQuestion.card.cardId);
        return newMap;
      });
    }
    
    // Generate next question immediately
    const remainingCards = sessionCards.filter(c => 
      c.cardId !== currentQuestion.card.cardId || !updatedMastery?.is_mastered
    );
    generateNextQuestion(remainingCards);
  };

  // Format time spent
  const formatTimeSpent = (): string => {
    if (!sessionStartTime) return '0 min';
    const now = new Date();
    const diffMs = now.getTime() - sessionStartTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    if (diffMins === 0) {
      return `${diffSecs} sec`;
    } else if (diffSecs === 0) {
      return `${diffMins} min`;
    } else {
      return `${diffMins} min ${diffSecs} sec`;
    }
  };

  // Handle starting the session after setup
  const handleStartSession = () => {
    setShowSetup(false);
    setSessionStartTime(new Date());
    
    // Generate first question
    if (sessionCards.length > 0) {
      generateNextQuestion(sessionCards);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Learn Mode...</p>
        </div>
      </div>
    );
  }

  // Show setup screen
  if (showSetup) {
    const masteredCount = cardsWithMastery.filter(c => c.mastery?.is_mastered).length;
    const totalCount = cardsWithMastery.length;
    const availableCount = sessionCards.length;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center">
            <Link href={`/my-study-sets/${params.id}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Learn Mode</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {studySet?.title || 'Study Set'}
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {availableCount} cards available to study
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Choose question type:
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => setQuestionTypePreference('multiple-choice')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    questionTypePreference === 'multiple-choice'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      questionTypePreference === 'multiple-choice'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {questionTypePreference === 'multiple-choice' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Multiple Choice</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Select the correct answer from options</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setQuestionTypePreference('typed-answer')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    questionTypePreference === 'typed-answer'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      questionTypePreference === 'typed-answer'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {questionTypePreference === 'typed-answer' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Written Answer</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Type your answer</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setQuestionTypePreference('both')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    questionTypePreference === 'both'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      questionTypePreference === 'both'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {questionTypePreference === 'both' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Both</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Mix of multiple choice and written answers</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={availableCount === 0}
              className="w-full bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {availableCount === 0 ? 'All cards mastered' : 'Start Learning'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const masteredCount = cardsWithMastery.filter(c => c.mastery?.is_mastered).length;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Session Complete!</h1>
              <p className="text-gray-600 dark:text-gray-400">You've mastered all flashcards in this study set.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{masteredCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cards Mastered</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{accuracy}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{formatTimeSpent()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Reset session state
                  setSessionComplete(false);
                  setTotalQuestions(0);
                  setCorrectAnswers(0);
                  setIncorrectCards([]);
                  setCorrectCards([]);
                  setCorrectCardDelays(new Map());
                  setSessionStartTime(new Date());
                  
                  // Reload cards (excluding mastered ones)
                  const nonMastered = cardsWithMastery
                    .filter(card => !card.mastery?.is_mastered)
                    .sort((a, b) => {
                      const aLevel = a.mastery?.mastery_level || 0;
                      const bLevel = b.mastery?.mastery_level || 0;
                      return aLevel - bLevel;
                    });
                  
                  setSessionCards(nonMastered);
                  
                  if (nonMastered.length > 0) {
                    generateNextQuestion(nonMastered);
                  } else {
                    setSessionComplete(true);
                  }
                }}
                className="flex-1 bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Restart Learn Mode
              </button>
              <Link
                href={`/my-study-sets/${params.id}`}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Back to Study Set
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No questions available.</p>
      </div>
    );
  }

  // Calculate progress - this will update reactively as cardsWithMastery changes
  const masteredCount = cardsWithMastery.filter(c => c.mastery?.is_mastered).length;
  const totalCount = cardsWithMastery.length;
  const progressPercent = totalCount > 0 
    ? (masteredCount / totalCount) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href={`/my-study-sets/${params.id}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {studySet?.title || 'Learn Mode'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {masteredCount} / {totalCount} mastered
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
          {/* Question */}
          <div className="mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'Type your answer'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {currentQuestion.direction === 'front-to-back' 
                ? currentQuestion.card.front 
                : currentQuestion.card.back}
            </h2>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && setSelectedOption(option)}
                    disabled={showFeedback}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      showFeedback && option === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : showFeedback && selectedOption === option && option !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : selectedOption === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {selectedOption === option && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'typed-answer' && (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showFeedback && (userAnswer.trim() || selectedOption)) {
                      handleSubmitAnswer();
                    }
                  }}
                  disabled={showFeedback}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mb-6 p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-green-700 dark:text-green-400 font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex-1">
                      <span className="text-red-700 dark:text-red-400 font-medium">Incorrect.</span>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  (currentQuestion.type === 'multiple-choice' && !selectedOption) ||
                  (currentQuestion.type === 'typed-answer' && !userAnswer.trim())
                }
                className="bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

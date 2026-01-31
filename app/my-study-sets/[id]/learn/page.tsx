'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
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
  
  const ROUND_SIZE = 8;
  const MASTERY_THRESHOLD = 2; // correct answers in separate rounds to master

  // Session state: one round at a time (Quizlet-style)
  const [currentQuestion, setCurrentQuestion] = useState<LearnQuestion | null>(null);
  const [roundCards, setRoundCards] = useState<FlashcardWithMastery[]>([]); // Cards in current round only
  const [roundCardsAnswered, setRoundCardsAnswered] = useState<Set<string>>(new Set()); // CardIds we've already shown this round
  
  // Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Session stats
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showRoundSummary, setShowRoundSummary] = useState(false); // After each round → summary page
  const [sessionComplete, setSessionComplete] = useState(false); // All cards mastered (optional)
  const [roundStartMastery, setRoundStartMastery] = useState<{ [cardId: string]: MasteryStatus }>({}); // Status at round start for session breakdown

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

  // Initialize mastery for a card (single state: new | learning | mastered)
  const initializeMastery = (cardId: string): FlashcardMastery => ({
    status: 'new',
    correctStreak: 0,
    lastReviewedAt: null,
  });

  // Migrate old format to new format (status, correctStreak, lastReviewedAt)
  const normalizeMastery = (raw: unknown): FlashcardMastery => {
    if (raw && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      if (typeof o.status === 'string' && (o.status === 'new' || o.status === 'learning' || o.status === 'mastered') &&
          typeof o.correctStreak === 'number' && (o.lastReviewedAt === null || typeof o.lastReviewedAt === 'string')) {
        return {
          status: o.status as MasteryStatus,
          correctStreak: o.correctStreak,
          lastReviewedAt: o.lastReviewedAt as string | null,
        };
      }
      // Old format: mastery_level, is_mastered, last_reviewed_at
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

  // Load mastery data from localStorage (new format only after save)
  const loadMasteryData = (studySetId: string): { [cardId: string]: FlashcardMastery } => {
    try {
      const saved = localStorage.getItem(`flashcard-mastery-${studySetId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as { [cardId: string]: unknown };
        const result: { [cardId: string]: FlashcardMastery } = {};
        for (const [id, val] of Object.entries(parsed)) {
          result[id] = normalizeMastery(val);
        }
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
    setLoading(false);
    if (cardsWithMastery.length === 0) return;
    const nonMasteredCount = cardsWithMastery.filter(c => c.mastery?.status !== 'mastered').length;
    if (nonMasteredCount === 0) {
      setSessionComplete(true);
      setShowSetup(false);
    }
  };

  // Build next round: mix New + Learning first, show Mastered rarely (Quizlet-style)
  const buildRound = (): FlashcardWithMastery[] => {
    const newAndLearning = cardsWithMastery.filter(c => c.mastery?.status === 'new' || c.mastery?.status === 'learning');
    const mastered = cardsWithMastery.filter(c => c.mastery?.status === 'mastered');
    const pool = [...newAndLearning];
    if (pool.length < ROUND_SIZE && mastered.length > 0) {
      const need = Math.min(ROUND_SIZE - pool.length, Math.max(1, Math.floor(mastered.length * 0.2)));
      const shuffled = [...mastered].sort(() => Math.random() - 0.5);
      pool.push(...shuffled.slice(0, need));
    }
    const size = Math.min(ROUND_SIZE, pool.length);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, size);
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

  // Get next card in round (optional answered set to use instead of state, for same-tick updates)
  const getNextInRound = (answeredOverride?: Set<string>): FlashcardWithMastery | null => {
    const answered = answeredOverride ?? roundCardsAnswered;
    const remaining = roundCards.filter(c => !answered.has(c.cardId));
    if (remaining.length === 0) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  };

  // Generate next question (round-based). Pass updated answered set when calling right after marking one answered.
  const generateNextQuestion = (answeredAfterThis?: Set<string>) => {
    const nextCard = getNextInRound(answeredAfterThis);
    if (nextCard) {
      createQuestion(nextCard);
      return;
    }
    setShowRoundSummary(true);
    setCurrentQuestion(null);
  };

  // Create a question from a card
  const createQuestion = (card: FlashcardWithMastery) => {
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
      options = generateMultipleChoiceOptions(correctAnswer, cardsWithMastery);
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

  // Handle answer submission (Know = correct). Typed answers use semantic evaluation.
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    let correct = false;
    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedOption === currentQuestion.correctAnswer;
    } else {
      const trimmed = userAnswer.trim();
      if (!trimmed) {
        correct = false;
      } else {
        const exactMatch = trimmed.toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
        if (exactMatch) {
          correct = true;
        } else {
          try {
            const res = await fetch('/api/evaluate-answer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: currentQuestion.card.front,
                expectedConcept: currentQuestion.correctAnswer,
                studentAnswer: trimmed,
              }),
            });
            const data = await res.json();
            if (data.success && data.result === 'correct') correct = true;
          } catch {
            correct = false;
          }
        }
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    if (correct) setCorrectAnswers(prev => prev + 1);
    updateMastery(currentQuestion.card, correct);
  };

  // Don't know = treat as incorrect, show correct answer, update mastery (→ Learning, streak 0)
  const handleDontKnow = () => {
    if (!currentQuestion || showFeedback) return;
    setIsCorrect(false);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    updateMastery(currentQuestion.card, false);
  };

  // Update mastery after answer (strict Quizlet-style: one state only)
  const updateMastery = (card: FlashcardWithMastery, isCorrect: boolean) => {
    const studySetId = params.id as string;
    const cardId = card.cardId;

    setCardsWithMastery(prev => {
      const currentCard = prev.find(c => c.cardId === cardId);
      const current = currentCard?.mastery || initializeMastery(cardId);
      const updatedMastery: FlashcardMastery = { ...current, lastReviewedAt: new Date().toISOString() };

      if (isCorrect) {
        // Know: increase streak; master only after 2–3 correct in separate rounds
        updatedMastery.correctStreak = (current.correctStreak || 0) + 1;
        if (current.status === 'new') updatedMastery.status = 'learning';
        if (updatedMastery.correctStreak >= MASTERY_THRESHOLD) updatedMastery.status = 'mastered';
      } else {
        // Don't know: → Learning, reset streak (including if was Mastered)
        updatedMastery.status = 'learning';
        updatedMastery.correctStreak = 0;
      }

      const masteryData = loadMasteryData(studySetId);
      masteryData[cardId] = updatedMastery;
      saveMasteryData(studySetId, masteryData);
      return prev.map(c => (c.cardId === cardId ? { ...c, mastery: updatedMastery } : c));
    });
  };

  // Move to next question after feedback (mark card answered this round, then next or summary)
  const handleNext = () => {
    if (!currentQuestion) return;
    const nextAnswered = new Set(roundCardsAnswered).add(currentQuestion.card.cardId);
    setRoundCardsAnswered(nextAnswered);
    generateNextQuestion(nextAnswered);
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

  // Handle starting the session after setup (build first round, snapshot mastery for summary)
  const handleStartSession = () => {
    setShowSetup(false);
    setSessionStartTime(new Date());
    const round = buildRound();
    if (round.length === 0) {
      setSessionComplete(true);
      return;
    }
    setRoundCards(round);
    setRoundCardsAnswered(new Set());
    const startSnapshot: { [cardId: string]: MasteryStatus } = {};
    round.forEach(c => { startSnapshot[c.cardId] = (c.mastery?.status ?? 'new') as MasteryStatus; });
    setRoundStartMastery(startSnapshot);
    setShowRoundSummary(false);
    const first = round[Math.floor(Math.random() * round.length)];
    createQuestion(first);
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
    const masteredCount = cardsWithMastery.filter(c => c.mastery?.status === 'mastered').length;
    const totalCount = cardsWithMastery.length;
    const availableCount = cardsWithMastery.filter(c => c.mastery?.status !== 'mastered').length;
    
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

  // Progress Summary (after each round) — Quizlet-style
  const handleContinueLearning = () => {
    setShowRoundSummary(false);
    const round = buildRound();
    if (round.length === 0) {
      setSessionComplete(true);
      return;
    }
    setRoundCards(round);
    setRoundCardsAnswered(new Set());
    const startSnapshot: { [cardId: string]: MasteryStatus } = {};
    round.forEach(c => { startSnapshot[c.cardId] = (c.mastery?.status ?? 'new') as MasteryStatus; });
    setRoundStartMastery(startSnapshot);
    const first = round[Math.floor(Math.random() * round.length)];
    createQuestion(first);
  };

  const handleReviewLearning = () => {
    setShowRoundSummary(false);
    const learning = cardsWithMastery.filter(c => c.mastery?.status === 'learning');
    if (learning.length === 0) {
      handleContinueLearning();
      return;
    }
    const round = learning.length <= ROUND_SIZE ? learning : [...learning].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    setRoundCards(round);
    setRoundCardsAnswered(new Set());
    const startSnapshot: { [cardId: string]: MasteryStatus } = {};
    round.forEach(c => { startSnapshot[c.cardId] = 'learning'; });
    setRoundStartMastery(startSnapshot);
    const first = round[Math.floor(Math.random() * round.length)];
    createQuestion(first);
  };

  if (showRoundSummary) {
    const totalCount = cardsWithMastery.length;
    const masteredCount = cardsWithMastery.filter(c => c.mastery?.status === 'mastered').length;
    const progressPercent = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
    const newLearned = roundCards.filter(c => roundStartMastery[c.cardId] === 'new').length;
    const stillLearning = roundCards.filter(c => cardsWithMastery.find(x => x.cardId === c.cardId)?.mastery?.status === 'learning').length;
    const masteredThisSession = roundCards.filter(c => cardsWithMastery.find(x => x.cardId === c.cardId)?.mastery?.status === 'mastered' && roundStartMastery[c.cardId] !== 'mastered').length;

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
        <main className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Progress Summary</h1>

            {/* Overall Progress */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Overall Progress</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{masteredCount} of {totalCount} terms mastered</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Session Breakdown */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{newLearned}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New cards learned</div>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stillLearning}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Still learning</div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{masteredThisSession}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mastered this session</div>
              </div>
            </div>

            {/* Term Review List */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Term Review</h2>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                {cardsWithMastery.map((card) => {
                  const status = card.mastery?.status ?? 'new';
                  const badge = status === 'mastered' ? '🟢 Mastered' : status === 'learning' ? '🟡 Learning' : '🔵 New';
                  const badgeClass = status === 'mastered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : status === 'learning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                  return (
                    <div key={card.cardId} className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{card.front}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.back}</div>
                        </div>
                        <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${badgeClass}`}>{badge}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleContinueLearning} className="flex-1 bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Continue learning
              </button>
              <button onClick={handleReviewLearning} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Review Learning cards
              </button>
              <Link href={`/my-study-sets/${params.id}`} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Exit to dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (sessionComplete) {
    const masteredCount = cardsWithMastery.filter(c => c.mastery?.status === 'mastered').length;
    const totalCount = cardsWithMastery.length;
    const progressPercent = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">All set!</h1>
              <p className="text-gray-600 dark:text-gray-400">You&apos;ve mastered all {totalCount} terms in this set.</p>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>{masteredCount} / {totalCount} mastered</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <Link href={`/my-study-sets/${params.id}`} className="block w-full text-center bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Back to Study Set
            </Link>
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

  // Active round: progress bar = mastered / total only
  const masteredCount = cardsWithMastery.filter(c => c.mastery?.status === 'mastered').length;
  const totalCount = cardsWithMastery.length;
  const progressPercent = totalCount > 0 
    ? (masteredCount / totalCount) * 100
    : 0;

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
      <main className="max-w-6xl mx-auto px-8 py-12 flex-1 flex flex-col">
        {/* Fixed-size rectangle: same dimensions for every question */}
        <div className="w-full h-[min(72vh,680px)] min-h-[min(72vh,680px)] bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
          {/* Question */}
          <div className="mb-8 flex-shrink-0">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0 pt-2">
            {!showFeedback ? (
              <>
                <button
                  onClick={handleDontKnow}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                >
                  Don&apos;t know
                </button>
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
              </>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </main>
      </div>
    </AppLayout>
  );
}

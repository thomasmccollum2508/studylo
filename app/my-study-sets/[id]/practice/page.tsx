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

interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'written';
  prompt: string;
  promptType: 'term' | 'definition';
  correctAnswer: string;
  options?: string[]; // For multiple choice
  correctIndex?: number; // For multiple choice
  isTrue?: boolean; // For true/false
  matchingPairs?: { term: string; definition: string }[]; // For matching
  userAnswer?: string; // For written questions
  userMatching?: { [key: string]: string }; // For matching questions
}

interface TestOptions {
  questionCount: number;
  answerWith: 'both' | 'terms' | 'definitions';
  trueFalse: boolean;
  multipleChoice: boolean;
  matching: boolean;
  written: boolean;
}

export default function PracticeTest() {
  const params = useParams();
  const router = useRouter();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [testOptions, setTestOptions] = useState<TestOptions>({
    questionCount: 20,
    answerWith: 'both',
    trueFalse: false,
    multipleChoice: true,
    matching: false,
    written: false,
  });
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null | string | boolean | { [key: string]: string } }>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [writtenResults, setWrittenResults] = useState<Record<string, boolean>>({});
  const [gradingWritten, setGradingWritten] = useState(false);

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
          try {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFlashcards(parsed);
            }
          } catch (e) {
            console.error('Error parsing flashcards:', e);
          }
        }
      } catch (error) {
        console.error('Error loading study set:', error);
        router.push('/my-study-sets');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadStudySet();
    }
  }, [params.id, router]);

  const generateQuestions = () => {
    if (flashcards.length === 0) return;

    const generatedQuestions: TestQuestion[] = [];
    const maxQuestions = Math.min(testOptions.questionCount, flashcards.length);
    
    // Determine which question types are selected
    const selectedTypes: ('multiple-choice' | 'true-false' | 'matching' | 'written')[] = [];
    if (testOptions.multipleChoice) selectedTypes.push('multiple-choice');
    if (testOptions.trueFalse) selectedTypes.push('true-false');
    if (testOptions.matching) selectedTypes.push('matching');
    if (testOptions.written) selectedTypes.push('written');

    if (selectedTypes.length === 0) return;

    // Shuffle flashcards
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    
    // Calculate questions per type (evenly distributed)
    const questionsPerType = Math.floor(maxQuestions / selectedTypes.length);
    const remainder = maxQuestions % selectedTypes.length;
    
    let cardIndex = 0;
    let questionIdCounter = 0;

    // Generate questions for each type
    selectedTypes.forEach((type, typeIndex) => {
      const countForThisType = questionsPerType + (typeIndex < remainder ? 1 : 0);
      
      for (let i = 0; i < countForThisType && cardIndex < shuffled.length; i++) {
        const card = shuffled[cardIndex];
        cardIndex++;

        // Determine prompt type based on answerWith option
        let promptType: 'term' | 'definition' = 'definition';
        let prompt = '';
        let correctAnswer = '';

        if (testOptions.answerWith === 'terms') {
          promptType = 'definition';
          prompt = card.back;
          correctAnswer = card.front;
        } else if (testOptions.answerWith === 'definitions') {
          promptType = 'term';
          prompt = card.front;
          correctAnswer = card.back;
        } else {
          // Both - randomly choose
          const useDefinition = Math.random() > 0.5;
          if (useDefinition) {
            promptType = 'definition';
            prompt = card.back;
            correctAnswer = card.front;
          } else {
            promptType = 'term';
            prompt = card.front;
            correctAnswer = card.back;
          }
        }

        if (type === 'multiple-choice') {
          // Generate multiple choice question
          const otherCards = flashcards.filter(c => c !== card);
          const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
          const wrongAnswers = shuffledOthers.slice(0, 3).map(c => 
            promptType === 'definition' ? c.front : c.back
          );
          
          const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
          const correctIndex = allOptions.indexOf(correctAnswer);

          generatedQuestions.push({
            id: `q-${questionIdCounter++}`,
            type: 'multiple-choice',
            prompt,
            promptType,
            correctAnswer,
            options: allOptions,
            correctIndex,
          });
        } else if (type === 'true-false') {
          // Generate true/false question
          // Randomly decide if the statement is true or false
          const isTrue = Math.random() > 0.5;
          let trueFalsePrompt = '';
          
          if (isTrue) {
            // True statement: "X is Y" format
            trueFalsePrompt = `${promptType === 'term' ? prompt : correctAnswer} is ${promptType === 'term' ? correctAnswer : prompt}`;
          } else {
            // False statement: use a wrong answer
            const otherCards = flashcards.filter(c => c !== card);
            if (otherCards.length > 0) {
              const wrongCard = otherCards[Math.floor(Math.random() * otherCards.length)];
              const wrongAnswer = promptType === 'definition' ? wrongCard.front : wrongCard.back;
              trueFalsePrompt = `${promptType === 'term' ? prompt : wrongAnswer} is ${promptType === 'term' ? wrongAnswer : prompt}`;
            } else {
              // Fallback if no other cards
              trueFalsePrompt = `${promptType === 'term' ? prompt : correctAnswer} is ${promptType === 'term' ? correctAnswer : prompt}`;
              // Make it true if we can't generate a false statement
            }
          }

          generatedQuestions.push({
            id: `q-${questionIdCounter++}`,
            type: 'true-false',
            prompt: trueFalsePrompt,
            promptType,
            correctAnswer: isTrue ? 'True' : 'False',
            isTrue,
          });
        } else if (type === 'matching') {
          // Generate matching question - need at least 4 cards for good matching
          // Check if we have enough cards remaining
          if (cardIndex + 3 < shuffled.length) {
            const matchingCards = shuffled.slice(cardIndex, Math.min(cardIndex + 4, shuffled.length));
            if (matchingCards.length >= 4) {
              const pairs = matchingCards.slice(0, 4).map(c => ({
                term: c.front,
                definition: c.back,
              }));
              
              generatedQuestions.push({
                id: `q-${questionIdCounter++}`,
                type: 'matching',
                prompt: 'Match each term with its definition',
                promptType: 'term',
                correctAnswer: '', // Not used for matching
                matchingPairs: pairs,
              });
              
              // Skip the next 3 cards since we used them for matching
              cardIndex += 3;
            } else {
              // Not enough cards for matching, skip this question
              cardIndex--;
            }
          } else {
            // Not enough cards remaining, skip this question
            cardIndex--;
          }
        } else if (type === 'written') {
          // Generate written question
          generatedQuestions.push({
            id: `q-${questionIdCounter++}`,
            type: 'written',
            prompt,
            promptType,
            correctAnswer,
          });
        }
      }
    });

    // Shuffle all questions
    const finalQuestions = generatedQuestions.sort(() => Math.random() - 0.5);
    
    setQuestions(finalQuestions);
    setShowSetup(false);
    setTestStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    // Auto-advance to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await calculateScore();
      }
    }, 500);
  };

  const handleTrueFalse = (questionId: string, answer: boolean) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
    // Auto-advance to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await calculateScore();
      }
    }, 500);
  };

  const handleMatching = (questionId: string, term: string, definition: string) => {
    setSelectedAnswers(prev => {
      const current = prev[questionId] as { [key: string]: string } || {};
      return {
        ...prev,
        [questionId]: {
          ...current,
          [term]: definition,
        },
      };
    });
  };

  const handleWrittenAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleDontKnow = (questionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: -1, // -1 means "don't know"
    }));
    // Auto-advance to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await calculateScore();
      }
    }, 500);
  };

  const evaluateWrittenAnswer = async (prompt: string, expectedConcept: string, studentAnswer: string): Promise<boolean> => {
    const trimmed = studentAnswer.trim();
    if (!trimmed) return false;
    if (trimmed.toLowerCase() === expectedConcept.trim().toLowerCase()) return true;
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          expectedConcept,
          studentAnswer: trimmed,
        }),
      });
      const data = await res.json();
      return data.success && data.result === 'correct';
    } catch {
      return false;
    }
  };

  const calculateScore = async () => {
    let correct = 0;
    let incorrect = 0;
    const newWrittenResults: Record<string, boolean> = {};

    const writtenQuestions = questions.filter(q => q.type === 'written');
    if (writtenQuestions.length > 0) {
      setGradingWritten(true);
      for (const q of writtenQuestions) {
        const selected = selectedAnswers[q.id];
        const userAnswer = typeof selected === 'string' ? selected : '';
        const isCorrect = await evaluateWrittenAnswer(q.prompt, q.correctAnswer, userAnswer);
        newWrittenResults[q.id] = isCorrect;
        if (isCorrect) correct++; else incorrect++;
      }
      setWrittenResults(newWrittenResults);
      setGradingWritten(false);
    }

    questions.forEach(q => {
      if (q.type === 'written') {
        // Already counted above
        return;
      }
      const selected = selectedAnswers[q.id];

      if (q.type === 'multiple-choice') {
        if (selected !== null && selected !== undefined && selected !== -1) {
          if (selected === q.correctIndex) {
            correct++;
          } else {
            incorrect++;
          }
        } else {
          incorrect++;
        }
      } else if (q.type === 'true-false') {
        if (selected !== null && selected !== undefined && selected !== -1) {
          const isCorrect = (selected === true && q.isTrue) || (selected === false && !q.isTrue);
          if (isCorrect) {
            correct++;
          } else {
            incorrect++;
          }
        } else {
          incorrect++;
        }
      } else if (q.type === 'matching') {
        if (selected && typeof selected === 'object' && q.matchingPairs) {
          let allCorrect = true;
          q.matchingPairs.forEach(pair => {
            const userMatch = (selected as { [key: string]: string })[pair.term];
            if (userMatch !== pair.definition) {
              allCorrect = false;
            }
          });
          if (allCorrect && Object.keys(selected as object).length === q.matchingPairs.length) {
            correct++;
          } else {
            incorrect++;
          }
        } else {
          incorrect++;
        }
      }
    });

    setCorrectCount(correct);
    setIncorrectCount(incorrect);
    setScore(correct);

    // Calculate time taken
    if (testStartTime) {
      const elapsed = Date.now() - testStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      if (minutes > 0) {
        setTimeTaken(`${minutes} min`);
      } else {
        setTimeTaken(`${seconds} sec`);
      }
    }

    // Save quiz result to quizzes page (localStorage keyed by user)
    if (studySet && questions.length > 0) {
      const key = `quizzes-${studySet.user_id}`;
      const existing = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const quizzes: { id: string; studySetId: string; title: string; questions: number; score: number; status: string; completedAt: string }[] = existing ? JSON.parse(existing) : [];
      const percentage = Math.round((correct / questions.length) * 100);
      quizzes.unshift({
        id: crypto.randomUUID(),
        studySetId: params.id as string,
        title: studySet.title,
        questions: questions.length,
        score: percentage,
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(quizzes));
      }
    }

    setShowResults(true);
  };

  const goToNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await calculateScore();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!studySet || flashcards.length === 0) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No flashcards available for this study set.</p>
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

  const maxQuestions = flashcards.length;
  const currentQuestion = questions[currentQuestionIndex];
  const nextQuestion = questions[currentQuestionIndex + 1];
  const answeredCount = questions.filter(q => {
    const answer = selectedAnswers[q.id];
    if (answer === null || answer === undefined || answer === -1) return false;
    if (q.type === 'matching' && typeof answer === 'object') {
      return Object.keys(answer).length > 0;
    }
    if (q.type === 'written' && typeof answer === 'string') {
      return answer.trim().length > 0;
    }
    return true;
  }).length;

  // Setup Modal
  if (showSetup) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-lg mx-4 border border-gray-200 dark:border-gray-700 relative">
          {/* Close Button */}
          <button
            onClick={() => router.push(`/my-study-sets/${params.id}`)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Study Set Icon */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0055FF" strokeWidth="2"/>
                <path d="M8 7H16" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12H16" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 17H12" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{studySet.title}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Set up your test</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Questions Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Questions (max {maxQuestions})
              </label>
              <input
                type="number"
                min="1"
                max={maxQuestions}
                value={testOptions.questionCount}
                onChange={(e) => setTestOptions(prev => ({
                  ...prev,
                  questionCount: Math.min(Math.max(1, parseInt(e.target.value) || 1), maxQuestions),
                }))}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            {/* Answer With */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Answer with
              </label>
              <select
                value={testOptions.answerWith}
                onChange={(e) => setTestOptions(prev => ({
                  ...prev,
                  answerWith: e.target.value as 'both' | 'terms' | 'definitions',
                }))}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
              >
                <option value="both">Both</option>
                <option value="terms">Terms</option>
                <option value="definitions">Definitions</option>
              </select>
            </div>

            {/* Question Types */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Types
              </label>
              
              {/* True/False */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">True/False</span>
                <button
                  onClick={() => setTestOptions(prev => ({ ...prev, trueFalse: !prev.trueFalse }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    testOptions.trueFalse ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      testOptions.trueFalse ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Multiple Choice */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Multiple choice</span>
                <button
                  onClick={() => setTestOptions(prev => ({ ...prev, multipleChoice: !prev.multipleChoice }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    testOptions.multipleChoice ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      testOptions.multipleChoice ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Matching */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Matching</span>
                <button
                  onClick={() => setTestOptions(prev => ({ ...prev, matching: !prev.matching }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    testOptions.matching ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      testOptions.matching ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Written */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Written</span>
                <button
                  onClick={() => setTestOptions(prev => ({ ...prev, written: !prev.written }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    testOptions.written ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      testOptions.written ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Start Test Button */}
            <button
              onClick={generateQuestions}
              disabled={!testOptions.multipleChoice && !testOptions.trueFalse && !testOptions.matching && !testOptions.written}
              className="w-full bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start test
            </button>
          </div>
        </div>
        </div>
      </AppLayout>
    );
  }

  // Results Screen
  if (showResults) {
    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const reviewQuestion = questions[reviewQuestionIndex];
    const selectedAnswer = reviewQuestion ? selectedAnswers[reviewQuestion.id] : null;
    
    // Determine if answer is correct based on question type
    let isCorrect = false;
    let isIncorrect = false;
    
    if (reviewQuestion && selectedAnswer !== null && selectedAnswer !== undefined && selectedAnswer !== -1) {
      if (reviewQuestion.type === 'multiple-choice') {
        isCorrect = selectedAnswer === reviewQuestion.correctIndex;
        isIncorrect = !isCorrect;
      } else if (reviewQuestion.type === 'true-false') {
        isCorrect = (selectedAnswer === true && reviewQuestion.isTrue) || (selectedAnswer === false && !reviewQuestion.isTrue);
        isIncorrect = !isCorrect;
      } else if (reviewQuestion.type === 'matching') {
        if (selectedAnswer && typeof selectedAnswer === 'object' && reviewQuestion.matchingPairs) {
          isCorrect = reviewQuestion.matchingPairs.every(pair => 
            (selectedAnswer as { [key: string]: string })[pair.term] === pair.definition
          ) && Object.keys(selectedAnswer as object).length === reviewQuestion.matchingPairs.length;
          isIncorrect = !isCorrect;
        } else {
          isIncorrect = true;
        }
      } else if (reviewQuestion.type === 'written') {
        if (writtenResults[reviewQuestion.id] !== undefined) {
          isCorrect = writtenResults[reviewQuestion.id];
          isIncorrect = !isCorrect;
        } else if (selectedAnswer && typeof selectedAnswer === 'string') {
          isCorrect = selectedAnswer.trim().toLowerCase() === reviewQuestion.correctAnswer.trim().toLowerCase();
          isIncorrect = !isCorrect;
        } else {
          isIncorrect = true;
        }
      }
    } else if (selectedAnswer === -1) {
      isIncorrect = true;
    } else {
      isIncorrect = true;
    }

    return (
      <AppLayout>
        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-4 shrink-0">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {correctCount} / {questions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{studySet.title}</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8 flex-1">
          {/* Celebration Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Nice! You're really getting this stuff.
            </h1>
            <div className="text-6xl">🎉</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{timeTaken || '0 sec'}</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{percentage}%</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Correct</span>
                      <div className="w-12 h-8 rounded-full border-2 border-green-600 dark:border-green-400 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{correctCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Incorrect</span>
                      <div className="w-12 h-8 rounded-full border-2 border-orange-600 dark:border-orange-400 flex items-center justify-center">
                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{incorrectCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Next steps</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setShowSetup(true);
                    setQuestions([]);
                    setSelectedAnswers({});
                    setCurrentQuestionIndex(0);
                    setReviewQuestionIndex(0);
                    setScore(0);
                    setCorrectCount(0);
                    setIncorrectCount(0);
                    setTimeTaken('');
                    setTestStartTime(null);
                    setWrittenResults({});
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0055FF" strokeWidth="2"/>
                        <path d="M8 7H16" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 12H16" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 17H12" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0055FF] dark:text-blue-400">Take a new test</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Try another test to boost your confidence.</p>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 group-hover:text-[#0055FF]">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <Link
                  href={`/my-study-sets/${params.id}/flashcards`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0055FF" strokeWidth="2"/>
                        <path d="M6 3H18" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0055FF] dark:text-blue-400">Review with Flashcards</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Study each term as a flashcard to improve recall.</p>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 group-hover:text-[#0055FF]">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Your Answers Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your answers</h2>
            
            {reviewQuestion && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {reviewQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 
                       reviewQuestion.type === 'true-false' ? 'True/False' :
                       reviewQuestion.type === 'matching' ? 'Matching' :
                       reviewQuestion.type === 'written' ? 'Written' : reviewQuestion.promptType}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {reviewQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <p className="text-lg text-gray-900 dark:text-gray-100 mb-4">{reviewQuestion.prompt}</p>
                
                {/* Show selected answer and correct answer */}
                <div className="space-y-3">
                  {/* Multiple Choice */}
                  {reviewQuestion.type === 'multiple-choice' && selectedAnswer !== null && selectedAnswer !== undefined && selectedAnswer !== -1 && reviewQuestion.options && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                        : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✗ Your answer'}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100">{reviewQuestion.options[selectedAnswer as number]}</p>
                    </div>
                  )}
                  
                  {/* True/False */}
                  {reviewQuestion.type === 'true-false' && selectedAnswer !== null && selectedAnswer !== undefined && selectedAnswer !== -1 && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                        : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✗ Your answer'}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAnswer === true ? 'True' : 'False'}</p>
                    </div>
                  )}
                  
                  {/* Matching */}
                  {reviewQuestion.type === 'matching' && selectedAnswer && typeof selectedAnswer === 'object' && reviewQuestion.matchingPairs && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                        : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {isCorrect ? '✓ All matches correct' : '✗ Your matches'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {reviewQuestion.matchingPairs.map((pair, idx) => {
                          const userMatch = (selectedAnswer as { [key: string]: string })[pair.term];
                          const isMatchCorrect = userMatch === pair.definition;
                          return (
                            <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded border">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{pair.term}</p>
                              <p className={`text-sm ${isMatchCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                Your match: {userMatch || '(not matched)'}
                              </p>
                              {!isMatchCorrect && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  Correct: {pair.definition}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Written */}
                  {reviewQuestion.type === 'written' && selectedAnswer && typeof selectedAnswer === 'string' && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                        : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✗ Your answer'}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAnswer}</p>
                    </div>
                  )}
                  
                  {/* Don't know */}
                  {selectedAnswer === -1 && (
                    <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Don't know</span>
                    </div>
                  )}
                  
                  {/* Show correct answer if incorrect */}
                  {!isCorrect && reviewQuestion.type !== 'matching' && (
                    <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">✓ Correct answer</span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100">{reviewQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                disabled={reviewQuestionIndex === 0}
                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setReviewQuestionIndex(Math.min(questions.length - 1, reviewQuestionIndex + 1))}
                disabled={reviewQuestionIndex === questions.length - 1}
                className="px-6 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </main>
        </div>
      </AppLayout>
    );
  }

  // Test Interface
  if (gradingWritten) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#0055FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Grading written answers...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-10 py-4 sticky top-0 z-10 shrink-0">
        <div className="w-full flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[#0055FF] dark:text-blue-400 font-medium">
              <span>Test</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Center */}
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {answeredCount} / {questions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{studySet.title}</div>
            {currentQuestion && (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
              <button
                onClick={() => handleDontKnow(currentQuestion.id)}
                className="text-sm text-[#0055FF] dark:text-blue-400 hover:underline mt-1"
              >
                Don't know?
              </button>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-[#0055FF] dark:text-blue-400 rounded-lg font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Print test
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <Link
              href={`/my-study-sets/${params.id}`}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - full width so questions cover the page */}
      <main className="w-full flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8">
        {currentQuestion && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 mb-4">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 
                   currentQuestion.type === 'true-false' ? 'True/False' :
                   currentQuestion.type === 'matching' ? 'Matching' :
                   currentQuestion.type === 'written' ? 'Written' : currentQuestion.promptType}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Prompt */}
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
              {currentQuestion.prompt}
            </p>

            {/* Answer Options - Multiple Choice */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose an answer</p>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#0055FF] bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer Options - True/False */}
            {currentQuestion.type === 'true-false' && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose an answer</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTrueFalse(currentQuestion.id, true)}
                    className={`p-6 rounded-lg border-2 text-center transition-all font-medium ${
                      selectedAnswers[currentQuestion.id] === true
                        ? 'border-[#0055FF] bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    True
                  </button>
                  <button
                    onClick={() => handleTrueFalse(currentQuestion.id, false)}
                    className={`p-6 rounded-lg border-2 text-center transition-all font-medium ${
                      selectedAnswers[currentQuestion.id] === false
                        ? 'border-[#0055FF] bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    False
                  </button>
                </div>
              </div>
            )}

            {/* Answer Options - Matching */}
            {currentQuestion.type === 'matching' && currentQuestion.matchingPairs && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Match each term with its definition</p>
                <div className="space-y-4">
                  {currentQuestion.matchingPairs.map((pair, index) => {
                    const userMatching = selectedAnswers[currentQuestion.id] as { [key: string]: string } || {};
                    const selectedDefinition = userMatching[pair.term];
                    const availableDefinitions = currentQuestion.matchingPairs!.map(p => p.definition);
                    
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{pair.term}</p>
                          <select
                            value={selectedDefinition || ''}
                            onChange={(e) => handleMatching(currentQuestion.id, pair.term, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                          >
                            <option value="">Select definition...</option>
                            {availableDefinitions.map((def, defIndex) => (
                              <option key={defIndex} value={def}>{def}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer Options - Written */}
            {currentQuestion.type === 'written' && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Type your answer</p>
                <textarea
                  value={(selectedAnswers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleWrittenAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700 min-h-[120px] resize-y"
                />
              </div>
            )}

            {/* Don't Know - Only show for multiple choice and true/false */}
            {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
              <div className="text-center">
                <button
                  onClick={() => handleDontKnow(currentQuestion.id)}
                  className="text-sm text-[#0055FF] dark:text-blue-400 hover:underline"
                >
                  Don't know?
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Question Preview */}
        {nextQuestion && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize text-sm">
                  {nextQuestion.promptType}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentQuestionIndex + 2} of {questions.length}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {nextQuestion.prompt}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="w-full flex items-center justify-between mt-8">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={goToNextQuestion}
            className="px-6 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next'}
          </button>
        </div>
      </main>
      </div>
    </AppLayout>
  );
}

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

interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'written';
  prompt: string;
  promptType: 'term' | 'definition';
  correctAnswer: string;
  options: string[];
  correctIndex: number;
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
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null }>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);

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
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, maxQuestions);

    selectedCards.forEach((card, index) => {
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

      if (testOptions.multipleChoice) {
        // Generate multiple choice question
        const otherCards = flashcards.filter(c => c !== card);
        const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
        const wrongAnswers = shuffledOthers.slice(0, 3).map(c => 
          promptType === 'definition' ? c.front : c.back
        );
        
        const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        const correctIndex = allOptions.indexOf(correctAnswer);

        generatedQuestions.push({
          id: `q-${index}`,
          type: 'multiple-choice',
          prompt,
          promptType,
          correctAnswer,
          options: allOptions,
          correctIndex,
        });
      }
    });

    setQuestions(generatedQuestions);
    setShowSetup(false);
    setTestStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateScore();
      }
    }, 500);
  };

  const handleDontKnow = (questionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: -1, // -1 means "don't know"
    }));
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateScore();
      }
    }, 500);
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    
    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      if (selected !== null && selected !== undefined && selected !== -1) {
        if (selected === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        // Don't know or unanswered counts as incorrect
        incorrect++;
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
    
    setShowResults(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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

  if (!studySet || flashcards.length === 0) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
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
    );
  }

  const maxQuestions = flashcards.length;
  const currentQuestion = questions[currentQuestionIndex];
  const nextQuestion = questions[currentQuestionIndex + 1];
  const answeredCount = Object.keys(selectedAnswers).filter(
    key => selectedAnswers[key] !== null && selectedAnswers[key] !== undefined
  ).length;

  // Setup Modal
  if (showSetup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
    );
  }

  // Results Screen
  if (showResults) {
    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const reviewQuestion = questions[reviewQuestionIndex];
    const selectedAnswerIndex = reviewQuestion ? selectedAnswers[reviewQuestion.id] : null;
    const isCorrect = reviewQuestion && selectedAnswerIndex !== null && selectedAnswerIndex !== undefined && selectedAnswerIndex !== -1 && selectedAnswerIndex === reviewQuestion.correctIndex;
    const isIncorrect = reviewQuestion && selectedAnswerIndex !== null && selectedAnswerIndex !== undefined && selectedAnswerIndex !== -1 && selectedAnswerIndex !== reviewQuestion.correctIndex;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {correctCount} / {questions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{studySet.title}</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
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
                      {reviewQuestion.promptType}
                    </span>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V18M8 9V15M16 11V13M4 10C4 10 6 10 8 10C10 10 10 12 10 14C10 16 8 18 8 18M20 10C20 10 18 10 16 10C14 10 14 12 14 14C14 16 16 18 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {reviewQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <p className="text-lg text-gray-900 dark:text-gray-100 mb-4">{reviewQuestion.prompt}</p>
                
                {/* Show selected answer and correct answer */}
                <div className="space-y-3">
                  {selectedAnswerIndex !== null && selectedAnswerIndex !== undefined && selectedAnswerIndex !== -1 && (
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
                      <p className="text-gray-900 dark:text-gray-100">{reviewQuestion.options[selectedAnswerIndex]}</p>
                    </div>
                  )}
                  
                  {selectedAnswerIndex === -1 && (
                    <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Don't know</span>
                    </div>
                  )}
                  
                  {!isCorrect && (
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
    );
  }

  // Test Interface
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-10 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            {currentQuestion && (
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {currentQuestion && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 mb-4">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {currentQuestion.promptType}
                </span>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V18M8 9V15M16 11V13M4 10C4 10 6 10 8 10C10 10 10 12 10 14C10 16 8 18 8 18M20 10C20 10 18 10 16 10C14 10 14 12 14 14C14 16 16 18 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Prompt */}
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
              {currentQuestion.prompt}
            </p>

            {/* Answer Options */}
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

            {/* Don't Know */}
            <div className="text-center">
              <button
                onClick={() => handleDontKnow(currentQuestion.id)}
                className="text-sm text-[#0055FF] dark:text-blue-400 hover:underline"
              >
                Don't know?
              </button>
            </div>
          </div>
        )}

        {/* Next Question Preview */}
        {nextQuestion && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize text-sm">
                  {nextQuestion.promptType}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V18M8 9V15M16 11V13M4 10C4 10 6 10 8 10C10 10 10 12 10 14C10 16 8 18 8 18M20 10C20 10 18 10 16 10C14 10 14 12 14 14C14 16 16 18 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
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
        <div className="flex items-center justify-between mt-8">
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
  );
}

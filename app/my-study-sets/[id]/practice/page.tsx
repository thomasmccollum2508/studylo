'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';

interface PracticeQuestion {
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function PracticeQuestions() {
  const params = useParams();
  const router = useRouter();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [content, setContent] = useState<string>('');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
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
          // Check if questions already exist in localStorage
          const savedQuestions = localStorage.getItem(`practice-questions-${studySetId}`);
          if (savedQuestions) {
            setQuestions(JSON.parse(savedQuestions));
            setLoading(false);
          } else {
            // Generate questions
            await generateQuestions(savedContent, studySetId);
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

  const generateQuestions = async (notesContent: string, studySetId: string) => {
    try {
      setGenerating(true);
      
      // Strip HTML tags for AI processing
      const textContent = notesContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Limit content length
      const maxLength = 10000;
      const truncatedContent = textContent.length > maxLength 
        ? textContent.substring(0, maxLength) + '...'
        : textContent;

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: truncatedContent,
          count: 6, // Generate 6 questions
        }),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setQuestions(data.questions);
        // Save questions to localStorage
        localStorage.setItem(`practice-questions-${studySetId}`, JSON.stringify(data.questions));
      } else {
        console.error('Error generating questions:', data.error);
        // Create fallback questions
        createFallbackQuestions(truncatedContent);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Create fallback questions
      createFallbackQuestions(notesContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const createFallbackQuestions = (textContent: string) => {
    // Simple fallback: extract sentences and create basic questions
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const fallbackQuestions: PracticeQuestion[] = [];
    
    for (let i = 0; i < Math.min(6, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 30) {
        // Create a simple question from the sentence
        const words = sentence.split(' ');
        const keyWord = words.find(w => w.length > 5) || words[0];
        fallbackQuestions.push({
          question: `What is ${keyWord}?`,
          answer: sentence,
          difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
        });
      }
    }
    
    if (fallbackQuestions.length > 0) {
      setQuestions(fallbackQuestions);
    }
  };

  const toggleAnswer = (index: number) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedAnswers(newRevealed);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading || generating) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {generating ? 'Generating practice questions...' : 'Loading...'}
          </p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!studySet || questions.length === 0) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!content ? 'No content available to generate questions from.' : 'Unable to generate practice questions.'}
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

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswerRevealed = revealedAnswers.has(currentQuestionIndex);

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
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
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
        {/* Question */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentQuestion.question}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Difficulty: <span className="font-medium">{currentQuestion.difficulty}</span>
          </p>
        </div>

        {/* Answer Area */}
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8 min-h-[300px] flex items-center justify-center">
          {!isAnswerRevealed ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="blur-sm select-none">
                  <p className="text-gray-400 dark:text-gray-600 text-lg">
                    {currentQuestion.answer}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAnswer(currentQuestionIndex)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center gap-2 mx-auto shadow-sm"
              >
                Show example answer
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Answer:</h3>
                <button
                  onClick={() => toggleAnswer(currentQuestionIndex)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Hide answer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65661 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1757 15.0074 10.8016 14.8565C10.4276 14.7056 10.0867 14.4811 9.80078 14.1972C9.51489 13.9133 9.29038 13.5756 9.13943 13.2046C8.98847 12.8336 8.91435 12.4371 8.92144 12.0373C8.92854 11.6375 9.01673 11.2432 9.18068 10.8782C9.34463 10.5132 9.58103 10.1849 9.87587 9.91299" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {currentQuestion.answer}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Hint */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Use the arrows above to navigate between questions
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { stripMarkdownCodeFences } from '@/lib/utils/text';
import AppLayout from '@/components/AppLayout';

type Message = { role: 'user' | 'model'; text: string };

const SUGGESTIONS = [
  'Explain a key concept from my notes',
  'What are the main topics in this set?',
  'Give me a practice question on this material',
  'Summarise the most important points',
  'Help me understand a term from my flashcards',
];

function formatAiMessage(text: string) {
  return text.split(/\n\n+/).map((para, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = para;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
        }
        parts.push(<strong key={key++} className="font-semibold text-gray-900 dark:text-gray-100">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    return <p key={i} className="mb-2 last:mb-0">{parts}</p>;
  });
}

export default function StudySetAiChatPage() {
  const params = useParams();
  const studySetId = params.id as string;
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [studySetContext, setStudySetContext] = useState<{ title?: string; notesExcerpt?: string; terms?: { front: string; back: string }[] } | null>(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        if (!supabase) {
          setLoadingContext(false);
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoadingContext(false);
          return;
        }
        const { data: setData } = await supabase
          .from('study_sets')
          .select('*')
          .eq('id', studySetId)
          .eq('user_id', user.id)
          .single();
        if (setData) setStudySet(setData as StudySet);

        const savedContent = typeof window !== 'undefined' ? localStorage.getItem(`note-content-${studySetId}`) : null;
        const savedCards = typeof window !== 'undefined' ? localStorage.getItem(`flashcards-${studySetId}`) : null;
        const notesPlain = savedContent ? stripMarkdownCodeFences(savedContent).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
        const notesExcerpt = notesPlain.length > 12000 ? notesPlain.substring(0, 12000) + '…' : notesPlain;
        let terms: { front: string; back: string }[] = [];
        if (savedCards) {
          try {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed) && parsed.length > 0) {
              terms = parsed.map((c: { front?: string; back?: string }) => ({ front: c.front || '', back: c.back || '' }));
            }
          } catch {
            // ignore
          }
        }
        setStudySetContext({
          title: (setData as StudySet)?.title,
          notesExcerpt: notesExcerpt || undefined,
          terms: terms.length > 0 ? terms : undefined,
        });
      } catch {
        setStudySetContext(null);
      } finally {
        setLoadingContext(false);
      }
    }
    if (studySetId) load();
  }, [studySetId]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    const history = [...messages, userMessage].map((m) => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.text }],
    }));

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          studySetContext: studySetContext || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
    } catch {
      setError('Failed to send. Please try again.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [messages, loading, studySetContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const isEmpty = messages.length === 0 && !loading;

  if (loadingContext) {
    return (
      <AppLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-slate-50/80 to-white dark:from-gray-900 dark:to-gray-800/50 transition-colors duration-300">
        <header className="shrink-0 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/my-study-sets/${studySetId}`}
              className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Back to study set"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 shrink-0">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 9.5C17 13.09 13.64 16 9.5 16C8.22 16 7.02 15.63 6 15L2 16L3.5 12.5C2.37 11.48 1.5 10.08 1.5 8.5C1.5 4.91 4.86 2 9 2C13.14 2 17 4.91 17 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">AI Chat</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {studySet?.title ? `Chat about "${studySet.title}"` : 'Chat about this set\'s notes and topics'}
              </p>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 min-h-0">
          <div className="max-w-2xl mx-auto">
            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center mb-5">
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 9.5C17 13.09 13.64 16 9.5 16C8.22 16 7.02 15.63 6 15L2 16L3.5 12.5C2.37 11.48 1.5 10.08 1.5 8.5C1.5 4.91 4.86 2 9 2C13.14 2 17 4.91 17 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Chat about this study set</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                  Ask about the notes you uploaded and the topics in this set. The AI uses only this set&apos;s material.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex mb-5 animate-fadeIn ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white dark:bg-gray-700/80 border border-gray-200/80 dark:border-gray-600/80 text-gray-800 dark:text-gray-200 shadow-sm'
                  }`}
                >
                  {m.role === 'model' ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{formatAiMessage(m.text)}</div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-5 animate-fadeIn">
                <div className="rounded-2xl px-4 py-3 bg-white dark:bg-gray-700/80 border border-gray-200/80 dark:border-gray-600/80 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-4">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about this set's notes or topics..."
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/80 px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px] max-h-32 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 bottom-2.5 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
                  aria-label="Send"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10L18 2L10 18L9 11L2 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-center">Answers based on this study set · Enter to send</p>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

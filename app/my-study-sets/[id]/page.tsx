'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';
import { stripMarkdownCodeFences } from '@/lib/utils/text';
import AppLayout from '@/components/AppLayout';

interface FlashcardItem {
  front: string;
  back: string;
  image?: string;
}

export default function StudySetDetail() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [content, setContent] = useState<string>('');
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'outline' | 'quick-reference'>('outline');
  const [userName, setUserName] = useState<string>('');
  const [showStudyDropdown, setShowStudyDropdown] = useState(false);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showStudyDropdown && !target.closest('.study-menu-container')) {
        setShowStudyDropdown(false);
      }
    };

    if (showStudyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStudyDropdown]);

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

        const name = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';
        setUserName(name);

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

        // Get content from localStorage (AI-generated outline/summary)
        const savedContent = localStorage.getItem(`note-content-${studySetId}`);
        if (savedContent) {
          setContent(stripMarkdownCodeFences(savedContent));
        }

        // Get flashcards from localStorage (for manual sets or AI-generated cards)
        const savedCards = localStorage.getItem(`flashcards-${studySetId}`);
        if (savedCards) {
          try {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFlashcards(parsed);
            }
          } catch {
            // ignore invalid JSON
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  const handleDownloadPdf = () => {
    const hasOutlineContent = content && /<(?:\w+)/.test(content);
    let bodyHtml: string;
    let title = studySet?.title || 'Study Set Notes';

    if (hasOutlineContent) {
      bodyHtml = activeTab === 'quick-reference' ? generateQuickReference(content) : content;
    } else if (flashcards.length > 0) {
      title = `${studySet?.title || 'Study Set'} – Terms`;
      bodyHtml = `<ol style="list-style:decimal;margin-left:1.5rem;margin-bottom:1rem;">${flashcards
        .map(
          (card) =>
            `<li style="margin-bottom:1rem;"><strong>${escapeHtml(card.front)}</strong><p style="margin:0.25rem 0 0;color:#374151;">${escapeHtml(card.back)}</p></li>`
        )
        .join('')}</ol>`;
    } else {
      return;
    }

    const printStyles = `
      body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #111; line-height: 1.6; }
      h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
      .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 2rem; }
      h2 { font-size: 1.35rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
      h3 { font-size: 1.15rem; margin-top: 1rem; margin-bottom: 0.35rem; }
      p { margin-bottom: 0.75rem; }
      ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
      li { margin-bottom: 0.35rem; }
      strong { font-weight: 700; }
      @media print { body { padding: 1rem; } }
    `;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${printStyles}</style></head><body>
      <h1>${escapeHtml(title)}</h1>
      <p class="meta">${studySet?.created_at ? `Created ${formatDate(studySet.created_at)}` : ''} · StudyLo</p>
      <div class="content">${bodyHtml}</div>
      </body></html>`;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to download the PDF.');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.onafterprint = () => win.close();
    }, 250);
  };

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  const generateQuickReference = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    let quickRef = '';
    const processedElements = new Set<Element>();
    
    // Extract all headings (h2, h3) with their immediate content
    const headings = doc.querySelectorAll('h2, h3');
    headings.forEach((heading) => {
      const tagName = heading.tagName.toLowerCase();
      const text = heading.textContent?.trim() || '';
      if (text && !processedElements.has(heading)) {
        processedElements.add(heading);
        
        if (tagName === 'h2') {
          quickRef += `<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">${text}</h2>`;
        } else {
          quickRef += `<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">${text}</h3>`;
        }
        
        // Get the next sibling elements until the next heading
        let nextSibling = heading.nextElementSibling;
        let itemsAdded = 0;
        while (nextSibling && itemsAdded < 3) {
          const tag = nextSibling.tagName.toLowerCase();
          
          if (tag === 'h2' || tag === 'h3') {
            break; // Stop at next heading
          }
          
          if (tag === 'p' && !processedElements.has(nextSibling)) {
            const pText = nextSibling.textContent?.trim() || '';
            // Only include concise paragraphs (under 200 chars) or those with bold text
            if (pText && (pText.length < 200 || nextSibling.querySelector('strong'))) {
              processedElements.add(nextSibling);
              // Preserve HTML formatting (especially strong tags)
              const pHTML = nextSibling.innerHTML.trim();
              quickRef += `<p class="mb-3 text-gray-700 dark:text-gray-300">${pHTML}</p>`;
              itemsAdded++;
            }
          } else if ((tag === 'ul' || tag === 'ol') && !processedElements.has(nextSibling)) {
            const firstLevelItems = nextSibling.querySelectorAll(':scope > li');
            if (firstLevelItems.length > 0) {
              processedElements.add(nextSibling);
              quickRef += tag === 'ul' ? '<ul class="list-disc ml-6 mb-4">' : '<ol class="list-decimal ml-6 mb-4">';
              // Only take first 3-4 items for quick reference
              Array.from(firstLevelItems).slice(0, 4).forEach((item) => {
                const itemText = item.textContent?.trim() || '';
                if (itemText && itemText.length < 200) {
                  // Preserve HTML formatting in list items
                  const itemHTML = item.innerHTML.trim();
                  quickRef += `<li class="mb-2 text-gray-700 dark:text-gray-300">${itemHTML}</li>`;
                }
              });
              quickRef += tag === 'ul' ? '</ul>' : '</ol>';
              itemsAdded++;
            }
          }
          
          nextSibling = nextSibling.nextElementSibling;
        }
      }
    });
    
    // If no headings found, extract key points from paragraphs with bold text
    if (quickRef.length < 100) {
      const paragraphs = doc.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (processedElements.has(p)) return;
        
        const strongElements = p.querySelectorAll('strong');
        if (strongElements.length > 0) {
          const pText = p.textContent?.trim() || '';
          if (pText && pText.length < 250) {
            processedElements.add(p);
            // Preserve HTML formatting
            const pHTML = p.innerHTML.trim();
            quickRef += `<p class="mb-3 text-gray-700 dark:text-gray-300">${pHTML}</p>`;
          }
        }
      });
    }
    
    // Extract first-level list items if we still need more content
    if (quickRef.length < 200) {
      const lists = doc.querySelectorAll('ul, ol');
      lists.forEach((list) => {
        if (processedElements.has(list)) return;
        
        const firstLevelItems = list.querySelectorAll(':scope > li');
        if (firstLevelItems.length > 0) {
          processedElements.add(list);
          const tag = list.tagName.toLowerCase();
          quickRef += tag === 'ul' ? '<ul class="list-disc ml-6 mb-4">' : '<ol class="list-decimal ml-6 mb-4">';
          Array.from(firstLevelItems).slice(0, 5).forEach((item) => {
            const text = item.textContent?.trim() || '';
            if (text && text.length < 150) {
              // Preserve HTML formatting in list items
              const itemHTML = item.innerHTML.trim();
              quickRef += `<li class="mb-2 text-gray-700 dark:text-gray-300">${itemHTML}</li>`;
            }
          });
          quickRef += tag === 'ul' ? '</ul>' : '</ol>';
        }
      });
    }
    
    return quickRef || '<p class="text-gray-600 dark:text-gray-400">Quick reference not available. Switch to Outline view for full content.</p>';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900 items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!studySet) {
    return null;
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-auto">
        {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/my-study-sets" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Study Sets
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Title and Metadata */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {studySet.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span>{userName}</span>
            <span>•</span>
            <span>Created {formatDate(studySet.created_at)}</span>
          </div>
        </div>

        {/* Tabs + Download PDF */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('outline')}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === 'outline'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Outline
            </button>
            <button
              onClick={() => setActiveTab('quick-reference')}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === 'quick-reference'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Quick reference
            </button>
          </div>
          {(content || flashcards.length > 0) && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 pb-4 px-1 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download as PDF
            </button>
          )}
        </div>

        {/* Study Options Section - show when we have outline content or flashcards (manual set) */}
        {(content || flashcards.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Study this material</h2>
            <div className="flex flex-wrap items-center gap-4">
              {/* Study dropdown - blue button with document icon + chevron */}
              <div className="relative study-menu-container">
                <button
                  type="button"
                  onClick={() => setShowStudyDropdown(!showStudyDropdown)}
                  className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Study
                  <svg
                    className={`transition-transform ${showStudyDropdown ? 'rotate-180' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showStudyDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowStudyDropdown(false)} aria-hidden="true" />
                    <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-20">
                      <Link
                        href={`/my-study-sets/${params.id}/flashcards`}
                        onClick={() => setShowStudyDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-500 rounded" />
                        </div>
                        Flashcards
                      </Link>
                      <Link
                        href={`/my-study-sets/${params.id}/learn`}
                        onClick={() => setShowStudyDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Learn
                      </Link>
                      <Link
                        href={`/my-study-sets/${params.id}/practice`}
                        onClick={() => setShowStudyDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Practise test
                      </Link>
                    </div>
                  </>
                )}
              </div>
              {/* Flashcards - outline style */}
              <Link
                href={`/my-study-sets/${params.id}/flashcards`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 focus:outline-none focus:ring-0"
              >
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                </div>
                Flashcards
              </Link>
              {/* Practise questions - outline style */}
              <Link
                href={`/my-study-sets/${params.id}/learn`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Practise questions
              </Link>
              {/* AI Chat - chat about this study set's notes and topics */}
              <Link
                href={`/my-study-sets/${params.id}/ai-chat`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 9.5C17 13.09 13.64 16 9.5 16C8.22 16 7.02 15.63 6 15L2 16L3.5 12.5C2.37 11.48 1.5 10.08 1.5 8.5C1.5 4.91 4.86 2 9 2C13.14 2 17 4.91 17 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                AI Chat
              </Link>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="mb-24">
          {studySet.subject && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {studySet.subject}
              </h2>
            </div>
          )}

          {(() => {
            // AI-generated outline/summary: content has HTML structure (e.g. headings, lists)
            const hasOutlineContent = content && /<(?:\w+)/.test(content);
            if (hasOutlineContent) {
              return activeTab === 'outline' ? (
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: generateQuickReference(content) }}
                />
              );
            }
            // Manual set or flashcards-only: show terms and definitions where the summary would be
            if (flashcards.length > 0) {
              const proseClass = 'prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2';
              return (
                <div className={proseClass}>
                  <ol className="list-decimal ml-6 mb-4 space-y-6">
                    {flashcards.map((card, index) => (
                      <li key={index} className="pl-2">
                        <strong className="text-gray-900 dark:text-gray-100 font-bold">{card.front}</strong>
                        <p className="mt-2 mb-0 text-gray-700 dark:text-gray-300">{card.back}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            }
            return (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No content available for this study set.</p>
                <Link 
                  href="/ai-generator" 
                  className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Generate Content
                </Link>
              </div>
            );
          })()}
        </div>
      </main>
      </div>
    </AppLayout>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function StudySetDetail() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'outline' | 'quick-reference'>('outline');
  const [userName, setUserName] = useState<string>('');
  const [showStudyMenu, setShowStudyMenu] = useState(false);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showStudyMenu && !target.closest('.study-menu-container')) {
        setShowStudyMenu(false);
      }
    };

    if (showStudyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStudyMenu]);

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

        // Get content from localStorage
        const savedContent = localStorage.getItem(`note-content-${studySetId}`);
        if (savedContent) {
          setContent(savedContent);
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/my-study-sets" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Study Sets
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.34315 16.6569 5 15 5C13.3431 5 12 6.34315 12 8C12 9.65685 13.3431 11 15 11C16.6569 11 18 9.65685 18 8Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 16C6 14.3431 7.34315 13 9 13C10.6569 13 12 14.3431 12 16C12 17.6569 10.6569 19 9 19C7.34315 19 6 17.6569 6 16Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M18 16C18 14.3431 16.6569 13 15 13C13.3431 13 12 14.3431 12 16C12 17.6569 13.3431 19 15 19C16.6569 19 18 17.6569 18 16Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                <circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
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

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
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
        </div>

        {/* Study Options Section */}
        {content && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Study this material</h2>
            <div className="flex gap-4">
              <button className="bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                </div>
                Flashcards
              </button>
              <Link 
                href={`/my-study-sets/${params.id}/practice`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Practice test
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

          {content ? (
            activeTab === 'outline' ? (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
                dangerouslySetInnerHTML={{ __html: generateQuickReference(content) }}
              />
            )
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No content available for this study set.</p>
              <Link 
                href="/ai-generator" 
                className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Generate Content
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.90217 19.1213 3.43739 19.1213 4C19.1213 4.56261 18.8978 5.09783 18.5 5.5L12 12L8 13L9 9L15.5 2.5C15.9022 2.10217 16.4374 1.87868 17 1.87868C17.5626 1.87868 18.0978 2.10217 18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit outline
          </button>
          
          {/* Study Button with Dropdown */}
          <div className="relative study-menu-container">
            <button 
              onClick={() => setShowStudyMenu(!showStudyMenu)}
              className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Study
              <svg 
                className={`transition-transform ${showStudyMenu ? 'rotate-180' : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showStudyMenu && (
              <>
                {/* Backdrop to close menu on click outside */}
                <div 
                  className="fixed inset-0 z-0"
                  onClick={() => setShowStudyMenu(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-20">
                  <Link
                    href={`/my-study-sets/${params.id}/flashcards`}
                    onClick={() => setShowStudyMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Flashcards
                  </Link>
                  <Link
                    href={`/my-study-sets/${params.id}/practice`}
                    onClick={() => setShowStudyMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Practice test
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

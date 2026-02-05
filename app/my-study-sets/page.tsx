'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { StudySet } from '@/lib/types/database';
import { useTheme } from '@/app/providers/ThemeProvider';
import AppLayout from '@/components/AppLayout';

interface SubjectWithCount {
  name: string;
  sets: number;
}

function subjectBadgeClass(subject: string): string {
  const m: Record<string, string> = {
    Chemistry: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    History: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Languages: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    Mathematics: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Biology: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  };
  return m[subject] ?? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
}

export default function MyStudySets() {
  const router = useRouter();
  const { theme } = useTheme();
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectWithCount[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateStudySetChoice, setShowCreateStudySetChoice] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const supabase = createClient();
      if (!supabase) {
        setLoadingSubjects(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoadingSubjects(false);
        return;
      }

      // Get all study sets for the user with subjects
      const { data: studySets, error } = await supabase
        .from('study_sets')
        .select('subject')
        .eq('user_id', user.id)
        .not('subject', 'is', null);

      if (error) {
        console.error('Error loading subjects:', error);
        setSubjects([]);
        setLoadingSubjects(false);
        return;
      }

      // Count study sets per subject
      const subjectCounts: Record<string, number> = {};
      (studySets || []).forEach(set => {
        if (set.subject && set.subject.trim()) {
          subjectCounts[set.subject] = (subjectCounts[set.subject] || 0) + 1;
        }
      });

      // Convert to array and sort
      const subjectsList: SubjectWithCount[] = Object.entries(subjectCounts)
        .map(([name, sets]) => ({ name, sets }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setSubjects(subjectsList);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('study_sets')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        setStudySets((data ?? []) as StudySet[]);
      } finally {
        setLoading(false);
      }
    }
    load();
    loadSubjects();
  }, []);

  const getSubjectColor = (index: number): string => {
    const colors = ['blue', 'green', 'orange', 'purple'];
    return colors[index % colors.length];
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) {
      setCreateError('Please enter a subject name');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const supabase = createClient();
      if (!supabase) {
        setCreateError('Server not configured. Add Supabase keys to .env.local.');
        setCreating(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCreateError('You must be logged in to create subjects');
        setCreating(false);
        return;
      }

      // Check if subject already exists
      const existingSubject = subjects.find(s => s.name.toLowerCase() === newSubjectName.trim().toLowerCase());
      if (existingSubject) {
        setCreateError('This subject already exists');
        setCreating(false);
        return;
      }

      // Create a placeholder study set with this subject so it appears immediately
      const subjectName = newSubjectName.trim();
      const { data: insertedData, error: insertError } = await supabase
        .from('study_sets')
        .insert({
          user_id: user.id,
          title: `New ${subjectName} Study Set`,
          subject: subjectName,
          card_count: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating placeholder study set:', insertError);
        let errorMessage = 'Failed to create subject. Please try again.';
        
        // Check for specific error types
        if (insertError?.message) {
          errorMessage = insertError.message;
          
          // Provide helpful message for schema cache errors
          if (insertError.message.includes('schema cache') || insertError.message.includes('not found')) {
            errorMessage = 'Database table not found. Please ensure the study_sets table exists in your Supabase database. Check the SUPABASE_SETUP.md file for setup instructions.';
          }
        } else if (insertError?.details) {
          errorMessage = insertError.details;
        } else if (insertError?.hint) {
          errorMessage = insertError.hint;
        } else if (insertError?.code) {
          // Handle specific error codes
          if (insertError.code === 'PGRST116' || insertError.code === '42P01') {
            errorMessage = 'Database table not found. Please run the SQL setup script in your Supabase dashboard (see SUPABASE_SETUP.md).';
          }
        }
        
        setCreateError(errorMessage);
        setCreating(false);
        return;
      }

      if (!insertedData) {
        setCreateError('Subject created but could not be retrieved. Please refresh the page.');
        setCreating(false);
        return;
      }

      // Close dialog and refresh lists
      setShowCreateDialog(false);
      setNewSubjectName('');
      
      // Reload subjects and study sets
      await loadSubjects();
      // Reload study sets
      const { data } = await supabase
        .from('study_sets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setStudySets((data ?? []) as StudySet[]);
    } catch (error: any) {
      console.error('Error creating subject:', error);
      let errorMessage = 'Failed to create subject. Please try again.';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.hint) {
        errorMessage = error.hint;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setCreateError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppLayout>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search study sets, flashcards, quizzes..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3C10 3 8 3 8 5C8 6 8 10 6 10C4 10 4 8 4 8V12C4 12 4 10 6 10C8 10 8 14 8 15C8 17 10 17 10 17C10 17 12 17 12 15C12 14 12 10 14 10C16 10 16 12 16 12V8C16 8 16 10 14 10C12 10 12 6 12 5C12 3 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              
              <Link
                href="/settings"
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Settings"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 17C5 14.2386 7.23858 12 10 12C12.7614 12 15 14.2386 15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Study Sets</h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Create Subject
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateStudySetChoice(true)}
                  className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Create Study Set
                </button>
              </div>
            </div>
            
            {/* Subjects with nested Study Sets */}
            {loading || loadingSubjects ? (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 transition-colors">Loading…</div>
            ) : studySets.length === 0 && subjects.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-100 dark:border-gray-700 text-center transition-colors">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No study sets or subjects yet. Create one to get started.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium"
                  >
                    Create Subject
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateStudySetChoice(true)}
                    className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white px-6 py-2.5 rounded-lg text-sm font-medium"
                  >
                    Create Study Set
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Subjects with their study sets */}
                {subjects.map((subject, index) => {
                  const color = getSubjectColor(index);
                  const colorClasses = {
                    blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', stroke: '#0055FF' },
                    green: { bg: 'bg-green-50 dark:bg-green-900/30', stroke: '#10B981' },
                    orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', stroke: '#F97316' },
                    purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', stroke: '#8B5CF6' },
                  };
                  const colorClass = colorClasses[color as keyof typeof colorClasses];
                  
                  // Get study sets for this subject
                  const subjectStudySets = studySets.filter(set => set.subject === subject.name);
                  const isExpanded = expandedSubjects.has(subject.name);
                  
                  return (
                    <div key={`subject-${subject.name}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
                      {/* Subject Header */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => {
                          const newExpanded = new Set(expandedSubjects);
                          if (isExpanded) {
                            newExpanded.delete(subject.name);
                          } else {
                            newExpanded.add(subject.name);
                          }
                          setExpandedSubjects(newExpanded);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${colorClass.bg} rounded-lg flex items-center justify-center`}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V7Z" stroke={colorClass.stroke} strokeWidth="2"/>
                                <path d="M9 5V19" stroke={colorClass.stroke} strokeWidth="2"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{subject.sets} study set{subject.sets !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Study Sets inside Subject */}
                      {isExpanded && subjectStudySets.length > 0 && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {subjectStudySets.map((set) => {
                              return (
                                <button
                                  key={set.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/my-study-sets/${set.id}`);
                                  }}
                                  className="relative z-10 w-full text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all cursor-pointer block"
                                >
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                                      </svg>
                                    </div>
                                  </div>
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">{set.title}</h4>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{set.card_count ?? 0} cards</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">0%</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Empty state for subject */}
                      {isExpanded && subjectStudySets.length === 0 && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">No study sets in this subject yet</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Study Sets without a subject (Uncategorized) */}
                {(() => {
                  const uncategorizedSets = studySets.filter(set => !set.subject || set.subject.trim() === '');
                  if (uncategorizedSets.length > 0) {
                    const isExpanded = expandedSubjects.has('Uncategorized');
                    return (
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
                        <div 
                          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => {
                            const newExpanded = new Set(expandedSubjects);
                            if (isExpanded) {
                              newExpanded.delete('Uncategorized');
                            } else {
                              newExpanded.add('Uncategorized');
                            }
                            setExpandedSubjects(newExpanded);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V7Z" stroke="#6B7280" strokeWidth="2"/>
                                  <path d="M9 5V19" stroke="#6B7280" strokeWidth="2"/>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Uncategorized</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{uncategorizedSets.length} study set{uncategorizedSets.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                              {uncategorizedSets.map((set) => {
                                return (
                                  <button
                                    key={set.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/my-study-sets/${set.id}`);
                                    }}
                                    className="relative z-10 w-full text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all cursor-pointer block"
                                  >
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" fill="#0055FF"/>
                                        </svg>
                                      </div>
                                    </div>
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">{set.title}</h4>
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{set.card_count ?? 0} cards</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
                                      </div>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">0%</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Study Set: Manual or AI choice */}
      {showCreateStudySetChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create Study Set</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Choose how you want to create your study set.</p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateStudySetChoice(false);
                  router.push('/ai-generator');
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="block font-semibold">With AI</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Paste notes or upload — we generate flashcards and content</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateStudySetChoice(false);
                  router.push('/my-study-sets/create/manual');
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <span className="block font-semibold">Create manually</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Type in your own terms and definitions</span>
                </div>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateStudySetChoice(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Subject Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create Subject</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Biology, History, Mathematics"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateSubject();
                    }
                  }}
                />
              </div>

              {createError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                  {createError}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p><strong>Note:</strong> A placeholder study set will be created for this subject. You can add content to it later or create new study sets with this subject.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewSubjectName('');
                  setCreateError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubject}
                disabled={creating || !newSubjectName.trim()}
                className="flex-1 px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

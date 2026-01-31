'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Flashcard {
  id: string;
  term: string;
  definition: string;
  image?: string;
}

export default function ManualStudySetCreate() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [cards, setCards] = useState<Flashcard[]>([
    { id: '1', term: '', definition: '' },
    { id: '2', term: '', definition: '' },
  ]);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Save Note modal (same as AI creation)
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedStudySetId, setSavedStudySetId] = useState<string | null>(null);
  const [pendingRedirectToPractice, setPendingRedirectToPractice] = useState(false);

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        const supabase = createClient();
        if (!supabase) {
          setLoadingSubjects(false);
          return;
        }
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoadingSubjects(false);
          return;
        }
        const { data: studySets, error } = await supabase
          .from('study_sets')
          .select('subject')
          .eq('user_id', user.id)
          .not('subject', 'is', null);
        if (error) {
          setAvailableSubjects([]);
          setLoadingSubjects(false);
          return;
        }
        const unique = Array.from(
          new Set(
            (studySets || [])
              .map((s: { subject: string | null }) => s.subject)
              .filter((s): s is string => s != null && s.trim() !== '')
          )
        ).sort();
        setAvailableSubjects(unique);
      } catch {
        setAvailableSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadSubjects();
  }, []);

  const addCard = () => {
    const newId = String(cards.length + 1);
    setCards([...cards, { id: newId, term: '', definition: '' }]);
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const updateCard = (id: string, field: 'term' | 'definition', value: string) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCards(cards.map(card =>
        card.id === id ? { ...card, image: reader.result as string } : card
      ));
    };
    reader.readAsDataURL(file);
  };

  const validCards = cards.filter(card => card.term.trim() && card.definition.trim());

  const openSaveNoteModal = (startPractice: boolean) => {
    if (!title.trim()) {
      alert('Please enter a title for your study set');
      return;
    }
    if (validCards.length === 0) {
      alert('Please add at least one flashcard with both term and definition');
      return;
    }
    setNoteTitle(title.trim());
    setNoteSubject('');
    setUseCustomSubject(false);
    setSaveError('');
    setSaveSuccess(false);
    setSavedStudySetId(null);
    setPendingRedirectToPractice(startPractice);
    setShowSaveDialog(true);
  };

  const handleSaveFromModal = async () => {
    if (!noteTitle.trim()) {
      setSaveError('Please enter a title');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const supabase = createClient();
      if (!supabase) {
        setSaveError('Server not configured. Add Supabase keys to .env.local.');
        setSaving(false);
        return;
      }
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/login');
        setSaving(false);
        return;
      }

      const { data: studySet, error } = await supabase
        .from('study_sets')
        .insert({
          user_id: user.id,
          title: noteTitle.trim(),
          subject: noteSubject.trim() || null,
          card_count: validCards.length,
        })
        .select()
        .single();

      if (error) {
        setSaveError(error.message || 'Failed to create study set. Please try again.');
        setSaving(false);
        return;
      }
      if (!studySet) {
        setSaveError('Failed to create study set. Please try again.');
        setSaving(false);
        return;
      }

      const studySetId = studySet.id;
      const formattedCards = validCards.map(card => ({
        front: card.term,
        back: card.definition,
        image: card.image || undefined,
      }));
      localStorage.setItem(`flashcards-${studySetId}`, JSON.stringify(formattedCards));
      if (description.trim()) {
        localStorage.setItem(`note-content-${studySetId}`, description.trim());
      }

      setSaveSuccess(true);
      setSavedStudySetId(studySetId);

      if (pendingRedirectToPractice) {
        router.push(`/my-study-sets/${studySetId}`);
      }
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/my-study-sets" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openSaveNoteModal(false)}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => openSaveNoteModal(true)}
              className="px-6 py-2.5 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors"
            >
              Create and practice
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create a new flashcard set</h1>

        {/* Public Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isPublic
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2C15.31 2 18 4.69 18 8C18 11.31 15.31 14 12 14C8.69 14 6 11.31 6 8C6 4.69 8.69 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 20C2 16.69 4.69 14 8 14H16C19.31 14 22 16.69 22 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Public
          </button>
        </div>

        {/* Title and Description */}
        <div className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        {/* Import and Add Diagram Buttons */}
        <div className="mb-6 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V16M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V16M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add diagram
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path d="M12 2L15 7L20 8L16 12L17 17L12 15L7 17L8 12L4 8L9 7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
            </svg>
          </button>

          {/* Suggestions Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Suggestions</span>
            <button
              onClick={() => setSuggestionsEnabled(!suggestionsEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                suggestionsEnabled ? 'bg-[#0055FF]' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                  suggestionsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Batch Action Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Flashcard Cards */}
        <div className="space-y-4 mb-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm p-6 relative"
            >
              {/* Card Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0055FF] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>

              {/* Card Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Term and Definition Inputs */}
              <div className="grid grid-cols-2 gap-6 mt-2">
                {/* Term Input */}
                <div>
                  <input
                    type="text"
                    value={card.term}
                    onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                    placeholder="Enter term"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 text-lg"
                  />
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase mt-2 font-medium">
                    TERM
                  </label>
                </div>

                {/* Definition Input and Image */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={card.definition}
                      onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                      placeholder="Enter definition"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 text-lg"
                    />
                    <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase mt-2 font-medium">
                      DEFINITION
                    </label>
                  </div>

                  {/* Image Upload */}
                  <div className="w-32">
                    <input
                      ref={(el) => { fileInputRefs.current[card.id] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(card.id, file);
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[card.id]?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50"
                    >
                      {card.image ? (
                        <img src={card.image} alt="Card image" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mb-1">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add a card Button */}
        <button
          type="button"
          onClick={addCard}
          className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          Add a card
        </button>
      </main>

      {/* Save Note Dialog - same as AI creation */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Save Note</h2>

            {saveSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">Your study set is ready!</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Your study set and flashcards have been saved.</p>
                <div className="flex gap-3">
                  {savedStudySetId && (
                    <Link
                      href={`/my-study-sets/${savedStudySetId}`}
                      className="flex-1 px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg font-medium transition-colors text-center"
                      onClick={() => {
                        setShowSaveDialog(false);
                        setSaveSuccess(false);
                        setNoteTitle('');
                        setNoteSubject('');
                        setUseCustomSubject(false);
                        setSavedStudySetId(null);
                      }}
                    >
                      Go to Study Set
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setSaveSuccess(false);
                      setNoteTitle('');
                      setNoteSubject('');
                      setUseCustomSubject(false);
                      setSavedStudySetId(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Enter note title"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject (optional)
                    </label>
                    {!useCustomSubject ? (
                      <select
                        value={noteSubject}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setUseCustomSubject(true);
                            setNoteSubject('');
                          } else {
                            setNoteSubject(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                      >
                        <option value="">None</option>
                        {loadingSubjects ? (
                          <option disabled>Loading subjects...</option>
                        ) : (
                          <>
                            {availableSubjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                            <option value="__custom__">+ Add New Subject</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={noteSubject}
                          onChange={(e) => setNoteSubject(e.target.value)}
                          placeholder="Enter new subject name"
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUseCustomSubject(false);
                            setNoteSubject('');
                          }}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          ← Select from existing subjects
                        </button>
                      </div>
                    )}
                    {availableSubjects.length > 0 && !useCustomSubject && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {availableSubjects.length} subject{availableSubjects.length !== 1 ? 's' : ''} from your study sets
                      </p>
                    )}
                  </div>

                  {saveError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                      {saveError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setNoteTitle('');
                      setNoteSubject('');
                      setSaveError('');
                      setUseCustomSubject(false);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFromModal}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

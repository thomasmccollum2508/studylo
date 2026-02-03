'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsProgressData() {
  const router = useRouter();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleResetProgress() {
    const supabase = createClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Remove user's study sets (cascades to cards), quizzes in localStorage, and any local progress
    const { data: sets } = await supabase.from('study_sets').select('id').eq('user_id', user.id);
    if (sets?.length) {
      for (const s of sets) {
        await supabase.from('study_sets').delete().eq('id', s.id);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`quizzes-${user.id}`);
      // Clear any other progress keys you use
    }
    setResetDone(true);
    setResetConfirm(false);
    router.refresh();
  }

  async function handleExport() {
    setExporting(true);
    const supabase = createClient();
    if (!supabase) {
      setExporting(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setExporting(false);
      return;
    }
    const { data: sets } = await supabase.from('study_sets').select('*').eq('user_id', user.id);
    const quizzesRaw = typeof window !== 'undefined' ? localStorage.getItem(`quizzes-${user.id}`) : null;
    const quizzes = quizzesRaw ? JSON.parse(quizzesRaw) : [];
    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      studySets: sets ?? [],
      quizzes,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studylo-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Progress & Data</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reset your progress or export your data.</p>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Reset progress</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Remove all study sets and quiz history. This cannot be undone.</p>
        {resetDone ? (
          <p className="text-sm text-green-600 dark:text-green-400">Progress has been reset.</p>
        ) : !resetConfirm ? (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset progress
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleResetProgress}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Yes, reset everything
            </button>
            <button type="button" onClick={() => setResetConfirm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">
              Cancel
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Export study data</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Download your study sets and quiz history as a JSON file.</p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {exporting ? 'Preparing…' : 'Export data'}
        </button>
      </div>
    </div>
  );
}

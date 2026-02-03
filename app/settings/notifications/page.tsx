'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'studylo-email-notifications';

export default function SettingsNotifications() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setEnabled(stored !== 'false');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [mounted, enabled]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control how we contact you.</p>
      </div>

      <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">Email notifications</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Study reminders and product updates</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'left-6' : 'left-1'}`}
          />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">Push notifications and deadline alerts are not available.</p>
    </div>
  );
}

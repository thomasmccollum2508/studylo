'use client';

import { useTheme } from '@/app/providers/ThemeProvider';

export default function SettingsAppearance() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose light or dark mode.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <button
          type="button"
          onClick={() => theme !== 'light' && toggleTheme()}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
            theme === 'light'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="text-2xl">☀️</span>
          <div>
            <p className="font-medium">Light mode</p>
            <p className="text-sm opacity-80">Bright background</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => theme !== 'dark' && toggleTheme()}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
            theme === 'dark'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="text-2xl">🌙</span>
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm opacity-80">Easy on the eyes</p>
          </div>
        </button>
      </div>
    </div>
  );
}

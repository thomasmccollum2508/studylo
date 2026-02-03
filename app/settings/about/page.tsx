'use client';

import Link from 'next/link';

const APP_VERSION = '0.1.0';

export default function SettingsAbout() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">About</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">App version and legal links.</p>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">App version</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{APP_VERSION}</p>
      </div>

      <div className="space-y-2">
        <Link
          href="/terms"
          className="block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Terms of service
        </Link>
        <Link
          href="/privacy"
          className="block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Privacy policy
        </Link>
      </div>
    </div>
  );
}

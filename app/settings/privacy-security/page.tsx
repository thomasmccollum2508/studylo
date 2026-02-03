'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPrivacySecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy & Security</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Password, 2FA, and sessions.</p>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Change password</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update your password in Account.</p>
        <Link href="/settings/account" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Go to Account →
        </Link>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Two-factor authentication</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Optional extra security for your account.</p>
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Enable 2FA</span>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactorEnabled}
            onClick={() => setTwoFactorEnabled((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${twoFactorEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">2FA setup can be added in a future update.</p>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Active sessions / devices</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">You are currently signed in on this device. Additional session management can be added later.</p>
      </div>
    </div>
  );
}

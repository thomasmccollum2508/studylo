'use client';

import Link from 'next/link';

const SUPPORT_EMAIL = 'support@studylo.com';
const BUG_EMAIL = 'support@studylo.com?subject=Bug%20report';
const FEEDBACK_EMAIL = 'support@studylo.com?subject=Feedback';

export default function SettingsSupport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Help & Support</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">FAQs, contact, and feedback.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">FAQs</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Browse common questions and answers.</p>
          <Link
            href="/resources/help-center"
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Open help center →
          </Link>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Contact support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Get help from our team.</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Report a bug</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Something not working? Let us know.</p>
          <a
            href={BUG_EMAIL}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Send bug report →
          </a>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Send feedback</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suggestions or ideas? We’d love to hear them.</p>
          <a
            href={FEEDBACK_EMAIL}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Send feedback →
          </a>
        </div>
      </div>
    </div>
  );
}

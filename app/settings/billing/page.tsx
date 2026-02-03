'use client';

export default function SettingsBilling() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subscription & Billing</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your plan and billing (if applicable).</p>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Current plan</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Free — full access to study sets, flashcards, and quizzes.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="/pricing"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Upgrade plan
        </a>
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel plan
        </button>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Billing history</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No billing history yet. Upgrade to a paid plan to see invoices here.</p>
      </div>
    </div>
  );
}

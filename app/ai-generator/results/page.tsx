import { Suspense } from 'react';
import ResultsPageContent from './ResultsPageContent';

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}

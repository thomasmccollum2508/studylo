import { Suspense } from 'react';
import CreatePageContent from './CreatePageContent';

// useSearchParams() must be inside a Suspense boundary for static generation
export const dynamic = 'force-dynamic';

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}

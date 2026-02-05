import Header from '../components/Header';

export default function Library() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-5xl w-full text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-[1.1]">
            Your <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Study Library</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Access all your study sets, flashcards, and quizzes in one organized place. Track your progress and keep learning.
          </p>
        </div>
      </main>

      {/* Stats Section */}
      <section className="w-full px-6 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Study Sets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H21V16C21 16.5523 20.5523 17 20 17H4C3.44772 17 3 16.5523 3 16V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 9H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 13H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</h3>
              <p className="text-gray-600 dark:text-gray-400">Study Sets</p>
            </div>

            {/* Flashcards */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#F97316] flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L10 10H15L9 22L12 14H7L13 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</h3>
              <p className="text-gray-600 dark:text-gray-400">Flashcards</p>
            </div>

            {/* Quizzes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#14B8A6] flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 7.5L20.5 8.5L16 13L17 19L12 16L7 19L8 13L3.5 8.5L9.5 7.5L12 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</h3>
              <p className="text-gray-600 dark:text-gray-400">Quizzes Taken</p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty State / CTA */}
      <section className="w-full px-6 py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md p-12">
            <div className="w-20 h-20 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,85,255,0.4)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your library is empty
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Start creating study sets from your notes, or explore millions of community-created materials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
                Create Study Set
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                Browse Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="w-full px-6 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              No recent activity yet. Start studying to see your progress here!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

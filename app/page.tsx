import FAQ from './components/FAQ';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-4xl w-full text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            The Ultimate AI Study Tool
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your notes, take photos, or type text — our AI instantly turns them into quizzes, flashcards, and study sets tailored to you.
          </p>

          {/* CTA Button */}
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-10 py-4 rounded-[15px] text-lg mb-6 transition-all duration-300 shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:shadow-[0_0_25px_rgba(0,85,255,0.6)] hover:-translate-y-1 hover:scale-105">
            <span className="font-light">Get Started</span> - <span className="font-semibold">It's Free</span>
          </button>

          {/* Footer Text */}
          <p className="text-gray-600 text-sm">
            No credit card needed • Unlimited time on Free plan
          </p>
        </div>
      </main>

      {/* Cards Section */}
      <section className="w-full px-6 pt-0 pb-12 bg-white -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[32px] shadow-md border border-gray-200 p-5 relative">
            {/* Window controls */}
            <div className="absolute top-4 left-8 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Flashcard Card */}
              <div className="bg-white rounded-[32px] shadow-md border border-gray-200 p-6 animate-float" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0055FF] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,85,255,0.5)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L10 10H15L9 22L12 14H7L13 2Z" fill="white"/>
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-semibold text-base">Flashcard</h3>
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">What is photosynthesis?</h4>
                <p className="text-gray-500 text-sm">The process plants use to convert light into energy...</p>
              </div>

              {/* Quiz Card */}
              <div className="bg-white rounded-[32px] shadow-md border border-gray-200 p-6 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2L12.5 7.5L18.5 8.5L14 13L15 19L10 16L5 19L6 13L1.5 8.5L7.5 7.5L10 2Z" fill="white"/>
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-semibold text-base">Quiz</h3>
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-3">Biology Chapter 5</h4>
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#F97316] h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <p className="text-[#F97316] text-sm font-medium">80% Complete</p>
              </div>

              {/* Study Set Card */}
              <div className="bg-white rounded-[32px] shadow-md border border-gray-200 p-6 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5H17V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 5C3 4.44772 3.44772 4 4 4H16C16.5523 4 17 4.44772 17 5V5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 8H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M6 11H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-semibold text-base">Study Set</h3>
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">AP Chemistry</h4>
                <p className="text-gray-500 text-sm">245 cards • 12 quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Features Label */}
          <div className="text-center mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FEATURES</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">crush your exams</span>
          </h2>

          {/* Description */}
          <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Stop wasting time on outdated study methods. Studylo combines AI with proven learning science to help you study smarter, not harder.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Flashcard Generator */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L10 10H15L9 22L12 14H7L13 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">AI Flashcard Generator</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Paste your notes, textbook pages, or lecture slides. Our AI instantly creates perfect flashcards tailored to your material.</p>
            </div>

            {/* Smart Quizzes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 2C8.5 2 7.7 2.4 7.2 3C6.7 3.6 6.5 4.3 6.5 5C6.5 5.7 6.7 6.4 7.2 7C7.7 7.6 8.5 8 9.5 8C10.5 8 11.3 7.6 11.8 7C12.3 6.4 12.5 5.7 12.5 5C12.5 4.3 12.3 3.6 11.8 3C11.3 2.4 10.5 2 9.5 2Z" fill="white"/>
                  <path d="M14.5 2C13.5 2 12.7 2.4 12.2 3C11.7 3.6 11.5 4.3 11.5 5C11.5 5.7 11.7 6.4 12.2 7C12.7 7.6 13.5 8 14.5 8C15.5 8 16.3 7.6 16.8 7C17.3 6.4 17.5 5.7 17.5 5C17.5 4.3 17.3 3.6 16.8 3C16.3 2.4 15.5 2 14.5 2Z" fill="white"/>
                  <path d="M12 9C10.5 9 9.2 9.5 8.2 10.3C7.2 11.1 6.5 12.2 6.2 13.5C5.9 14.8 6 16.2 6.5 17.5C7 18.8 7.9 19.9 9.2 20.6C10.5 21.3 12 21.6 13.5 21.4C15 21.2 16.4 20.5 17.5 19.4C18.6 18.3 19.3 16.9 19.5 15.4C19.7 13.9 19.4 12.4 18.7 11.1C18 9.8 16.9 8.9 15.6 8.4C14.3 7.9 12.9 7.8 11.6 8.1C11.1 8.2 10.6 8.4 10.1 8.6C9.6 8.8 9.2 9 8.8 9.2C8.4 9.4 8.1 9.6 7.8 9.8C7.5 10 7.2 10.2 7 10.4C6.8 10.6 6.6 10.8 6.5 11C6.4 11.2 6.3 11.4 6.3 11.6C6.3 11.8 6.3 12 6.4 12.2C6.5 12.4 6.6 12.6 6.8 12.8C7 13 7.2 13.2 7.5 13.4C7.8 13.6 8.1 13.8 8.5 14C8.9 14.2 9.3 14.4 9.8 14.6C10.3 14.8 10.8 15 11.4 15.2C12 15.4 12.6 15.6 13.3 15.8C14 16 14.7 16.2 15.4 16.4C16.1 16.6 16.8 16.8 17.5 17C18.2 17.2 18.9 17.4 19.6 17.6C20.3 17.8 21 18 21.7 18.2C22.4 18.4 23.1 18.6 23.8 18.8C24.5 19 25.2 19.2 25.9 19.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <path d="M9 12C8.5 12.5 8.2 13.1 8.1 13.8C8 14.5 8.1 15.2 8.4 15.8C8.7 16.4 9.2 16.9 9.8 17.2C10.4 17.5 11.1 17.6 11.8 17.5C12.5 17.4 13.1 17.1 13.6 16.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Smart Quizzes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">AI-generated quizzes that adapt to your learning. Focus on what you don't know yet, skip what you've mastered.</p>
            </div>

            {/* Instant Study Sets */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L10 10H15L9 22L12 14H7L13 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Instant Study Sets</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Upload any document and get a complete study set in seconds. PDFs, images, even handwritten notes work.</p>
            </div>

            {/* Spaced Repetition */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Spaced Repetition</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Science-backed review schedules show you cards right before you'd forget them. Remember more with less effort.</p>
            </div>

            {/* Study in Minutes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Study in Minutes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">No more hours making flashcards. Create a full study set faster than you can say 'procrastination.'</p>
            </div>

            {/* Share & Collaborate */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="white"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="white"/>
                  <path d="M20 7C20 9.20914 18.2091 11 16 11C13.7909 11 12 9.20914 12 7C12 4.79086 13.7909 3 16 3C18.2091 3 20 4.79086 20 7Z" fill="white"/>
                  <path d="M16 14C12.134 14 9 17.134 9 21H23C23 17.134 19.866 14 16 14Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Share & Collaborate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Study with friends, share your sets, and access millions of community-created study materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Studylo Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">WHY STUDYLO?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Traditional studying is <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">broken</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
              Hours spent making flashcards. Cramming before exams. Forgetting everything after. Sound familiar? There's a better way.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="text-left pt-2 pb-3 px-6 text-gray-800 font-semibold align-middle border-b border-gray-200 w-1/3">Feature</th>
                    <th className="text-center pt-2 pb-3 px-6 text-gray-800 font-semibold align-middle border-b border-gray-200 w-1/3">Traditional</th>
                    <th className="text-center pt-2 pb-3 px-6 align-middle border-b border-gray-200 w-1/3">
                      <span className="bg-[#0055FF] text-white px-6 py-1.5 rounded-full text-sm font-semibold inline-block">
                        Studylo
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr>
                    <td className="py-6 px-6 text-gray-900 font-medium border-b border-gray-100">Create flashcards from notes</td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-gray-600">30+ minutes</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-600">10 seconds</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td className="py-6 px-6 text-gray-900 font-medium border-b border-gray-100">Identify weak areas</td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-gray-600">Guessing</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-600">AI-powered analytics</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-6 px-6 text-gray-900 font-medium border-b border-gray-100">Review schedule</td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-gray-600">Random cramming</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-600">Spaced repetition</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr>
                    <td className="py-6 px-6 text-gray-900 font-medium border-b border-gray-100">Practice quizzes</td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-gray-600">Make your own</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-600">Auto-generated</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr>
                    <td className="py-6 px-6 text-gray-900 font-medium">Retention rate</td>
                    <td className="py-6 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-gray-600">~20%</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-600">~85%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">HOW IT WORKS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From notes to A+ in <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">4 simple steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No complicated setup. No learning curve. Just upload and start studying.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gray-200 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <span className="text-8xl font-bold text-gray-200/40 absolute -top-8 left-1/2 transform -translate-x-1/2 -z-10">01</span>
                  <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(0,85,255,0.4)] relative z-10">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V16M12 4L8 8M12 4L16 8M4 20H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Upload Your Material</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Paste notes, upload PDFs, or snap a photo of your textbook. We accept anything.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <span className="text-8xl font-bold text-gray-200/40 absolute -top-8 left-1/2 transform -translate-x-1/2 -z-10">02</span>
                  <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(0,85,255,0.4)] relative z-10">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">AI Does the Work</h3>
                <p className="text-gray-600 text-sm leading-relaxed">In seconds, our AI creates flashcards, quizzes, and summaries from your content.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <span className="text-8xl font-bold text-gray-200/40 absolute -top-8 left-1/2 transform -translate-x-1/2 -z-10">03</span>
                  <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(0,85,255,0.4)] relative z-10">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Study Smarter</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Use spaced repetition and adaptive quizzes to learn efficiently and actually remember.</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <span className="text-8xl font-bold text-gray-200/40 absolute -top-8 left-1/2 transform -translate-x-1/2 -z-10">04</span>
                  <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(0,85,255,0.4)] relative z-10">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9H18L17 19H7L6 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 22H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Ace Your Exams</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Walk into every test confident. Watch your grades climb without the all-nighters.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">TESTIMONIALS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Students love <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Studylo</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join 500,000+ students who've transformed how they study.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
              </div>
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "I went from C's to A's in organic chemistry. Studylo's AI flashcards helped me memorize hundreds of reactions in half the time."
              </p>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0055FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="text-gray-900 font-bold">Sarah M.</div>
                  <div className="text-gray-600 text-sm">Pre-Med Student, UCLA</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
              </div>
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Made studying for AP exams actually manageable. The quizzes know exactly what I need to review. Got 5's on all three tests!"
              </p>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0055FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <div>
                  <div className="text-gray-900 font-bold">Jake T.</div>
                  <div className="text-gray-600 text-sm">High School Senior</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
              </div>
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Case briefing used to take hours. Now I upload my readings and have study sets ready in minutes. Life-changing for law school."
              </p>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0055FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <div className="text-gray-900 font-bold">Priya K.</div>
                  <div className="text-gray-600 text-sm">Law Student, NYU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Bottom CTA Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
        <div className="max-w-4xl w-full text-center">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#0055FF"/>
              </svg>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Ready to study smarter?
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed opacity-95">
            Join 500,000+ students already using Studylo to get better grades with less stress. Start free—no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="bg-white hover:bg-gray-50 text-[#0055FF] px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 flex items-center gap-2">
              Start Studying Free
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:scale-105">
              Try Demo
            </button>
          </div>

          {/* Feature List */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-sm">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

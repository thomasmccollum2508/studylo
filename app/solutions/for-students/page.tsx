import Header from '../../components/Header';

export default function ForStudents() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FOR STUDENTS</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Study Smarter, <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Not Harder</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform the way you learn with AI-powered tools designed specifically for students like you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Start Free Today
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you ace your exams and retain more information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L10 10H15L9 22L12 14H7L13 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Flashcard Generation</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upload any document, photo, or paste your notes. Our AI creates perfect flashcards in seconds, saving you hours of manual work.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Supports PDFs, images, and text</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Handwriting recognition</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Smart content extraction</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#F97316] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Spaced Repetition System</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our scientifically-proven algorithm shows you cards right before you'd forget them, maximizing long-term retention.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>85% better retention vs traditional methods</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Personalized review schedules</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Smart difficulty adjustments</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#14B8A6] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 7.5L20.5 8.5L16 13L17 19L12 16L7 19L8 13L3.5 8.5L9.5 7.5L12 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Adaptive Practice Quizzes</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI-generated quizzes that adapt to your learning level. Focus on what you don't know, skip what you've mastered.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Multiple question types</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Instant feedback and explanations</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#8B5CF6] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15H18" stroke="white" strokeWidth="2"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Study Groups & Sharing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Collaborate with classmates, share study sets, and learn from millions of community-created materials.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Create private or public study groups</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Share and remix study sets</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Access 10M+ community sets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Student-Friendly Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600 font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>50 AI-generated flashcards/month</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Basic spaced repetition</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>5 study sets</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Community access</span>
                </li>
              </ul>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-3 rounded-[12px] font-medium transition-all duration-300 hover:-translate-y-1">
                Get Started Free
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-[#0055FF] shadow-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#0055FF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$9.99<span className="text-lg text-gray-600 font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span><strong>Unlimited</strong> AI-generated content</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Advanced spaced repetition</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Unlimited study sets</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Detailed analytics</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Offline access</span>
                </li>
              </ul>
              <button className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white py-3 rounded-[12px] font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Grades?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join 500,000+ students already studying smarter with Studylo.
          </p>
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Start Free Today
          </button>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>
    </div>
  );
}

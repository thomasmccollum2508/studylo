import Header from '../../components/Header';

export default function ForTeachers() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FOR TEACHERS</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Empower Your <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Students</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create engaging study materials in minutes, track student progress, and help your class succeed like never before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Request Demo
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              View Pricing
            </button>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Save Time, Increase Engagement
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for educators who want to enhance learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save 10+ Hours Per Week</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate quizzes, flashcards, and study guides from your lesson plans in seconds instead of hours.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#F97316] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H21V13C21 13.5304 20.7893 14.0391 20.4142 14.4142C20.0391 14.7893 19.5304 15 19 15H5C4.46957 15 3.96086 14.7893 3.58579 14.4142C3.21071 14.0391 3 13.5304 3 13V3Z" stroke="white" strokeWidth="2"/>
                  <path d="M7 19H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 15V19" stroke="white" strokeWidth="2"/>
                  <path d="M14 15V19" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Student Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time analytics show you exactly where students are struggling so you can provide targeted help.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Boost Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive, AI-powered study materials keep students engaged and motivated to learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Educators
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to create effective learning experiences.
            </p>
          </div>

          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Auto-Generate Study Materials</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Upload your syllabus, textbook chapters, or lecture slides. Our AI instantly creates comprehensive study sets tailored to your curriculum.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Flashcards, quizzes, and practice tests</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Aligned with your teaching objectives</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Easy customization and editing</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl h-64 flex items-center justify-center shadow-lg">
                <div className="text-white text-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                    <path d="M12 4V16M12 4L8 8M12 4L16 8M4 20H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-lg font-semibold">Upload & Generate</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Class Management Dashboard</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Monitor student progress, identify struggling learners, and measure the effectiveness of your teaching materials all in one place.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Individual and class-wide analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Engagement and performance metrics</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Automated progress reports</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl h-64 flex items-center justify-center shadow-lg">
                <div className="text-white text-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                    <path d="M3 3H21V13C21 13.5304 20.7893 14.0391 20.4142 14.4142C20.0391 14.7893 19.5304 15 19 15H5C4.46957 15 3.96086 14.7893 3.58579 14.4142C3.21071 14.0391 3 13.5304 3 13V3Z" stroke="white" strokeWidth="2"/>
                    <path d="M7 19H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 15V19" stroke="white" strokeWidth="2"/>
                    <path d="M14 15V19" stroke="white" strokeWidth="2"/>
                  </svg>
                  <p className="text-lg font-semibold">Track & Analyze</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Share & Collaborate</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Create once, share with all your classes. Collaborate with other teachers in your department to build comprehensive course materials.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>One-click class distribution</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Teacher collaboration features</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#0055FF] mt-1">✓</span>
                    <span>Public or private sharing options</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl h-64 flex items-center justify-center shadow-lg">
                <div className="text-white text-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2"/>
                    <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                    <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15H18" stroke="white" strokeWidth="2"/>
                  </svg>
                  <p className="text-lg font-semibold">Share & Connect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-gray-200 shadow-md p-12 text-center">
            <div className="flex gap-1 justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                </svg>
              ))}
            </div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed italic">
              "Studylo has transformed how I prepare materials for my classes. What used to take me 3-4 hours now takes 15 minutes. My students are more engaged, and their test scores have improved significantly."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0055FF] flex items-center justify-center">
                <span className="text-white font-bold text-xl">DM</span>
              </div>
              <div className="text-left">
                <div className="text-gray-900 font-bold">Dr. Michael Chen</div>
                <div className="text-gray-600">AP Biology Teacher, Boston Latin School</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join thousands of educators using Studylo to create better learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Request Demo
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              View Pricing
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Special educator pricing available • Free trial included
          </p>
        </div>
      </section>
    </div>
  );
}

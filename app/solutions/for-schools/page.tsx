import Header from '../../components/Header';

export default function ForSchools() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FOR SCHOOLS</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Transform Learning <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">School-Wide</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Empower your entire institution with AI-powered study tools. Improve outcomes, support teachers, and engage students at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Schedule Demo
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              Download Brochure
            </button>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="w-full px-6 py-16 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">2,500+</div>
              <div className="text-gray-600 text-lg">Schools</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">28%</div>
              <div className="text-gray-600 text-lg">Grade Improvement</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">15hrs</div>
              <div className="text-gray-600 text-lg">Saved Per Teacher/Week</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">94%</div>
              <div className="text-gray-600 text-lg">Teacher Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete School Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything your institution needs to deliver exceptional learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2"/>
                  <path d="M8 7H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 17H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">District-Wide Administration</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Centralized dashboard to manage all schools, teachers, and students. Deploy updates instantly across your entire district.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Single sign-on (SSO) integration</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Bulk user management</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Role-based access control</span>
                </li>
              </ul>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#F97316] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" stroke="white" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="white" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="white" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Track performance across schools, grades, and subjects. Identify trends and make data-driven decisions to improve outcomes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Real-time performance dashboards</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Predictive analytics for at-risk students</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Custom reporting and exports</span>
                </li>
              </ul>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#14B8A6] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="white" strokeWidth="2"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Development</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Comprehensive training and ongoing support to ensure teachers get maximum value from Studylo.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Teacher onboarding programs</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Live workshops and webinars</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Dedicated success manager</span>
                </li>
              </ul>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-[#8B5CF6] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Security & Compliance</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Enterprise-grade security with full FERPA, COPPA, and GDPR compliance to protect student data.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>SOC 2 Type II certified</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span>Regular security audits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how schools are achieving remarkable results with Studylo.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-[#0055FF] font-semibold mb-4">CASE STUDY</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Lincoln High School District
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  After implementing Studylo across all 12 schools, Lincoln High School District saw a 32% improvement in standardized test scores and a 40% reduction in teacher prep time.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold text-[#0055FF] mb-1">32%</div>
                    <div className="text-gray-600 text-sm">Test Score Increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#0055FF] mb-1">40%</div>
                    <div className="text-gray-600 text-sm">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#0055FF] mb-1">8,500</div>
                    <div className="text-gray-600 text-sm">Active Students</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#0055FF] mb-1">98%</div>
                    <div className="text-gray-600 text-sm">Teacher Adoption</div>
                  </div>
                </div>
                <button className="text-[#0055FF] font-semibold hover:underline">
                  Read Full Case Study →
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl h-80 flex items-center justify-center shadow-lg">
                <div className="text-white text-center p-8">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                  </svg>
                  <p className="text-2xl font-bold">Excellence in Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Implementation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We handle everything from setup to training, so you can focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0055FF] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Consultation</h4>
              <p className="text-gray-600 text-sm">We assess your needs and create a custom implementation plan.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0055FF] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">2</div>
              <h4 className="font-bold text-gray-900 mb-2">Setup</h4>
              <p className="text-gray-600 text-sm">Quick integration with your existing systems and student information.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0055FF] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Training</h4>
              <p className="text-gray-600 text-sm">Comprehensive professional development for all teachers and staff.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0055FF] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">4</div>
              <h4 className="font-bold text-gray-900 mb-2">Launch</h4>
              <p className="text-gray-600 text-sm">Go live with ongoing support from your dedicated success team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-lg text-white mb-8 leading-relaxed opacity-95">
            Join thousands of schools using Studylo to improve student outcomes and support teachers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white hover:bg-gray-50 text-[#0055FF] px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
              Schedule Demo
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
              Contact Sales
            </button>
          </div>
          <p className="text-white text-sm mt-4 opacity-90">
            Custom pricing • Dedicated support • Implementation included
          </p>
        </div>
      </section>
    </div>
  );
}

import Header from '../../components/Header';

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">ENTERPRISE</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Learning at <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Enterprise Scale</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Custom solutions for large organizations, universities, and multi-district deployments. Enterprise-grade security, unlimited scale, and white-glove support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Contact Sales
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
              Request Custom Demo
            </button>
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="w-full px-6 py-12 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm uppercase tracking-wide font-semibold">Trusted by Leading Organizations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {['University System', 'Global Corp', 'State Education', 'Tech Institute', 'Medical School'].map((org, i) => (
              <div key={i} className="text-gray-400 font-bold text-lg">{org}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Enterprise Requirements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to deploy, manage, and scale learning solutions across your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">SSO & Identity Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                SAML 2.0, OAuth, Active Directory integration. Automated provisioning and de-provisioning.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 8V12L14 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">99.99% Uptime SLA</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Guaranteed reliability with 24/7 monitoring and instant failover protection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Security</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                SOC 2 Type II, FERPA, GDPR compliant. Custom security policies and audit logs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 8H17M7 12H17M7 16H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Custom API Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Full REST API access for custom integrations with your existing systems.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support Team</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                24/7 priority support with dedicated account managers and technical specialists.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,85,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Data Export & Portability</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Full data ownership with export capabilities and migration assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tailored to Your Needs
            </h2>
            <p className="text-lg text-gray-600">
              We work with you to create the perfect solution for your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">White Labeling</h3>
              <p className="text-gray-600 leading-relaxed">
                Custom branding with your logo, colors, and domain for a seamless experience.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                🔧
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Features</h3>
              <p className="text-gray-600 leading-relaxed">
                We can build custom features and workflows specific to your requirements.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                🌐
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">On-Premise Options</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy on your infrastructure for maximum control and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Custom pricing based on your organization's size, needs, and usage.
          </p>

          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-gray-200 shadow-lg p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Unlimited users and content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">White-label options</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Dedicated success manager</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Custom integrations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Priority 24/7 support</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">99.99% uptime SLA</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Advanced analytics & reporting</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0055FF] mt-1">✓</span>
                <span className="text-gray-700">Training & onboarding</span>
              </div>
            </div>
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Contact Sales for Pricing
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-lg text-white mb-8 leading-relaxed opacity-95">
            Our enterprise team is ready to discuss your unique requirements and create a custom solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white hover:bg-gray-50 text-[#0055FF] px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
              Schedule a Call
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
              Email Us
            </button>
          </div>
          <p className="text-white text-sm mt-6 opacity-90">
            Typical response time: 1 business hour
          </p>
        </div>
      </section>
    </div>
  );
}

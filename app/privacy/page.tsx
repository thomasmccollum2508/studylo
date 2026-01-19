import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">PRIVACY POLICY</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] text-center">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 text-center mb-4">
            Last updated: January 19, 2026
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            At Studylo, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </main>

      {/* Content Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-semibold text-gray-900 mt-6">Information You Provide</h3>
                <p>
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Profile information (optional)</li>
                  <li>Study materials you create or upload</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Information Collected Automatically</h3>
                <p>
                  When you use our service, we automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (features used, time spent studying)</li>
                  <li>IP address and approximate location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Create and manage your account</li>
                  <li>Generate AI-powered study materials</li>
                  <li>Personalize your learning experience</li>
                  <li>Send you important updates and notifications</li>
                  <li>Analyze usage patterns to improve our product</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We do not sell your personal information. We may share your data with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Third parties who help us operate our service (hosting, analytics, payment processing)</li>
                  <li><strong>AI Partners:</strong> To process and generate study materials (data is anonymized when possible)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-4">
                  If you choose to make study sets public, they will be visible to other Studylo users.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption in transit and at rest</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication protocols</li>
                  <li>SOC 2 Type II compliance</li>
                  <li>FERPA, COPPA, and GDPR compliance</li>
                </ul>
                <p className="mt-4">
                  While we strive to protect your data, no method of transmission over the internet is 100% secure.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Export:</strong> Download your study materials</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
                  <li><strong>Object:</strong> Object to certain data processing activities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at privacy@studylo.com
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences</li>
                  <li>Keep you signed in</li>
                  <li>Analyze how you use our service</li>
                  <li>Improve our website and app</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Studylo is designed for users 13 and older. If you are under 13, you must have parental consent to use our service.
                </p>
                <p>
                  We comply with COPPA (Children's Online Privacy Protection Act) and do not knowingly collect information from children under 13 without parental consent.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. International Users</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Studylo is based in the United States. If you access our service from outside the U.S., your information may be transferred to and processed in the U.S.
                </p>
                <p>
                  We comply with applicable data protection laws, including GDPR for European users.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We'll notify you of significant changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the new policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification (for material changes)</li>
                </ul>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-xl p-6 mt-4">
                  <p className="font-semibold text-gray-900">Studylo, Inc.</p>
                  <p>Email: privacy@studylo.com</p>
                  <p>Address: 123 Education Street, San Francisco, CA 94102</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to help. Reach out anytime with concerns or questions.
          </p>
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Contact Privacy Team
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">TERMS OF SERVICE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] text-center">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 text-center mb-4">
            Last updated: January 19, 2026
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            Please read these terms carefully before using Studylo. By using our service, you agree to be bound by these terms.
          </p>
        </div>
      </main>

      {/* Content Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  By accessing or using Studylo ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p>
                  We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Studylo provides AI-powered study tools including flashcard generation, quizzes, spaced repetition systems, and related educational features.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-semibold text-gray-900 mt-6">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 13 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You may not share your account with others</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in harmful behavior. You may delete your account at any time through account settings.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. User Content</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-semibold text-gray-900 mt-6">Your Content</h3>
                <p>
                  You retain ownership of content you create or upload ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and display your content to provide the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Content Restrictions</h3>
                <p>You agree not to upload or create content that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violates any laws or regulations</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains hate speech, harassment, or threats</li>
                  <li>Contains explicit or inappropriate material</li>
                  <li>Contains malware or malicious code</li>
                  <li>Violates academic integrity policies</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Community Content</h3>
                <p>
                  If you make study sets public, other users may view and use them for educational purposes. You grant other Studylo users a license to access and use your public content within the Service.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Scrape or systematically collect data</li>
                  <li>Create multiple accounts to evade restrictions</li>
                  <li>Reverse engineer or decompile our software</li>
                  <li>Use the Service to cheat or violate academic integrity</li>
                  <li>Resell or redistribute the Service without permission</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Service, including its design, features, and content (excluding User Content), is owned by Studylo and protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, or create derivative works based on our intellectual property without explicit permission.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Payments and Subscriptions</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-semibold text-gray-900 mt-6">Paid Plans</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We reserve the right to change pricing with 30 days notice</li>
                  <li>You can cancel your subscription at any time</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Free Trial</h3>
                <p>
                  We may offer free trials for premium features. You won't be charged until the trial period ends. Cancel before the trial ends to avoid charges.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Cancellation</h3>
                <p>
                  You may cancel your subscription at any time. You'll retain access until the end of your current billing period. No refunds will be provided for partial months.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p>
                  We do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Service will be uninterrupted or error-free</li>
                  <li>Defects will be corrected</li>
                  <li>The Service is free from viruses or harmful components</li>
                  <li>The accuracy or completeness of AI-generated content</li>
                  <li>That using the Service will improve your grades or test scores</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDYLO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p>
                  Our total liability to you for all claims arising from your use of the Service shall not exceed the amount you paid us in the 12 months prior to the claim, or $100, whichever is greater.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Academic Integrity</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Studylo is designed to help you learn, not to facilitate cheating. You are responsible for using the Service in accordance with your institution's academic integrity policies.
                </p>
                <p>
                  We prohibit using our Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete assignments or tests on behalf of students</li>
                  <li>Share exam questions or answers</li>
                  <li>Circumvent academic integrity measures</li>
                </ul>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  These Terms shall be governed by the laws of the State of California, United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in San Francisco, California.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 rounded-xl p-6 mt-4">
                  <p className="font-semibold text-gray-900">Studylo, Inc.</p>
                  <p>Email: legal@studylo.com</p>
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
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            By creating an account, you agree to these Terms of Service.
          </p>
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

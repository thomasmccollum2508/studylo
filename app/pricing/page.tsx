import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">PRICING</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Choose Your <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Perfect Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start free and upgrade when you need more power. No credit card required.
          </p>
        </div>
      </main>

      {/* Pricing Cards */}
      <section className="w-full px-6 py-16 bg-white -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-5xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-gray-600 mb-8">Forever free</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">50 AI-generated flashcards/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">5 study sets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Basic spaced repetition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Community access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Mobile app access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-300 mt-1">✕</span>
                  <span className="text-gray-400">Unlimited AI generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-300 mt-1">✕</span>
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-300 mt-1">✕</span>
                  <span className="text-gray-400">Offline access</span>
                </li>
              </ul>

              <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 py-3 rounded-[15px] font-semibold transition-all duration-300 hover:-translate-y-1">
                Get Started Free
              </button>
            </div>

            {/* Premium Plan - Most Popular */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border-2 border-[#0055FF] shadow-xl p-8 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#0055FF] text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-5xl font-bold text-gray-900 mb-1">$9.99</div>
              <p className="text-gray-600 mb-8">Per month, billed monthly</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700"><strong>Unlimited</strong> AI-generated content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700"><strong>Unlimited</strong> study sets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Advanced spaced repetition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Detailed analytics & insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Offline access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Custom study modes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Export & backup</span>
                </li>
              </ul>

              <button className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white py-3 rounded-[15px] font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1">
                Start Free Trial
              </button>
              <p className="text-center text-gray-500 text-xs mt-3">7-day free trial, cancel anytime</p>
            </div>

            {/* Premium Plus Plan */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plus</h3>
              <div className="text-5xl font-bold text-gray-900 mb-1">$14.99</div>
              <p className="text-gray-600 mb-8">Per month, billed monthly</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700"><strong>Everything in Premium</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">AI tutor chat assistant</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Video & audio notes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Collaborative study groups</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Advanced AI models</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Priority AI processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">Custom branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0055FF] mt-1">✓</span>
                  <span className="text-gray-700">White-glove support</span>
                </li>
              </ul>

              <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 py-3 rounded-[15px] font-semibold transition-all duration-300 hover:-translate-y-1">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Discount Banner */}
      <section className="w-full px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-xl font-semibold mb-2">
            💰 Save 20% with Annual Billing
          </p>
          <p className="text-blue-100">
            Pay yearly and save $24 on Premium or $36 on Premium Plus
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes! Cancel your subscription at any time with no penalties. You'll keep access until the end of your billing period.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay. All payments are secure and encrypted.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-2">Do you offer student discounts?</h4>
              <p className="text-gray-600">Yes! Students get 15% off Premium plans with a valid .edu email address. Verify your student status during checkout.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-2">What happens to my data if I downgrade?</h4>
              <p className="text-gray-600">Your data is never deleted. If you downgrade, you'll keep all your study sets but some premium features will be locked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 500,000+ students already achieving better grades with Studylo.
          </p>
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Start Your Free Trial
          </button>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

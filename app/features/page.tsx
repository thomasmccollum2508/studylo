import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "AI Flashcard Generator",
      description: "Upload any document and instantly create perfect flashcards. Our AI understands context and creates questions that test real understanding, not just memorization.",
      benefits: ["Supports PDFs, images, and text", "Handwriting recognition", "Smart content extraction", "Custom card formatting"]
    },
    {
      icon: "🎯",
      title: "Smart Quizzes",
      description: "Take AI-generated quizzes that adapt to your learning level. Get instant feedback and detailed explanations for every question.",
      benefits: ["Multiple question types", "Adaptive difficulty", "Instant feedback", "Performance tracking"]
    },
    {
      icon: "🔄",
      title: "Spaced Repetition",
      description: "Our algorithm shows you cards right before you'd forget them, maximizing retention with minimal study time.",
      benefits: ["Scientifically proven method", "Personalized schedules", "85% better retention", "Smart review timing"]
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Track your learning with detailed insights. See which topics you've mastered and where you need more practice.",
      benefits: ["Visual progress charts", "Strength/weakness analysis", "Study time tracking", "Goal setting tools"]
    },
    {
      icon: "👥",
      title: "Study Groups",
      description: "Create or join study groups with classmates. Share materials, compete on leaderboards, and learn together.",
      benefits: ["Group flashcards", "Shared quizzes", "Real-time collaboration", "Group chat"]
    },
    {
      icon: "📱",
      title: "Mobile & Offline Access",
      description: "Study anywhere, anytime. Full mobile apps with offline mode so you can learn on the go without internet.",
      benefits: ["iOS and Android apps", "Offline study mode", "Cloud sync", "Push reminders"]
    },
    {
      icon: "🎨",
      title: "Custom Study Modes",
      description: "Choose from multiple study modes: traditional flashcards, matching games, typing practice, and more.",
      benefits: ["Flashcard mode", "Match mode", "Test mode", "Learn mode"]
    },
    {
      icon: "🔊",
      title: "Audio & TTS Support",
      description: "Listen to your flashcards with text-to-speech. Perfect for auditory learners and studying while commuting.",
      benefits: ["Multiple languages", "Natural voices", "Speed control", "Background play"]
    },
    {
      icon: "🌐",
      title: "Multi-Language Support",
      description: "Create study sets in any language. Perfect for language learners and international students.",
      benefits: ["100+ languages", "Auto-translation", "Language detection", "Cultural context"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FEATURES</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Everything You Need to <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Ace Your Exams</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Powerful AI-driven tools designed to help you study smarter, remember longer, and achieve your academic goals.
          </p>
          <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
            Try All Features Free
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-[#0055FF] mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See Studylo in Action
            </h2>
            <p className="text-lg text-gray-600">
              Watch how easy it is to create and study with AI-powered tools.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-96 flex items-center justify-center shadow-xl">
            <div className="text-white text-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                <path d="M10 8L16 12L10 16V8Z" fill="white"/>
              </svg>
              <p className="text-2xl font-bold">Product Demo Video</p>
              <p className="text-lg opacity-90 mt-2">2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-gray-200 shadow-md p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience All Features?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start your free trial today and unlock the full power of AI-assisted learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
                Start Free Trial
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:-translate-y-1">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

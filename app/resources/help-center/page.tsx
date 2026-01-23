import Header from '../../components/Header';

export default function HelpCenter() {
  const categories = [
    {
      title: "Getting Started",
      icon: "🚀",
      articles: [
        "How to create your first study set",
        "Uploading notes and documents",
        "Understanding your dashboard",
        "Account setup and preferences"
      ]
    },
    {
      title: "Creating Content",
      icon: "✏️",
      articles: [
        "Making effective flashcards",
        "Generating quizzes from notes",
        "Using AI to create study materials",
        "Editing and organizing content"
      ]
    },
    {
      title: "Studying",
      icon: "📚",
      articles: [
        "How spaced repetition works",
        "Taking practice quizzes",
        "Tracking your progress",
        "Study modes explained"
      ]
    },
    {
      title: "Account & Billing",
      icon: "💳",
      articles: [
        "Upgrading to premium",
        "Managing your subscription",
        "Billing and payments",
        "Account security"
      ]
    },
    {
      title: "Troubleshooting",
      icon: "🔧",
      articles: [
        "Common technical issues",
        "App not loading properly",
        "Syncing problems",
        "Browser compatibility"
      ]
    },
    {
      title: "Tips & Best Practices",
      icon: "💡",
      articles: [
        "Maximizing retention",
        "Creating a study routine",
        "Collaborative studying",
        "Exam preparation strategies"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">HELP CENTER</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            How Can We <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Help You?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Find answers, guides, and resources to get the most out of Studylo.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for help articles..." 
                className="w-full px-6 py-4 pr-12 rounded-[15px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF] text-lg text-black"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Categories Grid */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a href="#" className="text-gray-600 hover:text-[#0055FF] text-sm transition-colors flex items-center gap-2">
                        <span className="text-[#0055FF]">→</span>
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Most Popular Articles</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md divide-y divide-gray-200">
            <a href="#" className="block p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">How to Create Effective Flashcards</h4>
                  <p className="text-gray-600 text-sm">Learn the best practices for making flashcards that stick.</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 ml-4">
                  <path d="M9 18L15 12L9 6" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
            <a href="#" className="block p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Understanding Spaced Repetition</h4>
                  <p className="text-gray-600 text-sm">Discover how our algorithm helps you remember more.</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 ml-4">
                  <path d="M9 18L15 12L9 6" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
            <a href="#" className="block p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Uploading and Processing Documents</h4>
                  <p className="text-gray-600 text-sm">Step-by-step guide to getting your notes into Studylo.</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 ml-4">
                  <path d="M9 18L15 12L9 6" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-gray-200 shadow-md p-12">
            <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,85,255,0.4)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our support team is here to help you succeed. Reach out anytime.
            </p>
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

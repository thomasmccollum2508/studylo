import Header from '../components/Header';
import Footer from '../components/Footer';

export default function StudySets() {
  const popularSets = [
    {
      title: "AP Biology: Complete Course",
      author: "Dr. Sarah Chen",
      cards: 847,
      users: "45.2K",
      subjects: ["Cell Biology", "Genetics", "Evolution", "Ecology"]
    },
    {
      title: "SAT Vocabulary Master",
      author: "Test Prep Academy",
      cards: 1200,
      users: "128K",
      subjects: ["Vocabulary", "Word Roots", "Synonyms", "Usage"]
    },
    {
      title: "Spanish A1-B2 Complete",
      author: "Maria Rodriguez",
      cards: 2100,
      users: "67.5K",
      subjects: ["Vocabulary", "Grammar", "Verbs", "Phrases"]
    },
    {
      title: "Medical Terminology",
      author: "Med School Prep",
      cards: 1500,
      users: "89.3K",
      subjects: ["Anatomy", "Prefixes", "Suffixes", "Root Words"]
    },
    {
      title: "World History Timeline",
      author: "Prof. Johnson",
      cards: 950,
      users: "52.1K",
      subjects: ["Ancient", "Medieval", "Modern", "Contemporary"]
    },
    {
      title: "Organic Chemistry Reactions",
      author: "Chemistry Hub",
      cards: 678,
      users: "41.8K",
      subjects: ["Mechanisms", "Synthesis", "Reactions", "Nomenclature"]
    }
  ];

  const categories = [
    { name: "Science", count: "2.5M", icon: "🔬" },
    { name: "Mathematics", count: "1.8M", icon: "📐" },
    { name: "Languages", count: "3.2M", icon: "🌍" },
    { name: "History", count: "1.5M", icon: "📚" },
    { name: "Medicine", count: "980K", icon: "⚕️" },
    { name: "Technology", count: "1.2M", icon: "💻" },
    { name: "Business", count: "850K", icon: "💼" },
    { name: "Arts", count: "650K", icon: "🎨" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">STUDY SETS</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            10 Million+ <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Study Sets</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Access the world's largest library of study materials. Find the perfect set for your course or create your own in seconds.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by topic, course, or keyword..." 
                className="w-full px-6 py-4 pr-14 rounded-[15px] border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent text-lg text-black"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#0055FF] hover:bg-[#0044CC] text-white p-3 rounded-[12px] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Categories */}
      <section className="w-full px-6 py-16 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <button key={index} className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0055FF] rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{category.name}</div>
                <div className="text-gray-600 text-sm">{category.count} sets</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Study Sets */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Study Sets</h2>
            <button className="text-[#0055FF] font-semibold hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSets.map((set, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{set.title}</h3>
                  <div className="flex items-center gap-1 ml-2">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="#0055FF" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L12.5 6.5L18.5 7.5L14 12L15 18L10 15L5 18L6 12L1.5 7.5L7.5 6.5L10 1Z" fill="#0055FF"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">by {set.author}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{set.cards} cards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{set.users}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {set.subjects.slice(0, 3).map((subject, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-[#0055FF] px-2 py-1 rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Your Own CTA */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-12 text-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="#0055FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Create Your Own Study Set
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed opacity-95">
              Upload your notes and let AI create a perfect study set in seconds. It's free to get started!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white hover:bg-gray-50 text-[#0055FF] px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
                Create Study Set
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                Watch How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">10M+</div>
              <div className="text-gray-600 text-lg">Study Sets Available</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">500K+</div>
              <div className="text-gray-600 text-lg">Active Contributors</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">1B+</div>
              <div className="text-gray-600 text-lg">Cards Studied Daily</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

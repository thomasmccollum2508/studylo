import Header from '../../components/Header';

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Proven Study Techniques That Actually Work",
      excerpt: "Discover evidence-based study methods that can transform your learning efficiency and retention.",
      category: "Study Tips",
      date: "Jan 15, 2026",
      readTime: "5 min read"
    },
    {
      title: "How to Use Spaced Repetition for Long-Term Memory",
      excerpt: "Master the science of spaced repetition and never forget important information again.",
      category: "Learning Science",
      date: "Jan 12, 2026",
      readTime: "7 min read"
    },
    {
      title: "AI in Education: The Future of Personalized Learning",
      excerpt: "Explore how artificial intelligence is revolutionizing the way students learn and retain information.",
      category: "Technology",
      date: "Jan 10, 2026",
      readTime: "6 min read"
    },
    {
      title: "Beat Test Anxiety: Expert Tips from Psychology",
      excerpt: "Learn proven strategies to manage stress and perform your best on exam day.",
      category: "Mental Health",
      date: "Jan 8, 2026",
      readTime: "4 min read"
    },
    {
      title: "Creating Effective Flashcards: A Complete Guide",
      excerpt: "Master the art of flashcard creation with these expert tips and best practices.",
      category: "Study Tips",
      date: "Jan 5, 2026",
      readTime: "8 min read"
    },
    {
      title: "The Science Behind Active Recall",
      excerpt: "Understand why testing yourself is the most powerful learning technique available.",
      category: "Learning Science",
      date: "Jan 3, 2026",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">BLOG</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Learn How to <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Study Smarter</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Expert tips, learning science, and study strategies to help you achieve your academic goals.
          </p>
        </div>
      </main>

      {/* Blog Posts Grid */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#0055FF] text-xs font-semibold uppercase">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    <button className="text-[#0055FF] text-sm font-semibold hover:underline">Read More →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-12">
            <div className="w-16 h-16 rounded-full bg-[#0055FF] flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,85,255,0.4)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Study Tips in Your Inbox
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Subscribe to our newsletter for weekly study tips, learning strategies, and exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-6 py-3 rounded-[15px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF] text-black"
              />
              <button className="w-full sm:w-auto bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-3 rounded-[15px] font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

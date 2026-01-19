import Header from '../../components/Header';

export default function StudyTips() {
  const tips = [
    {
      icon: "⏰",
      title: "Use the Pomodoro Technique",
      description: "Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout."
    },
    {
      icon: "🧠",
      title: "Practice Active Recall",
      description: "Test yourself regularly instead of just re-reading notes. This strengthens memory pathways."
    },
    {
      icon: "📅",
      title: "Space Out Your Learning",
      description: "Study the same material multiple times over days or weeks rather than cramming all at once."
    },
    {
      icon: "✍️",
      title: "Write by Hand",
      description: "Taking notes by hand engages your brain more deeply than typing, leading to better retention."
    },
    {
      icon: "🎯",
      title: "Set Specific Goals",
      description: "Instead of 'study biology,' try 'complete 20 flashcards on cell division.' Be specific."
    },
    {
      icon: "🔄",
      title: "Teach Someone Else",
      description: "Explaining concepts to others reveals gaps in your understanding and reinforces learning."
    },
    {
      icon: "🎨",
      title: "Use Multiple Formats",
      description: "Combine flashcards, quizzes, diagrams, and summaries to engage different learning pathways."
    },
    {
      icon: "😴",
      title: "Get Enough Sleep",
      description: "Sleep consolidates memories. Aim for 7-9 hours, especially before exams."
    },
    {
      icon: "🏃",
      title: "Take Movement Breaks",
      description: "Physical activity increases blood flow to the brain and improves focus when you return."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">STUDY TIPS</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Master Your <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Study Habits</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Evidence-based techniques to help you learn more effectively and retain information longer.
          </p>
        </div>
      </main>

      {/* Tips Grid */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="text-5xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Schedule Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Perfect Study Schedule
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Structure is key to consistent learning. Here's how to build a schedule that works.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055FF] text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Identify Your Peak Hours</h4>
                  <p className="text-gray-600">Notice when you're most alert and schedule difficult subjects during those times.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055FF] text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Block Time for Each Subject</h4>
                  <p className="text-gray-600">Allocate specific time blocks to each subject based on difficulty and importance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055FF] text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Include Breaks</h4>
                  <p className="text-gray-600">Regular breaks prevent burnout and improve long-term retention.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055FF] text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Review Daily</h4>
                  <p className="text-gray-600">Spend 10-15 minutes each day reviewing what you learned. This compounds over time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-gray-200 shadow-md p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Put These Tips Into Action?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start using Studylo to implement these proven study techniques automatically.
            </p>
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:shadow-[0_0_20px_rgba(0,85,255,0.5)] hover:-translate-y-1 hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const team = [
    { name: "Alex Chen", role: "CEO & Co-Founder", initial: "AC" },
    { name: "Sarah Johnson", role: "CTO & Co-Founder", initial: "SJ" },
    { name: "Michael Rodriguez", role: "Head of Product", initial: "MR" },
    { name: "Emily Zhang", role: "Head of AI/ML", initial: "EZ" },
    { name: "David Kim", role: "Head of Design", initial: "DK" },
    { name: "Lisa Patel", role: "Head of Education", initial: "LP" }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Student-First",
      description: "Every decision we make starts with asking: 'Is this best for students?'"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "We push boundaries with AI to create tools that didn't exist before."
    },
    {
      icon: "🤝",
      title: "Accessibility",
      description: "Quality education tools should be available to everyone, everywhere."
    },
    {
      icon: "💡",
      title: "Evidence-Based",
      description: "We build on learning science, not assumptions. Data guides our product."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">ABOUT US</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            We're on a <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">Mission</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            To make world-class learning tools accessible to every student, powered by AI and grounded in science.
          </p>
        </div>
      </main>

      {/* Story Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Studylo was born in 2022 when two frustrated graduate students realized they were spending more time making flashcards than actually studying. They wondered: "What if AI could do this for us?"
              </p>
              <p>
                That simple question turned into thousands of lines of code, countless late nights, and eventually, a product that would help millions of students study more effectively. What started as a side project in a college dorm room has grown into one of the most popular study platforms in the world.
              </p>
              <p>
                Today, Studylo serves over 500,000 students across 150 countries. We've helped students ace the SAT, pass medical boards, learn new languages, and achieve their academic dreams. But we're just getting started.
              </p>
              <p>
                Our team of educators, AI researchers, and designers works tirelessly to build tools that don't just help students memorize—they help students truly learn. Because at the end of the day, education isn't about grades. It's about unlocking human potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md p-8">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet the Team</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            A diverse group of educators, engineers, and designers united by a passion for transforming education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-3xl">{member.initial}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">500K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">150</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">10M+</div>
              <div className="text-gray-600">Study Sets</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#0055FF] mb-2">1B+</div>
              <div className="text-gray-600">Cards Studied</div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="w-full px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">In the News</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-700 italic mb-3">
                "Studylo is revolutionizing how students prepare for exams with cutting-edge AI technology that actually understands learning science."
              </p>
              <p className="text-gray-600 font-semibold">— TechCrunch, 2024</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-700 italic mb-3">
                "The most impressive education technology we've seen in years. Studylo combines powerful AI with an intuitive interface that students love."
              </p>
              <p className="text-gray-600 font-semibold">— EdTech Magazine, 2024</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-700 italic mb-3">
                "A game-changer for students worldwide. Studylo is democratizing access to effective study tools."
              </p>
              <p className="text-gray-600 font-semibold">— The Wall Street Journal, 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-16 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-lg text-white mb-8 leading-relaxed opacity-95">
            Whether you're a student, teacher, or just passionate about education, we'd love to have you be part of our journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white hover:bg-gray-50 text-[#F97316] px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
              Get Started Free
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-[15px] text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
              View Open Positions
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

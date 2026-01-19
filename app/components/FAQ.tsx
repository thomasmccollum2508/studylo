'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "How does the AI create flashcards from my notes?",
    answer: "Our AI analyzes your notes and extracts key concepts, definitions, and important information. It then automatically generates question-answer pairs optimized for effective learning."
  },
  {
    question: "Is Studylo really free?",
    answer: "Yes! Studylo offers a free forever plan with access to core features. You can create unlimited study sets and flashcards without any credit card required."
  },
  {
    question: "What subjects does Studylo work for?",
    answer: "Studylo works for all subjects - from STEM and Social Sciences to Liberal Arts. Whether you're studying math, history, languages, or science, our AI adapts to your content."
  },
  {
    question: "How is spaced repetition different from normal reviewing?",
    answer: "Spaced repetition shows you material right before you're about to forget it, based on scientific algorithms. This means you review less frequently but remember more effectively compared to random cramming."
  },
  {
    question: "Can I share study sets with classmates?",
    answer: "Absolutely! You can share your study sets with friends and classmates. Collaboration features allow multiple people to contribute and study together."
  },
  {
    question: "Does Studylo work on mobile?",
    answer: "Yes, Studylo is fully responsive and works great on mobile devices. You can access all features through your mobile browser, and we're working on dedicated mobile apps."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full px-6 py-16 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-[#0055FF] text-sm font-semibold uppercase tracking-wide drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Got questions? <span className="text-[#0055FF] drop-shadow-[0_0_2px_rgba(0,85,255,0.2)]">We've got answers</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Studylo.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-md"
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 font-semibold text-lg pr-8">
                  {item.question}
                </h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-6 py-12 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Studylo Branding */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Link href="/">
                <img 
                  src="/studylo%20logo%202.png" 
                  alt="StudyLo Logo" 
                  className="h-10 w-auto cursor-pointer"
                />
              </Link>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered study tools that help you learn faster and remember longer.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/study-sets" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Study Sets</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources/blog" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Blog</Link></li>
              <li><Link href="/resources/study-tips" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Study Tips</Link></li>
              <li><Link href="/resources/help-center" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">About</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Studylo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

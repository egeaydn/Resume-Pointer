import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-6 mt-12">
      <div className="container mx-auto px-6 text-center text-sm text-gray-600">
        <p>© 2026 CVScorer. Built with Next.js.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link 
            href="/privacy" 
            className="hover:text-red-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <a 
            href="https://github.com/yourusername/cvscorer" 
            className="hover:text-red-600 transition-colors" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

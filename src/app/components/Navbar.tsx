import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-red-600 text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
            CVScorer
          </Link>
        </div>
        <div className="flex gap-6">
          <Link 
            href="/" 
            className="hover:underline transition-all"
            aria-label="Go to home page"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="hover:underline transition-all"
            aria-label="Learn about CVScorer"
          >
            About
          </Link>
          <Link 
            href="/faq" 
            className="hover:underline transition-all"
            aria-label="Frequently asked questions"
          >
            FAQ
          </Link>
        </div>
      </nav>
    </header>
  );
}

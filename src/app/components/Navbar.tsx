import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">
              CVScorer
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium">
              About
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-red-600 font-medium">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

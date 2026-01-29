import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About - CVScorer',
  description: 'Learn about CVScorer, a free rule-based resume analysis tool',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <article className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              About CVScorer
            </h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <p className="text-xl text-center text-gray-600 mb-12">
                CVScorer is a free, rule-based resume analysis tool that helps job seekers improve their CVs before applying.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How It Works
                </h2>
                <ul className="space-y-3 text-base">
                  <li>• Upload your CV (PDF or DOCX)</li>
                  <li>• Instant analysis using proven criteria</li>
                  <li>• Get a 0-100 score with detailed feedback</li>
                  <li>• Make improvements and re-test</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Why Rule-Based?
                </h2>
                <p>
                  We use transparent, deterministic rules instead of AI to ensure consistency and explainability. 
                  You&apos;ll always understand exactly why you got your score.
                </p>
                <p className="mt-4">
                  Our scoring system evaluates your CV across five key dimensions:
                </p>
                <ul className="space-y-2 mt-2 text-base">
                  <li>• <strong>CV Structure & Sections (15 points)</strong> - Essential sections like contact, experience, education</li>
                  <li>• <strong>Technical Skills (20 points)</strong> - Relevant keywords and domain expertise</li>
                  <li>• <strong>Work Experience (30 points)</strong> - Action verbs, quantified achievements, bullet points</li>
                  <li>• <strong>Education (15 points)</strong> - Academic background and certifications</li>
                  <li>• <strong>Formatting & Readability (20 points)</strong> - Length, structure, professional presentation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Privacy
                </h2>
                <p>
                  Your CV is processed in-memory and never stored. We don&apos;t track or save any of your personal information. 
                  All analysis happens locally in your browser session, and your data is immediately discarded after providing feedback.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Features
                </h2>
                <ul className="space-y-2 text-base">
                  <li>✓ Instant analysis (2-3 seconds)</li>
                  <li>✓ 100% free, no sign-up required</li>
                  <li>✓ Privacy-first approach</li>
                  <li>✓ Detailed actionable feedback</li>
                  <li>✓ Support for PDF and DOCX formats</li>
                  <li>✓ 400+ technical skills recognized</li>
                  <li>✓ 150+ professional action verbs detected</li>
                </ul>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  About This Project
                </h2>
                <p>
                  CVScorer was built as a portfolio project to demonstrate full-stack development skills using modern web technologies. 
                  It combines practical utility with technical excellence, showcasing expertise in Next.js, TypeScript, AI-assisted 
                  development, and software engineering best practices.
                </p>
                <p className="mt-4 text-sm">
                  <strong>Tech Stack:</strong> Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Jest, React Testing Library
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About CVScorer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">What is CVScorer?</h2>
            <p className="text-gray-700 leading-relaxed">
              CVScorer is a free, privacy-first tool that helps job seekers improve their resumes. 
              Using a transparent, rule-based scoring system, we analyze your CV across 5 key categories 
              and provide actionable feedback to help you stand out to recruiters and ATS systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li><strong>Upload Your CV:</strong> Drag and drop your PDF or DOCX file</li>
              <li><strong>Instant Analysis:</strong> Our system extracts text and evaluates it against proven criteria</li>
              <li><strong>Get Your Score:</strong> Receive a 0-100 score with detailed breakdown</li>
              <li><strong>Implement Feedback:</strong> Use our specific suggestions to improve your CV</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Scoring Categories</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>CV Structure (15 pts):</strong> Checks for essential sections like Contact, Experience, Education, Skills</li>
              <li><strong>Technical Skills (20 pts):</strong> Evaluates the breadth of your technical competencies</li>
              <li><strong>Work Experience (30 pts):</strong> Analyzes use of action verbs, bullet points, and quantified achievements</li>
              <li><strong>Education (15 pts):</strong> Verifies educational background and qualifications</li>
              <li><strong>Formatting (20 pts):</strong> Assesses overall readability, length, and professional appearance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Why Rule-Based?</h2>
            <p className="text-gray-700 leading-relaxed">
              Unlike AI-powered tools that use opaque "black box" algorithms, CVScorer uses transparent, 
              deterministic rules. You can understand exactly why you received each point and what to improve. 
              Our criteria are based on industry best practices and common ATS screening patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Privacy Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy matters. CVScorer processes your CV entirely in-memory and never stores, 
              logs, or shares your data. Once you close the page, your information is completely gone. 
              No accounts, no tracking, no data collection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Limitations</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Works best with English-language CVs</li>
              <li>Requires text-based PDFs (not scanned images)</li>
              <li>Cannot replace human judgment or industry-specific expertise</li>
              <li>Serves as a "first pass" evaluation tool</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>CVScorer - Rule-based CV evaluation tool</p>
        </div>
      </footer>
    </div>
  );
}

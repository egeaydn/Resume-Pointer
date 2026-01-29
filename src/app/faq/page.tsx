import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FAQ - CVScorer',
  description: 'Frequently asked questions about CVScorer resume analysis tool',
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h1>
            
            <div className="space-y-6">
              <FAQItem
                question="How does the scoring work?"
                answer="CVs are scored across 5 categories: Structure (15 points), Skills (20 points), Experience (30 points), Education (15 points), and Formatting (20 points). Each has specific criteria evaluated using keyword matching and pattern detection."
              />
              
              <FAQItem
                question="Is my data saved?"
                answer="No. Your CV is processed in-memory and immediately discarded after analysis. We don't store, log, or share any of your personal information."
              />
              
              <FAQItem
                question="Why no AI?"
                answer="Rule-based scoring is transparent and consistent. You can trust the results because you understand exactly how each point is calculated. No black-box algorithms or unpredictable AI behavior."
              />
              
              <FAQItem
                question="What file formats are supported?"
                answer="PDF (text-based) and DOCX files up to 5MB. Scanned PDFs require OCR which we don't currently support."
              />
              
              <FAQItem
                question="Can I score multiple CVs?"
                answer="Yes! Upload as many as you like. No limits, no sign-up required, completely free."
              />
              
              <FAQItem
                question="Who is this tool for?"
                answer="Job seekers, students, career changers—anyone preparing a CV for applications. While designed with tech CVs in mind, many criteria apply universally."
              />
              
              <FAQItem
                question="How accurate is the scoring?"
                answer="CVScorer provides a good 'first pass' evaluation based on proven best practices. However, it cannot replace human judgment or industry-specific expertise. Use it as a guide, not a definitive assessment."
              />
              
              <FAQItem
                question="Why did I get a low score?"
                answer="Common reasons include: missing required sections (Contact, Experience, Education, Skills), few technical skills listed, lack of action verbs and quantified achievements, poor formatting, or incorrect length. Review the detailed feedback for specific improvements."
              />
              
              <FAQItem
                question="What should I do after getting my score?"
                answer="Review the detailed feedback for each category, implement the specific suggestions provided, reupload your updated CV to see improvement, and aim for a score of 70+ before submitting to employers."
              />
              
              <FAQItem
                question="Does a high score guarantee I'll get hired?"
                answer="No. A high CV score increases your chances of passing ATS screening and catching recruiter attention, but hiring decisions involve many factors: interviews, culture fit, specific job requirements, competition, and timing."
              />
              
              <FAQItem
                question="Can I download my score report?"
                answer="Currently, scores are displayed on-screen only. We recommend taking screenshots or notes. A downloadable PDF report feature may be added in future versions."
              />
              
              <FAQItem
                question="Is CVScorer really free?"
                answer="Yes! CVScorer is completely free to use with no hidden fees, premium tiers, or subscription requirements."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-2">
        <span className="text-red-600">▼</span>
        {question}
      </h3>
      <p className="text-gray-700 leading-relaxed ml-6">{answer}</p>
    </div>
  );
}

import Navbar from '../components/Navbar';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <FAQItem
            question="Is CVScorer really free?"
            answer="Yes! CVScorer is completely free to use with no hidden fees, premium tiers, or subscription requirements."
          />
          
          <FAQItem
            question="What file formats are supported?"
            answer="We currently support PDF and DOCX files up to 5MB in size. The PDF must be text-based (not a scanned image)."
          />
          
          <FAQItem
            question="How is my score calculated?"
            answer="Your score is based on 5 categories totaling 100 points: Structure (15), Technical Skills (20), Work Experience (30), Education (15), and Formatting (20). Each category has specific criteria that are evaluated using keyword matching and pattern detection."
          />
          
          <FAQItem
            question="Is my CV data stored or shared?"
            answer="No. Your CV is processed entirely in-memory and is never stored on our servers, logged, or shared with third parties. Once you close the page, your data is completely gone."
          />
          
          <FAQItem
            question="How accurate is the scoring?"
            answer="CVScorer provides a good 'first pass' evaluation based on proven best practices. However, it cannot replace human judgment or industry-specific expertise. Use it as a guide, not a definitive assessment."
          />
          
          <FAQItem
            question="Why did I get a low score?"
            answer="Common reasons include: missing required sections (Contact, Experience, Education, Skills), few technical skills listed, lack of action verbs and quantified achievements in experience bullets, poor formatting, or incorrect length. Review the detailed feedback for specific improvements."
          />
          
          <FAQItem
            question="Can I use this for non-technical CVs?"
            answer="While CVScorer was designed with tech CVs in mind, many criteria apply universally (structure, action verbs, quantification, formatting). However, the Technical Skills category may penalize non-technical CVs."
          />
          
          <FAQItem
            question="Does this work with scanned PDFs?"
            answer="No. Scanned PDFs require OCR (Optical Character Recognition) which we don't currently support. Please convert scanned PDFs to text-based format or use the original DOCX file."
          />
          
          <FAQItem
            question="What should I do after getting my score?"
            answer="1) Review the detailed feedback for each category. 2) Implement the specific suggestions provided. 3) Reupload your updated CV to see improvement. 4) Aim for a score of 70+ before submitting to employers."
          />
          
          <FAQItem
            question="Can I see examples of good vs. bad CVs?"
            answer="The feedback section highlights specific strengths (✅) and weaknesses (❌) in your CV. Use these indicators to understand what works and what doesn't. Generally, aim for clear sections, 5+ technical skills, action verbs, quantified achievements, and 1-2 page length."
          />
          
          <FAQItem
            question="How often should I update my CV?"
            answer="Update your CV every 3-6 months or whenever you gain new skills, complete significant projects, or change roles. Even if you're not actively job hunting, keeping your CV current makes the process easier when opportunities arise."
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
            question="Who built CVScorer?"
            answer="CVScorer was built as a portfolio project to demonstrate full-stack development skills using Next.js, TypeScript, and serverless architecture. It's designed to help job seekers while showcasing modern web development practices."
          />
          
          <FAQItem
            question="Can I suggest features or report bugs?"
            answer="Absolutely! While this is currently a portfolio project, feedback is welcome. Look for contact information on the About page or GitHub repository."
          />
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{question}</h3>
      <p className="text-gray-700 leading-relaxed">{answer}</p>
    </div>
  );
}

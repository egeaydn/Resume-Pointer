import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Privacy Policy - CVScorer',
  description: 'Privacy policy for CVScorer resume analysis tool',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <article className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Privacy Policy
            </h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-600 text-center mb-8">
                Last updated: January 29, 2026
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Our Commitment
                </h2>
                <p>
                  CVScorer is built with privacy as a core principle. We believe your personal information 
                  and professional data should remain yours alone.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  What We Don&apos;t Collect
                </h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>We do not store your CV files</li>
                  <li>We do not save your personal information</li>
                  <li>We do not log your CV content</li>
                  <li>We do not track your usage beyond basic analytics</li>
                  <li>We do not share your data with third parties</li>
                  <li>We do not require account creation or sign-up</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p>
                  When you upload a CV:
                </p>
                <ol className="space-y-2 list-decimal list-inside mt-2">
                  <li>The file is sent to our server over HTTPS</li>
                  <li>Text is extracted and analyzed in-memory</li>
                  <li>A score and feedback are generated</li>
                  <li>Results are sent back to your browser</li>
                  <li>All data is immediately discarded from memory</li>
                </ol>
                <p className="mt-4">
                  Your CV never touches a database, file system, or persistent storage. 
                  Once you close the page, there is no trace of your data on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Rate Limiting
                </h2>
                <p>
                  To prevent abuse, we implement rate limiting based on IP address. This temporarily 
                  stores your IP hash (not your actual IP) to enforce a limit of 10 requests per hour. 
                  This data is automatically deleted after the rate limit window expires.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Analytics
                </h2>
                <p>
                  We may use basic, privacy-respecting analytics (like page views) to understand 
                  how the tool is used, but we do not track individual users or correlate data 
                  across sessions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Cookies
                </h2>
                <p>
                  CVScorer does not use cookies for tracking. Any cookies set by the hosting 
                  platform (Vercel) are strictly necessary for technical functionality and do 
                  not track personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Data Security
                </h2>
                <p>
                  All communication between your browser and our servers is encrypted using HTTPS. 
                  File uploads are processed server-side with input validation and sanitization 
                  to prevent malicious content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your Rights
                </h2>
                <p>
                  Since we don&apos;t collect or store your data, there&apos;s nothing to delete, 
                  export, or correct. You have complete control: simply close the page, and your 
                  data is gone.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Changes to This Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. Changes will be posted 
                  on this page with an updated revision date. Continued use of CVScorer after 
                  changes constitutes acceptance of the new policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact
                </h2>
                <p>
                  If you have questions about this privacy policy or CVScorer&apos;s data practices, 
                  please reach out via the GitHub repository linked in the footer.
                </p>
              </section>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  In Summary
                </h3>
                <p className="text-sm">
                  CVScorer processes your CV in-memory only. We don&apos;t store files, track users, 
                  or share data. Your privacy is protected by design, not just by policy.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

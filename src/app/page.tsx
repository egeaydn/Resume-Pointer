'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import { ScoreResult } from '@/lib/scoring/types';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/score', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Special handling for rate limit
        if (response.status === 429) {
          throw new Error('⏱️ Rate limit reached. Please wait an hour before trying again.');
        }
        throw new Error(data.error || 'Failed to process CV');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your CV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isProcessing ? (
          <LoadingSpinner />
        ) : !result ? (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Improve Your CV in Minutes
              </h2>
              <p className="text-lg text-gray-600">
                Upload your resume and get a detailed score with actionable suggestions.
                Our rule-based system analyzes structure, content, and formatting.
              </p>
            </div>

            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing} 
            />

            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            {/* Features */}
            <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon="⚡"
                title="Instant Results"
                description="Get your score in seconds, not days"
              />
              <FeatureCard
                icon="🔒"
                title="100% Private"
                description="Your CV is never stored or shared"
              />
              <FeatureCard
                icon="📊"
                title="Detailed Feedback"
                description="Know exactly what to improve"
              />
            </div>

            {/* Tips Section */}
            <div className="max-w-4xl mx-auto mt-16 bg-linear-to-br from-red-50 to-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💡 Quick Tips for a High Score
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <TipCard
                  title="Structure Matters"
                  tips={[
                    'Include all key sections: Contact, Experience, Education, Skills',
                    'Add a professional summary at the top',
                    'Use clear section headings',
                  ]}
                />
                <TipCard
                  title="Content is King"
                  tips={[
                    'Start bullets with strong action verbs',
                    'Quantify achievements with numbers',
                    'List 10+ relevant technical skills',
                  ]}
                />
                <TipCard
                  title="Contact Details"
                  tips={[
                    'Include email and phone number',
                    'Add your LinkedIn profile URL',
                    'Include GitHub for tech roles',
                  ]}
                />
                <TipCard
                  title="Keep It Concise"
                  tips={[
                    'Aim for 1-2 pages (300-800 words)',
                    'Use bullet points, not paragraphs',
                    'Remove outdated or irrelevant info',
                  ]}
                />
              </div>
            </div>
          </div>
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>CVScorer - Rule-based CV evaluation tool</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TipCard({ title, tips }: { title: string; tips: string[] }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-red-100">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-red-600 mr-2 shrink-0">✓</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

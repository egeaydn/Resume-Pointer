'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
        // Handle RFC-005 error format
        if (data.error) {
          const errorMessage = data.error.message || 'Failed to process CV';
          const errorDetails = data.error.details ? `\n${data.error.details}` : '';
          throw new Error(errorMessage + errorDetails);
        }
        throw new Error('Failed to process CV');
      }

      // Handle RFC-005 success format
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error('Invalid response format');
      }
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {isProcessing ? (
          <LoadingSpinner />
        ) : !result ? (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Get Your CV Score
              </h1>
              <p className="text-xl text-gray-600">
                Upload your resume for instant feedback
              </p>
            </div>

            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing} 
            />

            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-4 gap-6 text-center text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span>Instant analysis</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span>Privacy-first</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span>No sign-up needed</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span>100% free</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-red-50 to-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💡 Quick Tips for a High Score
              </h2>
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

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-5xl mb-4" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TipCard({ title, tips }: { title: string; tips: string[] }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-red-100">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <ul className="space-y-2" role="list">
        {tips.map((tip, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-red-600 mr-2 shrink-0" aria-hidden="true">✓</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

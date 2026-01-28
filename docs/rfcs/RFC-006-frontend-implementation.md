# RFC-006: Frontend Implementation

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC details the frontend implementation for CVScorer using Next.js, React, and TypeScript. It covers component architecture, state management, API integration, styling approach, and user interaction patterns.

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Icons**: React Icons or Heroicons
- **File Upload**: react-dropzone (optional) or native input
- **HTTP Client**: Native fetch API
- **State Management**: React useState/useContext (no Redux needed for this simple app)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with header/footer
│   ├── page.tsx                   # Home page (upload & results)
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── faq/
│   │   └── page.tsx              # FAQ page
│   ├── globals.css               # Global styles
│   └── api/
│       └── score/
│           └── route.ts          # API endpoint (from RFC-005)
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Footer
│   ├── upload/
│   │   ├── UploadZone.tsx        # File upload component
│   │   └── FileInfo.tsx          # Display selected file info
│   ├── results/
│   │   ├── ScoreCard.tsx         # Overall score display
│   │   ├── Breakdown.tsx         # Score breakdown by category
│   │   ├── BreakdownItem.tsx    # Individual category item
│   │   └── Recommendations.tsx   # Improvement suggestions
│   ├── common/
│   │   ├── Button.tsx            # Reusable button
│   │   ├── Loading.tsx           # Loading spinner/progress
│   │   └── ErrorMessage.tsx      # Error display
│   └── home/
│       └── FeatureHighlights.tsx # Benefits section
├── lib/
│   ├── api-client.ts             # API call functions
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Utility functions
├── hooks/
│   ├── useFileUpload.ts          # Custom hook for file handling
│   └── useCVAnalysis.ts          # Custom hook for API calls
└── public/
    └── logo.svg                   # App logo/icon
```

## TypeScript Interfaces

**File**: `/src/lib/types.ts`

```typescript
// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

export interface APIError {
  code: string;
  message: string;
  details?: string;
  suggestions?: string[];
}

// CV Analysis Result
export interface CVAnalysisResult {
  totalScore: number;
  grade: string;
  message: string;
  breakdown: ScoreBreakdown;
  recommendations: Recommendation[];
  metadata: Metadata;
}

export interface ScoreBreakdown {
  structure: CategoryScore;
  skills: CategoryScore;
  experience: CategoryScore;
  education: CategoryScore;
  formatting: CategoryScore;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  checks: Check[];
}

export interface Check {
  category: string;
  passed: boolean;
  message: string;
  details?: string[];
}

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  category: string;
}

export interface Metadata {
  wordCount: number;
  estimatedPages: number;
  processingTime: number;
  version: string;
}

// UI State Types
export type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export interface UploadStatus {
  state: UploadState;
  file: File | null;
  progress?: number;
  error?: string;
  result?: CVAnalysisResult;
}
```

## Core Components

### Layout Components

#### Header Component

**File**: `/src/components/layout/Header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];
  
  return (
    <header className="bg-red-600 text-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <span className="text-2xl font-bold">CVScorer</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:underline transition ${
                  pathname === link.href ? 'font-semibold underline' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
```

#### Footer Component

**File**: `/src/components/layout/Footer.tsx`

```typescript
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
        <p>© 2026 CVScorer. Built with Next.js.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/privacy" className="hover:text-red-600 transition">
            Privacy Policy
          </a>
          <a
            href="https://github.com/yourusername/cvscorer"
            className="hover:text-red-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
```

### Upload Components

#### UploadZone Component

**File**: `/src/components/upload/UploadZone.tsx`

```typescript
'use client';

import { useRef, useState } from 'react';
import { HiDocument } from 'react-icons/hi2';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled = false }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 sm:p-12
        text-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-red-600 bg-red-50' 
          : 'border-gray-300 bg-gray-50 hover:border-red-500 hover:bg-red-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={!disabled ? handleClick : undefined}
      onDragOver={!disabled ? handleDragOver : undefined}
      onDragLeave={!disabled ? handleDragLeave : undefined}
      onDrop={!disabled ? handleDrop : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <HiDocument className="mx-auto text-gray-400 mb-4" size={48} />
      
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drop your CV here
      </p>
      
      <p className="text-sm text-gray-500 mb-4">
        or click to upload
      </p>
      
      <p className="text-xs text-gray-400">
        Supports: PDF, DOCX (Max 5MB)
      </p>
    </div>
  );
}
```

### Results Components

#### ScoreCard Component

**File**: `/src/components/results/ScoreCard.tsx`

```typescript
'use client';

import { CVAnalysisResult } from '@/lib/types';

interface ScoreCardProps {
  result: CVAnalysisResult;
  onReset: () => void;
}

export default function ScoreCard({ result, onReset }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 86) return 'text-green-600';
    if (score >= 76) return 'text-blue-600';
    if (score >= 61) return 'text-yellow-600';
    if (score >= 41) return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Your CV Score
      </h2>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-5xl sm:text-6xl">🏆</span>
        
        <div>
          <span className={`text-6xl sm:text-7xl font-bold ${getScoreColor(result.totalScore)}`}>
            {result.totalScore}
          </span>
          <span className="text-3xl sm:text-4xl text-gray-500">/100</span>
        </div>
      </div>
      
      <div className="text-xl font-medium text-gray-700 mb-2">
        {result.grade}
      </div>
      
      <p className="text-gray-600 mb-6">
        {result.message}
      </p>
      
      <button
        onClick={onReset}
        className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium
                   hover:bg-red-700 transition-colors duration-200"
      >
        Try Another CV
      </button>
    </div>
  );
}
```

#### Breakdown Component

**File**: `/src/components/results/Breakdown.tsx`

```typescript
import { ScoreBreakdown } from '@/lib/types';
import BreakdownItem from './BreakdownItem';

interface BreakdownProps {
  breakdown: ScoreBreakdown;
}

export default function Breakdown({ breakdown }: BreakdownProps) {
  const categories = [
    { key: 'structure', label: 'CV Structure & Sections' },
    { key: 'skills', label: 'Technical Skills' },
    { key: 'experience', label: 'Work Experience Content' },
    { key: 'education', label: 'Education' },
    { key: 'formatting', label: 'Formatting & Readability' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Score Breakdown
      </h3>
      
      <div className="space-y-4">
        {categories.map(({ key, label }) => (
          <BreakdownItem
            key={key}
            category={label}
            data={breakdown[key as keyof ScoreBreakdown]}
          />
        ))}
      </div>
    </div>
  );
}
```

#### BreakdownItem Component

**File**: `/src/components/results/BreakdownItem.tsx`

```typescript
import { CategoryScore } from '@/lib/types';

interface BreakdownItemProps {
  category: string;
  data: CategoryScore;
}

export default function BreakdownItem({ category, data }: BreakdownItemProps) {
  const percentage = (data.score / data.maxScore) * 100;
  
  return (
    <div className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
      {/* Category header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg text-gray-800">{category}</h4>
        <span className="text-xl font-bold text-red-600">
          {data.score}/{data.maxScore}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-red-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Checks list */}
      <ul className="space-y-1">
        {data.checks.map((check, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
              {check.passed ? '✅' : '❌'}
            </span>
            <span className="text-gray-700 flex-1">
              {check.message}
              {check.details && (
                <span className="text-gray-500 text-xs block mt-1">
                  ({check.details.slice(0, 5).join(', ')}
                  {check.details.length > 5 && '...'})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Recommendations Component

**File**: `/src/components/results/Recommendations.tsx`

```typescript
import { Recommendation } from '@/lib/types';
import { HiLightBulb } from 'react-icons/hi';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <HiLightBulb className="text-yellow-600" />
        Top Recommendations
      </h3>
      
      <ol className="space-y-4">
        {recommendations.map((rec) => (
          <li key={rec.priority} className="flex gap-3">
            <span className="font-bold text-red-600 text-lg flex-shrink-0">
              {rec.priority}.
            </span>
            <div>
              <p className="font-semibold text-gray-900">{rec.title}</p>
              <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

### Common Components

#### Loading Component

**File**: `/src/components/common/Loading.tsx`

```typescript
export default function Loading({ message = 'Analyzing your CV...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
      <p className="text-sm text-gray-500">This usually takes 2-3 seconds</p>
    </div>
  );
}
```

#### ErrorMessage Component

**File**: `/src/components/common/ErrorMessage.tsx`

```typescript
import { HiXCircle } from 'react-icons/hi2';

interface ErrorMessageProps {
  message: string;
  details?: string;
  suggestions?: string[];
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  message, 
  details, 
  suggestions, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <HiXCircle className="text-red-600 flex-shrink-0" size={24} />
        
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-2">{message}</h4>
          
          {details && (
            <p className="text-sm text-red-700 mb-3">{details}</p>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-800 mb-2">Suggestions:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Custom Hooks

### useFileUpload Hook

**File**: `/src/hooks/useFileUpload.ts`

```typescript
import { useState, useCallback } from 'react';
import { UploadStatus, CVAnalysisResult } from '@/lib/types';
import { analyzeCV } from '@/lib/api-client';

export function useFileUpload() {
  const [status, setStatus] = useState<UploadStatus>({
    state: 'idle',
    file: null,
  });
  
  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setStatus({
        state: 'error',
        file: null,
        error: 'Invalid file type. Please upload a PDF or DOCX file.',
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        state: 'error',
        file: null,
        error: 'File size exceeds 5MB limit.',
      });
      return;
    }
    
    // Set uploading state
    setStatus({
      state: 'uploading',
      file,
    });
    
    try {
      // Call API
      setStatus(prev => ({ ...prev, state: 'analyzing' }));
      const result = await analyzeCV(file);
      
      // Set success state
      setStatus({
        state: 'complete',
        file,
        result,
      });
    } catch (error: any) {
      setStatus({
        state: 'error',
        file: null,
        error: error.message || 'Failed to analyze CV. Please try again.',
      });
    }
  }, []);
  
  const reset = useCallback(() => {
    setStatus({
      state: 'idle',
      file: null,
    });
  }, []);
  
  return {
    status,
    handleFileSelect,
    reset,
  };
}
```

## API Client

**File**: `/src/lib/api-client.ts`

```typescript
import { CVAnalysisResult, APIResponse } from './types';

export async function analyzeCV(file: File): Promise<CVAnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/score', {
    method: 'POST',
    body: formData,
  });
  
  const data: APIResponse<CVAnalysisResult> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Analysis failed');
  }
  
  return data.data;
}
```

## Page Implementations

### Home Page

**File**: `/src/app/page.tsx`

```typescript
'use client';

import { useFileUpload } from '@/hooks/useFileUpload';
import UploadZone from '@/components/upload/UploadZone';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import ScoreCard from '@/components/results/ScoreCard';
import Breakdown from '@/components/results/Breakdown';
import Recommendations from '@/components/results/Recommendations';

export default function HomePage() {
  const { status, handleFileSelect, reset } = useFileUpload();
  
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      {status.state === 'idle' && (
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get Your CV Score
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your resume for instant feedback
          </p>
          
          <UploadZone onFileSelect={handleFileSelect} />
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 text-sm text-gray-600">
            <div>✓ Instant analysis</div>
            <div>✓ Privacy-first</div>
            <div>✓ No sign-up needed</div>
            <div>✓ 100% free</div>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {(status.state === 'uploading' || status.state === 'analyzing') && (
        <Loading />
      )}
      
      {/* Error State */}
      {status.state === 'error' && (
        <div className="max-w-2xl mx-auto">
          <ErrorMessage
            message="Failed to analyze CV"
            details={status.error}
            onRetry={reset}
          />
        </div>
      )}
      
      {/* Results State */}
      {status.state === 'complete' && status.result && (
        <div className="max-w-4xl mx-auto space-y-6">
          <ScoreCard result={status.result} onReset={reset} />
          <Breakdown breakdown={status.result.breakdown} />
          <Recommendations recommendations={status.result.recommendations} />
        </div>
      )}
    </main>
  );
}
```

### About Page

**File**: `/src/app/about/page.tsx`

```typescript
export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="max-w-3xl mx-auto prose prose-lg">
        <h1>About CVScorer</h1>
        
        <p>
          CVScorer is a free, rule-based resume analysis tool that helps job 
          seekers improve their CVs before applying to positions.
        </p>
        
        <h2>How It Works</h2>
        <ul>
          <li>Upload your CV (PDF or DOCX)</li>
          <li>Instant analysis using proven criteria</li>
          <li>Get a 0-100 score with detailed feedback</li>
          <li>Make improvements and re-test</li>
        </ul>
        
        <h2>Why Rule-Based?</h2>
        <p>
          We use transparent, deterministic rules instead of AI to ensure 
          consistency and explainability. You'll always understand exactly 
          why you got your score.
        </p>
        
        <h2>Privacy</h2>
        <p>
          Your CV is processed in-memory and never stored. We don't track 
          or save any of your personal information.
        </p>
        
        <p className="text-sm text-gray-600">
          Built as a portfolio project to demonstrate full-stack development skills.
        </p>
      </article>
    </main>
  );
}
```

## Styling Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

## Performance Optimizations

### Code Splitting

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const Breakdown = dynamic(() => import('@/components/results/Breakdown'), {
  loading: () => <Loading message="Loading results..." />,
});
```

### Memoization

```typescript
import { memo } from 'react';

const BreakdownItem = memo(({ category, data }: BreakdownItemProps) => {
  // Component implementation
});
```

## Testing

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import ScoreCard from '@/components/results/ScoreCard';

describe('ScoreCard', () => {
  it('renders score correctly', () => {
    const mockResult = {
      totalScore: 85,
      grade: 'Very Good',
      // ...
    };
    
    render(<ScoreCard result={mockResult} onReset={() => {}} />);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });
});
```

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-004 (UI/UX Design), RFC-005 (Backend Architecture)  
**Next Steps**: Implement testing strategy (RFC-007)

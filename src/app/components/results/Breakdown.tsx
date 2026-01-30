/**
 * Breakdown Component
 * Displays score breakdown by category
 * Based on RFC-006: Frontend Implementation
 */

'use client';

import { ScoreBreakdown } from '@/lib/scoring/types';
import BreakdownItem from './BreakdownItem';

interface BreakdownProps {
  breakdown: ScoreBreakdown;
}

export default function Breakdown({ breakdown }: BreakdownProps) {
  const categories = [
    { key: 'structure' as const, label: 'CV Structure & Sections' },
    { key: 'technicalSkills' as const, label: 'Technical Skills' },
    { key: 'workExperience' as const, label: 'Work Experience Content' },
    { key: 'education' as const, label: 'Education' },
    { key: 'formatting' as const, label: 'Formatting & Readability' },
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
            data={breakdown[key]}
          />
        ))}
      </div>
    </div>
  );
}

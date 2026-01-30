/**
     Created by: Ege Aydın
    Date: 2026-01-30
 * Based on RFC-006: Frontend Implementation
 */

'use client';

import { memo } from 'react';
import { CategoryResult } from '@/lib/scoring/types';

interface BreakdownItemProps {
  category: string;
  data: CategoryResult;
}

function BreakdownItem({ category, data }: BreakdownItemProps) {
  const percentage = (data.score / data.maxScore) * 100;
  
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
      {/* Category header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg text-gray-800">{category}</h4>
        <span className={`text-xl font-bold ${getScoreColor(percentage)}`}>
          {data.score}/{data.maxScore}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-red-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={data.score}
          aria-valuemin={0}
          aria-valuemax={data.maxScore}
          aria-label={`${category} score: ${data.score} out of ${data.maxScore}`}
        />
      </div>
      
      <ul className="space-y-1" role="list">
        {data.details.map((detail, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span 
              className={detail.passed ? 'text-green-600' : 'text-red-600'}
              aria-label={detail.passed ? 'Passed' : 'Not passed'}
            >
              {detail.passed ? '✅' : '❌'}
            </span>
            <span className="text-gray-700 flex-1">
              {detail.message}
              {detail.details && detail.details.length > 0 && (
                <span className="text-gray-500 text-xs block mt-1">
                  ({detail.details.slice(0, 5).join(', ')}
                  {detail.details.length > 5 && ', ...'})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(BreakdownItem);

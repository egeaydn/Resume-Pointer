/**
 * Recommendations Component
 * Displays improvement recommendations
 * Based on RFC-006: Frontend Implementation
 */

'use client';

import { Recommendation } from '@/lib/scoring/types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }
  
  const getImpactBadge = (impact: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return styles[impact as keyof typeof styles] || styles.medium;
  };
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <span className="text-2xl" aria-hidden="true">💡</span>
        Top Recommendations
      </h3>
      
      <ol className="space-y-4" role="list">
        {recommendations.map((rec) => (
          <li key={rec.priority} className="flex gap-3">
            <span className="font-bold text-red-600 text-lg flex-shrink-0">
              {rec.priority}.
            </span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-900">{rec.title}</p>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${getImpactBadge(rec.impact)}`}
                  aria-label={`Impact: ${rec.impact}`}
                >
                  {rec.impact}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
              <p className="text-xs text-gray-500 mt-1">Category: {rec.category}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

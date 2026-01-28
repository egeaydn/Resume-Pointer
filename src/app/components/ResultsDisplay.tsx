'use client';

import { ScoreResult, CategoryScore } from '@/lib/scoring/types';
import { CATEGORY_NAMES, SCORE_RANGES } from '@/lib/scoring/constants';

interface ResultsDisplayProps {
  result: ScoreResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { totalScore, categoryScores, overallFeedback, suggestions } = result;

  // Determine score range and color
  const scoreRange = Object.values(SCORE_RANGES).find(
    (range): range is typeof SCORE_RANGES[keyof typeof SCORE_RANGES] => 
      totalScore >= range.min && totalScore <= range.max
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Total Score Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center border-t-4 border-red-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your CV Score</h2>
        <div className="text-7xl font-bold mb-2" style={{ color: scoreRange?.color }}>
          {totalScore}
          <span className="text-3xl text-gray-500">/100</span>
        </div>
        <div className="text-xl font-semibold mb-4" style={{ color: scoreRange?.color }}>
          {scoreRange?.label}
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto">{overallFeedback}</p>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h3>
        
        <div className="space-y-6">
          {categoryScores.map((category: CategoryScore) => (
            <CategoryCard key={category.category} category={category} />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-red-50 rounded-lg shadow-lg p-8 border border-red-200">
          <h3 className="text-xl font-bold text-red-900 mb-4">💡 Improvement Suggestions</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="text-gray-800 flex items-start">
                <span className="text-red-600 font-bold mr-2">{index + 1}.</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Another Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Upload Another CV
        </button>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryScore }) {
  const percentage = Math.round((category.score / category.maxScore) * 100);
  
  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-900">
          {CATEGORY_NAMES[category.category]}
        </h4>
        <div className="text-lg font-bold">
          <span className={percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}>
            {category.score}
          </span>
          <span className="text-gray-500">/{category.maxScore}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${
            percentage >= 70 ? 'bg-green-600' : percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Feedback Items */}
      <div className="space-y-2">
        {category.feedback.map((item: any, index: number) => (
          <div
            key={index}
            className={`text-sm flex items-start ${
              item.type === 'success' ? 'text-green-800' :
              item.type === 'warning' ? 'text-yellow-800' :
              'text-red-800'
            }`}
          >
            <span className="mr-2 text-base">{item.icon}</span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

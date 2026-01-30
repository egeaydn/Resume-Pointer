'use client';

import { ScoreResult } from '@/lib/scoring/types';
import Button from '../common/Button';
import { ScoreAnimation } from '../ScoreAnimation';

interface ScoreCardProps {
  result: ScoreResult;
  onReset: () => void;
}

export default function ScoreCard({ result, onReset }: ScoreCardProps) {
  const { totalScore, grade, message } = result;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // green
    if (score >= 80) return '#3B82F6'; // blue
    if (score >= 70) return '#F59E0B'; // yellow
    if (score >= 60) return '#F97316'; // orange
    return '#EF4444'; // red
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center border-t-4 border-red-600">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Your CV Score
      </h2>
      
      <ScoreAnimation 
        targetScore={totalScore} 
        maxScore={100}
        color={getScoreColor(totalScore)}
        label={grade || ''}
      />
      
      {message && (
        <p className="text-gray-700 max-w-2xl mx-auto mt-4">
          {message}
        </p>
      )}
      
      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => window.print()}
          aria-label="Print results"
        >
          📄 Print Results
        </Button>
        <Button onClick={onReset}>
          Try Another CV
        </Button>
      </div>
    </div>
  );
}

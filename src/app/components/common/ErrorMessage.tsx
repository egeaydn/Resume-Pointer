/**
 * ErrorMessage Component
 * Displays error messages with optional details and suggestions
 * Based on RFC-006: Frontend Implementation
 */

'use client';

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
    <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
      <div className="flex items-start gap-3">
        <span className="text-red-600 text-2xl flex-shrink-0" aria-hidden="true">
          ❌
        </span>
        
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
              className="text-sm font-medium text-red-600 hover:text-red-800 underline transition-colors"
              aria-label="Try again"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

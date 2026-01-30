'use client';

import { memo } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 border-4 border-red-200 rounded-full animate-pulse"></div>
        
        {/* Inner spinning circle */}
        <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
        </div>
      </div>
      
      <div className="mt-6 space-y-2 text-center">
        <p className="text-lg font-semibold text-gray-900 animate-pulse">
          Analyzing your CV...
        </p>
        <p className="text-sm text-gray-600">
          This usually takes 2-3 seconds
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="mt-8 space-y-2 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>✓ Extracting text from file</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>⏳ Analyzing content...</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span>Calculating score</span>
        </div>
      </div>
    </div>
  );
}

export default memo(LoadingSpinner);

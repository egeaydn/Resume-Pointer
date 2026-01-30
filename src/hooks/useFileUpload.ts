
    /*create by Ege Aydin Jan 2026*/

import { useState, useCallback } from 'react';
import { ScoreResult } from '@/lib/scoring/types';
import { analyzeCV, validateFile } from '@/lib/api-client';

export type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export interface UploadStatus {
  state: UploadState;
  file: File | null;
  progress?: number;
  error?: string;
  result?: ScoreResult;
}

// Hook to manage file upload and CV analysis

export function useFileUpload() {
  const [status, setStatus] = useState<UploadStatus>({
    state: 'idle',
    file: null,
  });
  
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) {
      setStatus({
        state: 'error',
        file: null,
        error: 'No file selected',
      });
      return;
    }
    
    const validation = validateFile(file);
    if (!validation.isValid) {
      setStatus({
        state: 'error',
        file: null,
        error: validation.error,
      });
      return;
    }
    
    setStatus({
      state: 'uploading',
      file,
      progress: 0,
    });
    
    try {
      setStatus(prev => ({ ...prev, progress: 25, state: 'analyzing' }));
      
      const result = await analyzeCV(file);
      
      setStatus({
        state: 'complete',
        file,
        result,
        progress: 100,
      });
    } catch (error: any) {
      console.error('CV analysis error:', error);
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
    isLoading: status.state === 'uploading' || status.state === 'analyzing',
    isComplete: status.state === 'complete',
    isError: status.state === 'error',
  };
}

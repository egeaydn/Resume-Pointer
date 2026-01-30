/**
 * API Client Module
 * Centralized API calls for CVScorer
 * Based on RFC-006: Frontend Implementation
 */

import { ScoreResult } from '@/lib/scoring/types';

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

/**
 * Analyze CV file and get scoring results
 * @param file - CV file (PDF or DOCX)
 * @returns Promise<ScoreResult> - Analysis results
 * @throws Error with message from API
 */
export async function analyzeCV(file: File): Promise<ScoreResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/score', {
    method: 'POST',
    body: formData,
  });
  
  const data: APIResponse<ScoreResult> = await response.json();
  
  if (!response.ok || !data.success || !data.data) {
    // Construct error message from API response
    const errorMessage = data.error?.message || 'Failed to analyze CV';
    const errorDetails = data.error?.details ? `\n${data.error.details}` : '';
    throw new Error(errorMessage + errorDetails);
  }
  
  return data.data;
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PDF or DOCX file.'
    };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds 5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`
    };
  }
  
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please upload a valid CV file.'
    };
  }
  
  return { isValid: true };
}

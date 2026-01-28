/**
 * Text extraction utilities for PDF and DOCX files
 * Based on RFC-003: Text Parsing & Detection Rules
 */

import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedCV, CVMetadata } from '../scoring/types';

export class ExtractionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ExtractionError';
  }
}

/**
 * Extract text from PDF file buffer
 */
export async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await (pdfParse as any).default(buffer);
    return data.text;
  } catch (error) {
    throw new ExtractionError(
      'Failed to extract text from PDF. Ensure it is a text-based PDF, not a scanned image.',
      'PDF_EXTRACTION_FAILED'
    );
  }
}

/**
 * Extract text from DOCX file buffer
 */
export async function extractFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new ExtractionError(
      'Failed to extract text from DOCX. The file may be corrupted.',
      'DOCX_EXTRACTION_FAILED'
    );
  }
}

/**
 * Normalize extracted text for consistent processing
 */
export function normalizeText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

/**
 * Calculate CV metadata from text
 */
export function extractMetadata(text: string, fileType: 'pdf' | 'docx'): CVMetadata {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Rough estimate: 500 words per page
  const estimatedPageCount = Math.ceil(words.length / 500);
  
  // Check for common contact patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const hasContactInfo = emailRegex.test(text) || phoneRegex.test(text);
  
  return {
    wordCount: words.length,
    lineCount: lines.length,
    hasContactInfo,
    estimatedPageCount,
    fileType,
  };
}

/**
 * Main function to extract and parse CV from file buffer
 */
export async function parseCV(
  buffer: Buffer,
  fileType: 'pdf' | 'docx'
): Promise<ParsedCV> {
  // Extract raw text based on file type
  const rawText = fileType === 'pdf' 
    ? await extractFromPDF(buffer)
    : await extractFromDOCX(buffer);
  
  // Normalize text
  const normalizedText = normalizeText(rawText);
  
  // Validate that we got meaningful text
  if (normalizedText.length < 50) {
    throw new ExtractionError(
      'Extracted text is too short. The CV may be empty or scanned image.',
      'INSUFFICIENT_TEXT'
    );
  }
  
  // Extract metadata
  const metadata = extractMetadata(normalizedText, fileType);
  
  // Return parsed CV (sections will be detected in pattern matching)
  return {
    rawText,
    normalizedText,
    sections: [], // Will be populated by section detector
    metadata,
  };
}

/**
 * Validate file before processing
 */
export function validateFile(
  file: { size: number; type: string; name: string },
  maxSizeBytes: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSizeBytes / 1024 / 1024)}MB limit`,
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF and DOCX files are supported',
    };
  }
  
  // Check file extension as additional validation
  const extension = file.name.toLowerCase().split('.').pop();
  if (extension !== 'pdf' && extension !== 'docx') {
    return {
      valid: false,
      error: 'File must have .pdf or .docx extension',
    };
  }
  
  return { valid: true };
}

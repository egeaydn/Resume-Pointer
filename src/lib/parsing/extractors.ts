/**
 * Text extraction utilities for PDF and DOCX files
 * Based on RFC-003: Text Parsing & Detection Rules
 */

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
    console.log('Starting PDF extraction, buffer size:', buffer.length);
    
    // Dynamically import pdf-parse to avoid module initialization issues
    const pdfParse = (await import('pdf-parse')).default;
    
    const data = await pdfParse(buffer);
    console.log('PDF parsed successfully, text length:', data?.text?.length || 0);
    
    // Check if we actually got text
    if (!data || !data.text) {
      console.error('PDF data:', data);
      throw new ExtractionError(
        'PDF appears to be empty or contains no extractable text. It may be a scanned image.',
        'PDF_NO_TEXT'
      );
    }
    
    console.log('Returning PDF text, first 100 chars:', data.text.substring(0, 100));
    return data.text;
  } catch (error: any) {
    // If it's already an ExtractionError, re-throw it
    if (error instanceof ExtractionError) {
      throw error;
    }
    
    // Log the actual error for debugging
    console.error('PDF extraction error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    throw new ExtractionError(
      `Failed to extract text from PDF. Error: ${error.message}. Ensure it is a text-based PDF, not a scanned image.`,
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
    
    // Check if we actually got text
    if (!result || !result.value || result.value.trim().length === 0) {
      throw new ExtractionError(
        'DOCX appears to be empty or contains no extractable text.',
        'DOCX_NO_TEXT'
      );
    }
    
    return result.value;
  } catch (error: any) {
    // If it's already an ExtractionError, re-throw it
    if (error instanceof ExtractionError) {
      throw error;
    }
    
    // Log the actual error for debugging
    console.error('DOCX extraction error:', error.message || error);
    
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
    // Normalize line breaks first (before removing whitespace)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive whitespace on each line (but keep newlines)
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    // Trim whitespace from start and end
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
  // Validate buffer
  if (!buffer || buffer.length === 0) {
    throw new ExtractionError(
      'Invalid file buffer. The file may be corrupted or empty.',
      'INVALID_BUFFER'
    );
  }
  
  // Extract raw text based on file type
  const rawText = fileType === 'pdf' 
    ? await extractFromPDF(buffer)
    : await extractFromDOCX(buffer);
  
  // Log extraction success for debugging
  console.log(`Successfully extracted ${rawText.length} characters from ${fileType.toUpperCase()}`);
  
  // Normalize text
  const normalizedText = normalizeText(rawText);
  
  // Validate that we got meaningful text (reduced threshold for testing)
  if (normalizedText.length < 20) {
    throw new ExtractionError(
      `Extracted text is too short (${normalizedText.length} chars). The CV may be empty, contain only images, or be a scanned document. Please use a text-based ${fileType.toUpperCase()}.`,
      'INSUFFICIENT_TEXT'
    );
  }
  
  // Log word count for debugging
  const wordCount = normalizedText.split(/\s+/).length;
  console.log(`Normalized to ${normalizedText.length} chars, ${wordCount} words`);

  
  // Extract metadata
  const metadata = extractMetadata(normalizedText, fileType);
  
  // Return parsed CV (RFC-005 compliant format with 'text' field)
  return {
    text: normalizedText,  // Primary field for RFC-005
    rawText,              // Legacy support
    normalizedText,       // Legacy support
    sections: [],         // Will be populated by section detector
    metadata,
    wordCount,            // Direct field for RFC-005
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

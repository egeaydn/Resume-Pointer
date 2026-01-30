/**
 * API Route: POST /api/score
 * 
 * Handles CV file upload, text extraction, and scoring analysis.
 * 
 * @param request - NextRequest with multipart/form-data containing 'file'
 * @returns JSON response with score results or error details
 * 
 * Success Response (200):
 * {
 *   success: true,
 *   data: {
 *     totalScore: number (0-100),
 *     grade: string,
 *     message: string,
 *     breakdown: { structure, skills, experience, education, formatting },
 *     recommendations: Array<{ priority, title, description, category, impact }>,
 *     metadata: { fileName, fileSize, wordCount, processingTime, version }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid file (INVALID_FILE_TYPE, FILE_TOO_LARGE, INVALID_FILENAME, NO_FILE)
 * - 422: Extraction failed (EXTRACTION_FAILED) - scanned PDF or corrupted file
 * - 429: Rate limit exceeded (RATE_LIMIT_EXCEEDED)
 * - 500: Internal server error (INTERNAL_ERROR)
 * 
 * Rate Limiting: 10 requests per hour per IP address
 * Max File Size: 5MB
 * Supported Formats: PDF (text-based), DOCX
 * Processing Timeout: 10 seconds (Vercel serverless limit)
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseCV, validateFile } from '@/lib/parsing/extractors';
import { calculateScore } from '@/lib/scoring/calculator';
import { generateRecommendations, getGrade, getMessage } from '@/lib/scoring/recommendations';
import { FILE_CONSTRAINTS } from '@/lib/scoring/constants';

export const runtime = 'nodejs';
export const maxDuration = 10; 

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; 
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; 

/**
 * Check rate limit for given IP address
 * @param ip - Client IP address
 * @returns true if within limit, false if exceeded
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    console.log(`[Rate Limit] IP ${ip} exceeded limit (${userLimit.count} requests)`);
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * POST handler for CV scoring endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    console.log(`[${requestId}] Request started at ${new Date().toISOString()}`);
    
    // 1. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    if (!checkRateLimit(ip)) {
      console.log(`[${requestId}] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please try again later.',
            details: `Maximum ${RATE_LIMIT} requests per hour allowed.`
          }
        },
        { status: 429 }
      );
    }

    // 2. Extract file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      console.log(`[${requestId}] No file provided`);
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided',
            details: 'Please upload a PDF or DOCX file.'
          }
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] File received: ${file.name} (${file.size} bytes, ${file.type})`);

    // 3. Validate filename (security: prevent path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      console.log(`[${requestId}] Invalid filename: ${file.name}`);
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'INVALID_FILENAME',
            message: 'Invalid file name',
            details: 'File name contains invalid characters.'
          }
        },
        { status: 400 }
      );
    }
    
    // 4. Validate file constraints
    const validation = validateFile(
      { 
        size: file.size, 
        type: file.type, 
        name: file.name 
      },
      FILE_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      [...FILE_CONSTRAINTS.ALLOWED_TYPES]
    );
    
    if (!validation.valid) {
      console.log(`[${requestId}] Validation failed: ${validation.error}`);
      
      // Determine error code based on validation error
      let errorCode = 'INVALID_FILE';
      if (validation.error.includes('size')) {
        errorCode = 'FILE_TOO_LARGE';
      } else if (validation.error.includes('type') || validation.error.includes('format')) {
        errorCode = 'INVALID_FILE_TYPE';
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: errorCode,
            message: validation.error,
            details: validation.error.includes('size') 
              ? `File size: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum allowed: 5MB.`
              : `Received file type: ${file.type}. Only PDF and DOCX files are supported.`,
            suggestions: [
              'Ensure the file is in PDF or DOCX format',
              'Compress large files to under 5MB',
              'Try re-exporting from your editor'
            ]
          }
        },
        { status: 400 }
      );
    }
    
    // 5. Determine file type
    const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    console.log(`[${requestId}] Processing as ${fileType.toUpperCase()}`);
    
    // 6. Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[${requestId}] Buffer created: ${buffer.length} bytes`);
    
    // 7. Parse CV (extract text)
    console.log(`[${requestId}] Starting text extraction...`);
    const parsedCV = await parseCV(buffer, fileType);
    console.log(`[${requestId}] Text extracted: ${parsedCV.text.length} characters`);
    
    // 8. Calculate score
    console.log(`[${requestId}] Starting scoring analysis...`);
    const scoreResult = calculateScore(parsedCV);
    console.log(`[${requestId}] Score calculated: ${scoreResult.totalScore}/100`);
    
    // 9. Generate recommendations
    const recommendations = generateRecommendations(scoreResult);
    const grade = getGrade(scoreResult.totalScore);
    const message = getMessage(scoreResult.totalScore);
    
    // 10. Add metadata
    const processingTime = (Date.now() - startTime) / 1000;
    
    console.log(`[${requestId}] Request completed in ${processingTime.toFixed(2)}s`);
    
    // 11. Return RFC-005 compliant response
    return NextResponse.json({
      success: true,
      data: {
        totalScore: scoreResult.totalScore,
        grade,
        message,
        breakdown: scoreResult.breakdown,
        recommendations,
        metadata: {
          fileName: file.name.replace(/[^\w\s.-]/g, ''),
          fileSize: file.size,
          fileType: fileType,
          wordCount: parsedCV.wordCount || 0,
          estimatedPages: Math.ceil((parsedCV.wordCount || 0) / 400),
          processingTime: parseFloat(processingTime.toFixed(2)),
          processedAt: new Date().toISOString(),
          version: '1.0.0',
        },
      },
    });
    
  } catch (error: any) {
    const processingTime = (Date.now() - startTime) / 1000;
    console.error(`[${requestId}] Error after ${processingTime.toFixed(2)}s:`, error);
    
    // Handle extraction errors specifically
    if (error.name === 'ExtractionError') {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'EXTRACTION_FAILED',
            message: error.message,
            details: 'This may be a scanned PDF or corrupted file. Please use a text-based PDF or DOCX file.',
            suggestions: [
              'Export your CV as a new PDF from Word/Google Docs',
              'Ensure the file is not password-protected',
              'Try uploading a DOCX version instead',
              'If using a scanned PDF, use OCR software first'
            ]
          }
        },
        { status: 422 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while processing your CV',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again or contact support if the issue persists.'
        }
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

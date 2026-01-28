/**
 * API Route: /api/score
 * Handles CV file upload, extraction, and scoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseCV, validateFile } from '@/lib/parsing/extractors';
import { calculateScore } from '@/lib/scoring/calculator';
import { FILE_CONSTRAINTS } from '@/lib/scoring/constants';

export const runtime = 'nodejs';
export const maxDuration = 10; // 10 seconds max

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file
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
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Determine file type
    const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract and parse CV
    const parsedCV = await parseCV(buffer, fileType);
    
    // Calculate score
    const scoreResult = calculateScore(parsedCV);
    
    // Return results
    return NextResponse.json({
      success: true,
      result: scoreResult,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: fileType,
        processedAt: new Date().toISOString(),
      },
    });
    
  } catch (error: any) {
    console.error('Error processing CV:', error);
    
    // Handle specific error types
    if (error.name === 'ExtractionError') {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code 
        },
        { status: 422 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { 
        error: 'Failed to process CV. Please ensure the file is a valid PDF or DOCX.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

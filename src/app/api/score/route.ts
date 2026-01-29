/**
 * API Route: /api/score
 * Handles CV file upload, extraction, and scoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseCV, validateFile } from '@/lib/parsing/extractors';
import { calculateScore } from '@/lib/scoring/calculator';
import { FILE_CONSTRAINTS } from '@/lib/scoring/constants';

export const runtime = 'nodejs';
export const maxDuration = 10; 

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; 
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; 

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded here could add logging
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          details: `Maximum ${RATE_LIMIT} requests per hour allowed.`
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Additional security: check file name for suspicious patterns (path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      );
    }
    
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
    
    const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const parsedCV = await parseCV(buffer, fileType);
    
    const scoreResult = calculateScore(parsedCV);
    
    return NextResponse.json({
      success: true,
      result: scoreResult,
      metadata: {
        fileName: file.name.replace(/[^\w\s.-]/g, ''),
        fileSize: file.size,
        fileType: fileType,
        processedAt: new Date().toISOString(),
      },
    });
    
  } catch (error: any) {
    console.error('Error processing CV:', error);
    
    if (error.name === 'ExtractionError') {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code 
        },
        { status: 422 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process CV. Please ensure the file is a valid PDF or DOCX.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

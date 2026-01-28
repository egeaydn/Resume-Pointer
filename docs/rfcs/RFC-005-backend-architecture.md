# RFC-005: Backend Architecture

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the backend architecture for CVScorer, including API design, file processing pipeline, scoring engine implementation, error handling, and performance optimization strategies.

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                  │
└────────────────────┬─────────────────────────────────┘
                     │ HTTP POST /api/score
                     │ (multipart/form-data)
                     ▼
┌──────────────────────────────────────────────────────┐
│            Next.js API Route Handler                 │
│                  (/api/score.ts)                     │
├──────────────────────────────────────────────────────┤
│  1. Request Validation                               │
│     - File type check                                │
│     - File size check                                │
│     - MIME type verification                         │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│              Text Extraction Layer                   │
├──────────────────────────────────────────────────────┤
│  • PDF Handler (pdf-parse)                           │
│  • DOCX Handler (mammoth)                            │
│  • Text Normalization                                │
└────────────────────┬─────────────────────────────────┘
                     │ Raw CV Text
                     ▼
┌──────────────────────────────────────────────────────┐
│              Parsing & Analysis Engine               │
├──────────────────────────────────────────────────────┤
│  • Section Detector                                  │
│  • Keyword Matcher                                   │
│  • Pattern Analyzer                                  │
│  • Content Evaluator                                 │
└────────────────────┬─────────────────────────────────┘
                     │ Parsed Data
                     ▼
┌──────────────────────────────────────────────────────┐
│                Scoring Engine                        │
├──────────────────────────────────────────────────────┤
│  • Apply Rubric Rules                                │
│  • Calculate Category Scores                         │
│  • Generate Feedback Messages                        │
│  • Compute Total Score                               │
└────────────────────┬─────────────────────────────────┘
                     │ Score Result
                     ▼
┌──────────────────────────────────────────────────────┐
│           Response Formatter                         │
│           (JSON Response)                            │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
                  Frontend
                  (Display Results)
```

## API Specification

### Endpoint: POST /api/score

**Purpose**: Accept CV file upload, analyze, and return scoring results.

**Request**:
```
POST /api/score HTTP/1.1
Content-Type: multipart/form-data
Content-Length: <length>

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="resume.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

**Request Parameters**:
- `file` (required): The CV file (PDF or DOCX)
  - Type: File/Blob
  - Max size: 5MB
  - Allowed types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalScore": 78,
    "grade": "Very Good",
    "message": "Your CV is strong with room for improvement",
    "breakdown": {
      "structure": {
        "score": 12,
        "maxScore": 15,
        "checks": [
          {
            "category": "Contact Information",
            "passed": true,
            "message": "Complete contact information found"
          },
          {
            "category": "Professional Summary",
            "passed": false,
            "message": "Missing professional summary section"
          },
          {
            "category": "Work Experience",
            "passed": true,
            "message": "Work experience section present"
          },
          {
            "category": "Education",
            "passed": true,
            "message": "Education section present"
          },
          {
            "category": "Skills",
            "passed": true,
            "message": "Skills section present"
          }
        ]
      },
      "skills": {
        "score": 15,
        "maxScore": 20,
        "checks": [
          {
            "category": "Skills Section",
            "passed": true,
            "message": "Skills section present"
          },
          {
            "category": "Technical Skills",
            "passed": true,
            "message": "8 technical skills found",
            "details": ["Python", "JavaScript", "React", "SQL", "Git", "Docker", "AWS", "Node.js"]
          },
          {
            "category": "Soft Skills",
            "passed": true,
            "message": "2 soft skills mentioned"
          }
        ]
      },
      "experience": {
        "score": 22,
        "maxScore": 30,
        "checks": [
          {
            "category": "Section Present",
            "passed": true,
            "message": "Experience section with dates found"
          },
          {
            "category": "Bullet Points",
            "passed": false,
            "message": "Limited use of bullet points"
          },
          {
            "category": "Action Verbs",
            "passed": true,
            "message": "5 bullet points start with action verbs"
          },
          {
            "category": "Quantified Achievements",
            "passed": true,
            "message": "3 quantifiable results found"
          },
          {
            "category": "Detail Level",
            "passed": true,
            "message": "Good detail in job descriptions"
          }
        ]
      },
      "education": {
        "score": 15,
        "maxScore": 15,
        "checks": [
          {
            "category": "Section Present",
            "passed": true,
            "message": "Education section found"
          },
          {
            "category": "Degree Details",
            "passed": true,
            "message": "Degree and institution present"
          },
          {
            "category": "Dates",
            "passed": true,
            "message": "Graduation year included"
          }
        ]
      },
      "formatting": {
        "score": 14,
        "maxScore": 20,
        "checks": [
          {
            "category": "Length",
            "passed": true,
            "message": "Appropriate length (2 pages)"
          },
          {
            "category": "White Space",
            "passed": false,
            "message": "Text is somewhat dense"
          },
          {
            "category": "Bullet Usage",
            "passed": true,
            "message": "Bullets used in some sections"
          },
          {
            "category": "Consistency",
            "passed": true,
            "message": "Consistent formatting throughout"
          }
        ]
      }
    },
    "recommendations": [
      {
        "priority": 1,
        "title": "Add a Professional Summary",
        "description": "Include 2-3 sentences at the top of your CV highlighting your key strengths and career goals.",
        "category": "structure"
      },
      {
        "priority": 2,
        "title": "Use More Bullet Points in Experience",
        "description": "Format all job descriptions as bullet lists for better readability and scannability.",
        "category": "experience"
      },
      {
        "priority": 3,
        "title": "Improve White Space",
        "description": "Add more spacing between sections to make your CV easier to read.",
        "category": "formatting"
      }
    ],
    "metadata": {
      "wordCount": 850,
      "estimatedPages": 2,
      "processingTime": 1.24,
      "version": "1.0.0"
    }
  }
}
```

**Error Responses**:

**400 Bad Request** - Invalid file:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF and DOCX files are supported",
    "details": "Received file type: image/png"
  }
}
```

**400 Bad Request** - File too large:
```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 5MB limit",
    "details": "File size: 7.2MB"
  }
}
```

**422 Unprocessable Entity** - Extraction failed:
```json
{
  "success": false,
  "error": {
    "code": "EXTRACTION_FAILED",
    "message": "Could not extract text from file",
    "details": "This may be a scanned PDF. Please use a text-based PDF or DOCX file.",
    "suggestions": [
      "Export your CV as a new PDF from Word/Google Docs",
      "Ensure the file is not password-protected",
      "Try uploading a DOCX version instead"
    ]
  }
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": "Please try again or contact support if the issue persists"
  }
}
```

## Implementation Details

### API Route Handler

**File**: `/src/app/api/score/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analyzeCV } from '@/lib/cv-analyzer';
import { validateFile } from '@/lib/validators';
import { extractTextFromFile } from '@/lib/text-extraction';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file upload
    maxDuration: 10, // Vercel function timeout (seconds)
  },
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided',
          },
        },
        { status: 400 }
      );
    }
    
    // 2. Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: validation.errorCode,
            message: validation.message,
            details: validation.details,
          },
        },
        { status: 400 }
      );
    }
    
    // 3. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 4. Extract text
    const extractionResult = await extractTextFromFile(buffer, file.type);
    
    if (!extractionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EXTRACTION_FAILED',
            message: extractionResult.error,
            details: extractionResult.details,
            suggestions: extractionResult.suggestions,
          },
        },
        { status: 422 }
      );
    }
    
    // 5. Analyze CV
    const analysisResult = await analyzeCV(extractionResult.text);
    
    // 6. Add metadata
    const processingTime = (Date.now() - startTime) / 1000;
    analysisResult.metadata = {
      ...analysisResult.metadata,
      processingTime,
      version: '1.0.0',
    };
    
    // 7. Return results
    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}
```

### File Validation

**File**: `/src/lib/validators.ts`

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateFile(file: File) {
  // Check file exists
  if (!file || file.size === 0) {
    return {
      valid: false,
      errorCode: 'EMPTY_FILE',
      message: 'File is empty',
    };
  }
  
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      errorCode: 'INVALID_FILE_TYPE',
      message: 'Only PDF and DOCX files are supported',
      details: `Received file type: ${file.type}`,
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      errorCode: 'FILE_TOO_LARGE',
      message: 'File size exceeds 5MB limit',
      details: `File size: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }
  
  // Check file name (optional: prevent malicious filenames)
  const fileName = file.name;
  if (fileName.length > 255 || /[<>:"/\\|?*\x00-\x1F]/.test(fileName)) {
    return {
      valid: false,
      errorCode: 'INVALID_FILENAME',
      message: 'Invalid file name',
    };
  }
  
  return { valid: true };
}
```

### Text Extraction Module

**File**: `/src/lib/text-extraction.ts`

```typescript
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<{ success: boolean; text?: string; error?: string; details?: string; suggestions?: string[] }> {
  
  try {
    let text: string;
    
    if (mimeType === 'application/pdf') {
      text = await extractPdfText(buffer);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractDocxText(buffer);
    } else {
      return {
        success: false,
        error: 'Unsupported file type',
      };
    }
    
    // Validate extracted text
    if (!text || text.trim().length < 50) {
      return {
        success: false,
        error: 'Could not extract sufficient text from file',
        details: 'The file may be empty, corrupted, or image-based (scanned PDF).',
        suggestions: [
          'Ensure the PDF contains selectable text (not just images)',
          'Try re-exporting the file from your editor',
          'Use a DOCX file instead if possible',
        ],
      };
    }
    
    // Normalize text
    text = normalizeText(text);
    
    return {
      success: true,
      text,
    };
    
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      success: false,
      error: 'Failed to extract text',
      details: error.message,
    };
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

function normalizeText(text: string): string {
  // Fix common encoding issues
  text = text.replace(/â€™/g, "'");
  text = text.replace(/â€"/g, "—");
  text = text.replace(/â€œ/g, '"');
  text = text.replace(/â€/g, '"');
  
  // Normalize whitespace
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remove form feeds (page breaks)
  text = text.replace(/\f/g, '\n\n');
  
  // Trim each line
  text = text
    .split('\n')
    .map(line => line.trim())
    .join('\n');
  
  // Remove hyphenation at line breaks
  text = text.replace(/-\n/g, '');
  
  return text.trim();
}
```

### CV Analyzer Module

**File**: `/src/lib/cv-analyzer.ts`

```typescript
import { detectSections } from './parsers/section-detector';
import { countKeywords } from './parsers/keyword-counter';
import { analyzeFormatting } from './parsers/formatting-analyzer';
import { calculateScore } from './scoring/score-calculator';
import { generateFeedback } from './scoring/feedback-generator';

export interface CVAnalysisResult {
  totalScore: number;
  grade: string;
  message: string;
  breakdown: any;
  recommendations: any[];
  metadata: any;
}

export async function analyzeCV(text: string): Promise<CVAnalysisResult> {
  // 1. Parse CV sections
  const sections = detectSections(text);
  
  // 2. Extract section content
  const experienceText = sections.experience?.content || '';
  const educationText = sections.education?.content || '';
  const skillsText = sections.skills?.content || '';
  
  // 3. Count keywords
  const technicalSkills = countKeywords.technical(text);
  const softSkills = countKeywords.soft(text);
  const actionVerbs = countKeywords.actionVerbs(experienceText);
  
  // 4. Analyze patterns
  const bullets = analyzeFormatting.bullets(text);
  const quantification = analyzeFormatting.quantification(experienceText);
  const dates = analyzeFormatting.dates(text);
  const degrees = countKeywords.degrees(educationText);
  const pageInfo = analyzeFormatting.estimatePages(text);
  const whitespace = analyzeFormatting.whitespace(text);
  const consistency = analyzeFormatting.consistency(text);
  
  // 5. Compile analysis data
  const analysisData = {
    sections,
    keywords: {
      technical: technicalSkills,
      soft: softSkills,
      actionVerbs,
      degrees,
    },
    formatting: {
      bullets,
      quantification,
      dates,
      pageInfo,
      whitespace,
      consistency,
    },
  };
  
  // 6. Calculate scores
  const scoreResult = calculateScore(analysisData);
  
  // 7. Generate feedback
  const feedback = generateFeedback(analysisData, scoreResult);
  
  // 8. Determine grade
  const grade = getGrade(scoreResult.total);
  const message = getGradeMessage(scoreResult.total);
  
  return {
    totalScore: scoreResult.total,
    grade,
    message,
    breakdown: scoreResult.breakdown,
    recommendations: feedback.recommendations,
    metadata: {
      wordCount: text.split(/\s+/).length,
      estimatedPages: pageInfo.finalEstimate,
    },
  };
}

function getGrade(score: number): string {
  if (score >= 86) return 'Excellent';
  if (score >= 76) return 'Very Good';
  if (score >= 61) return 'Good';
  if (score >= 41) return 'Fair';
  return 'Needs Improvement';
}

function getGradeMessage(score: number): string {
  if (score >= 86) return 'Outstanding CV! You\'re ready for top opportunities.';
  if (score >= 76) return 'Your CV is strong with only minor improvements needed.';
  if (score >= 61) return 'Good CV with room for improvement.';
  if (score >= 41) return 'Your CV has potential but needs significant refinement.';
  return 'Your CV requires major improvements before applying.';
}
```

### Score Calculator

**File**: `/src/lib/scoring/score-calculator.ts`

```typescript
export function calculateScore(analysisData: any) {
  const scores = {
    structure: calculateStructureScore(analysisData),
    skills: calculateSkillsScore(analysisData),
    experience: calculateExperienceScore(analysisData),
    education: calculateEducationScore(analysisData),
    formatting: calculateFormattingScore(analysisData),
  };
  
  const total = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
  
  return {
    total,
    breakdown: scores,
  };
}

function calculateStructureScore(data: any) {
  const checks: any[] = [];
  let score = 0;
  
  // Contact Info (3 pts)
  if (data.sections.hasContact?.email && data.sections.hasContact?.phone) {
    score += 3;
    checks.push({
      category: 'Contact Information',
      passed: true,
      message: 'Complete contact information found',
    });
  } else {
    checks.push({
      category: 'Contact Information',
      passed: false,
      message: 'Missing or incomplete contact info',
    });
  }
  
  // Summary (3 pts)
  if (data.sections.hasSummary) {
    score += 3;
    checks.push({
      category: 'Professional Summary',
      passed: true,
      message: 'Professional summary present',
    });
  } else {
    checks.push({
      category: 'Professional Summary',
      passed: false,
      message: 'Missing professional summary section',
    });
  }
  
  // Experience (3 pts)
  if (data.sections.hasExperience) {
    score += 3;
    checks.push({
      category: 'Work Experience',
      passed: true,
      message: 'Work experience section present',
    });
  } else {
    checks.push({
      category: 'Work Experience',
      passed: false,
      message: 'Work experience section not found',
    });
  }
  
  // Education (3 pts)
  if (data.sections.hasEducation) {
    score += 3;
    checks.push({
      category: 'Education',
      passed: true,
      message: 'Education section present',
    });
  } else {
    checks.push({
      category: 'Education',
      passed: false,
      message: 'Education section not found',
    });
  }
  
  // Skills (3 pts)
  if (data.sections.hasSkills) {
    score += 3;
    checks.push({
      category: 'Skills',
      passed: true,
      message: 'Skills section present',
    });
  } else {
    checks.push({
      category: 'Skills',
      passed: false,
      message: 'Skills section not found',
    });
  }
  
  return {
    score,
    maxScore: 15,
    checks,
  };
}

function calculateSkillsScore(data: any) {
  const checks: any[] = [];
  let score = 0;
  
  // Skills section present (5 pts)
  if (data.sections.hasSkills) {
    score += 5;
    checks.push({
      category: 'Skills Section',
      passed: true,
      message: 'Skills section present',
    });
  } else {
    checks.push({
      category: 'Skills Section',
      passed: false,
      message: 'No dedicated skills section',
    });
  }
  
  // Technical skills (10 pts)
  const techCount = data.keywords.technical.count;
  let techScore = 0;
  if (techCount >= 10) techScore = 10;
  else if (techCount >= 7) techScore = 8;
  else if (techCount >= 5) techScore = 6;
  else if (techCount >= 3) techScore = 4;
  else if (techCount >= 1) techScore = 2;
  
  score += techScore;
  checks.push({
    category: 'Technical Skills',
    passed: techCount >= 5,
    message: `${techCount} technical skills found`,
    details: data.keywords.technical.skills.slice(0, 10),
  });
  
  // Soft skills (5 pts)
  const softCount = data.keywords.soft.count;
  let softScore = 0;
  if (softCount >= 3) softScore = 5;
  else if (softCount === 2) softScore = 3;
  else if (softCount === 1) softScore = 1;
  
  score += softScore;
  checks.push({
    category: 'Soft Skills',
    passed: softCount >= 2,
    message: `${softCount} soft skills mentioned`,
  });
  
  return {
    score,
    maxScore: 20,
    checks,
  };
}

// Similar functions for experience, education, formatting...
// (Implement based on RFC-002 rubric)
```

### Feedback Generator

**File**: `/src/lib/scoring/feedback-generator.ts`

```typescript
export function generateFeedback(analysisData: any, scoreResult: any) {
  const recommendations: any[] = [];
  let priority = 1;
  
  // Check each failing criteria and generate recommendations
  const allChecks = Object.values(scoreResult.breakdown).flatMap(
    (category: any) => category.checks
  );
  
  for (const check of allChecks) {
    if (!check.passed) {
      const recommendation = createRecommendation(check, priority);
      if (recommendation) {
        recommendations.push(recommendation);
        priority++;
      }
    }
  }
  
  // Sort by priority (most impactful first)
  recommendations.sort((a, b) => a.priority - b.priority);
  
  // Return top 5 recommendations
  return {
    recommendations: recommendations.slice(0, 5),
  };
}

function createRecommendation(check: any, priority: number) {
  const templates = {
    'Professional Summary': {
      title: 'Add a Professional Summary',
      description: 'Include 2-3 sentences at the top of your CV highlighting your key strengths and career goals.',
      category: 'structure',
    },
    'Bullet Points': {
      title: 'Use Bullet Points in Experience',
      description: 'Format all job descriptions as bullet lists for better readability and scannability.',
      category: 'experience',
    },
    // Add more templates...
  };
  
  const template = templates[check.category];
  if (!template) return null;
  
  return {
    priority,
    ...template,
  };
}
```

## Performance Optimization

### Caching Strategy

```typescript
import { LRUCache } from 'lru-cache';

// Cache for regex patterns and keyword lists
const patternCache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
});

// Cache for file hashes (to avoid reprocessing same file)
const resultCache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 15, // 15 minutes
});

export async function analyzeCVWithCache(text: string, fileHash: string) {
  // Check cache
  const cached = resultCache.get(fileHash);
  if (cached) {
    return cached;
  }
  
  // Analyze
  const result = await analyzeCV(text);
  
  // Store in cache
  resultCache.set(fileHash, result);
  
  return result;
}
```

### Parallel Processing

```typescript
export async function analyzeCV(text: string) {
  // Run independent analyses in parallel
  const [sections, keywords, formatting] = await Promise.all([
    detectSections(text),
    Promise.all([
      countKeywords.technical(text),
      countKeywords.soft(text),
    ]),
    Promise.all([
      analyzeFormatting.bullets(text),
      analyzeFormatting.quantification(text),
      analyzeFormatting.estimatePages(text),
    ]),
  ]);
  
  // Continue with scoring...
}
```

## Error Handling & Logging

### Structured Error Classes

```typescript
export class CVAnalysisError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: string,
    public suggestions?: string[]
  ) {
    super(message);
    this.name = 'CVAnalysisError';
  }
}

export class FileValidationError extends CVAnalysisError {
  constructor(message: string, details?: string) {
    super('FILE_VALIDATION_ERROR', message, details);
  }
}

export class TextExtractionError extends CVAnalysisError {
  constructor(message: string, details?: string, suggestions?: string[]) {
    super('TEXT_EXTRACTION_ERROR', message, details, suggestions);
  }
}
```

### Logging

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export function logAnalysis(result: any, duration: number) {
  logger.info({
    event: 'cv_analysis_complete',
    score: result.totalScore,
    duration,
    wordCount: result.metadata.wordCount,
  });
}

export function logError(error: Error, context: any) {
  logger.error({
    event: 'cv_analysis_error',
    error: error.message,
    stack: error.stack,
    context,
  });
}
```

## Security Considerations

### Input Sanitization

- Validate file types strictly (check magic bytes, not just extension)
- Limit file size to prevent memory exhaustion
- Sanitize extracted text before processing (remove potentially malicious content)

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  if (!success) {
    throw new Error('Rate limit exceeded');
  }
  
  return { remaining, reset };
}
```

### Content Security

- Don't log sensitive CV content
- Ensure memory is freed after processing
- No persistent storage of CV data

## Testing

### Unit Tests

```typescript
describe('Text Extraction', () => {
  it('should extract text from valid PDF', async () => {
    const buffer = readFileSync('./test/fixtures/sample.pdf');
    const result = await extractTextFromFile(buffer, 'application/pdf');
    
    expect(result.success).toBe(true);
    expect(result.text).toContain('Experience');
  });
  
  it('should handle corrupted PDF', async () => {
    const buffer = Buffer.from('invalid pdf data');
    const result = await extractTextFromFile(buffer, 'application/pdf');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('Score Calculator', () => {
  it('should calculate correct total score', () => {
    const mockData = createMockAnalysisData();
    const result = calculateScore(mockData);
    
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests

```typescript
describe('Full CV Analysis', () => {
  it('should analyze complete CV and return valid result', async () => {
    const cvText = readFileSync('./test/fixtures/strong-cv.txt', 'utf-8');
    const result = await analyzeCV(cvText);
    
    expect(result.totalScore).toBeGreaterThan(70);
    expect(result.breakdown).toHaveProperty('structure');
    expect(result.recommendations).toBeInstanceOf(Array);
  });
});
```

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-002 (Scoring Rubric), RFC-003 (Text Parsing Rules)  
**Next Steps**: Implement frontend in RFC-006

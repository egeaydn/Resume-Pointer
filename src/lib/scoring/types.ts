/**
 * Scoring system types for CV evaluation
 * Based on RFC-002: Scoring Rubric & Criteria
 * Updated for RFC-005: Backend Architecture
 */

export type ScoreCategory = 
  | 'structure'
  | 'technicalSkills'
  | 'workExperience'
  | 'education'
  | 'formatting';

export interface CategoryScore {
  category: ScoreCategory;
  score: number;
  maxScore: number;
  feedback: FeedbackItem[];
}

export interface FeedbackItem {
  type: 'success' | 'warning' | 'error';
  message: string;
  icon: '✅' | '❌' | '⚠️';
}

/**
 * RFC-005 compliant score result format
 */
export interface ScoreResult {
  totalScore: number;
  grade?: string;
  message?: string;
  breakdown: ScoreBreakdown;
  recommendations?: Recommendation[];
  metadata?: ResultMetadata;
  // Legacy fields (backward compatibility)
  maxScore?: number;
  categoryScores?: CategoryScore[];
  overallFeedback?: string;
  suggestions?: string[];
  timestamp?: number;
}

export interface ScoreBreakdown {
  structure: CategoryResult;
  technicalSkills: CategoryResult;
  workExperience: CategoryResult;
  education: CategoryResult;
  formatting: CategoryResult;
}

export interface CategoryResult {
  score: number;
  maxScore: number;
  details: CategoryDetail[];
}

export interface CategoryDetail {
  category: string;
  passed: boolean;
  message: string;
  details?: string[];
}

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ResultMetadata {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  wordCount?: number;
  estimatedPages?: number;
  processingTime?: number;
  processedAt?: string;
  version?: string;
}

export interface ParsedCV {
  text: string;  // Renamed from rawText for consistency
  rawText?: string;  // Legacy support
  normalizedText?: string;
  sections?: DetectedSection[];
  metadata?: CVMetadata;
  wordCount?: number;
}

export interface DetectedSection {
  name: string;
  content: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export interface CVMetadata {
  wordCount: number;
  lineCount: number;
  hasContactInfo: boolean;
  estimatedPageCount: number;
  fileType: 'pdf' | 'docx';
}

export interface ScoringCriteria {
  category: ScoreCategory;
  maxScore: number;
  checks: ScoringCheck[];
}

export interface ScoringCheck {
  id: string;
  description: string;
  points: number;
  evaluate: (cv: ParsedCV) => CheckResult;
}

export interface CheckResult {
  passed: boolean;
  pointsAwarded: number;
  feedback: string;
}

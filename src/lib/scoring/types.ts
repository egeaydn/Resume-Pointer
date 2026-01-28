/**
 * Scoring system types for CV evaluation
 * Based on RFC-002: Scoring Rubric & Criteria
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

export interface ScoreResult {
  totalScore: number;
  maxScore: number;
  categoryScores: CategoryScore[];
  overallFeedback: string;
  suggestions: string[];
  timestamp: number;
}

export interface ParsedCV {
  rawText: string;
  normalizedText: string;
  sections: DetectedSection[];
  metadata: CVMetadata;
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

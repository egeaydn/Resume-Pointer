/**
 * Scoring constants and configuration
 * Based on RFC-002: 100-point scoring system across 5 categories
 */

import { ScoreCategory } from './types';

export const SCORING_WEIGHTS: Record<ScoreCategory, number> = {
  structure: 15,
  technicalSkills: 20,
  workExperience: 30,
  education: 15,
  formatting: 20,
};

export const TOTAL_MAX_SCORE = 100;

export const CATEGORY_NAMES: Record<ScoreCategory, string> = {
  structure: 'CV Structure & Sections',
  technicalSkills: 'Technical Skills',
  workExperience: 'Work Experience Content',
  education: 'Education',
  formatting: 'Formatting & Readability',
};

export const CATEGORY_DESCRIPTIONS: Record<ScoreCategory, string> = {
  structure: 'Presence and organization of key CV sections',
  technicalSkills: 'Technical competencies and skill keywords',
  workExperience: 'Quality and presentation of work experience',
  education: 'Educational background and qualifications',
  formatting: 'Overall readability and professional appearance',
};

// Score ranges for overall feedback
export const SCORE_RANGES = {
  EXCELLENT: { min: 85, max: 100, label: 'Excellent', color: '#059669' },
  GOOD: { min: 70, max: 84, label: 'Good', color: '#10B981' },
  FAIR: { min: 55, max: 69, label: 'Fair', color: '#F59E0B' },
  NEEDS_IMPROVEMENT: { min: 40, max: 54, label: 'Needs Improvement', color: '#EF4444' },
  POOR: { min: 0, max: 39, label: 'Poor', color: '#DC2626' },
} as const;

// File processing limits
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx'],
} as const;

// Required sections for structure scoring
export const REQUIRED_SECTIONS = [
  'contact',
  'experience',
  'education',
  'skills',
] as const;

export const OPTIONAL_SECTIONS = [
  'summary',
  'objective',
  'projects',
  'certifications',
  'languages',
  'awards',
  'publications',
  'volunteer',
] as const;

// Minimum counts for various elements
export const MINIMUM_THRESHOLDS = {
  WORD_COUNT: 150,
  TECHNICAL_SKILLS: 3,
  WORK_EXPERIENCES: 1,
  EDUCATION_ENTRIES: 1,
  BULLET_POINTS: 3,
  QUANTIFIED_ACHIEVEMENTS: 1,
} as const;

// Text quality metrics
export const QUALITY_METRICS = {
  AVERAGE_WORDS_PER_LINE: { min: 8, max: 15 },
  MAX_LINE_LENGTH: 100,
  MIN_EXPERIENCE_BULLET_LENGTH: 20,
  MAX_EXPERIENCE_BULLET_LENGTH: 150,
} as const;
